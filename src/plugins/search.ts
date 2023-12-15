export {
    Search,
};

import {
    ref,
    watch,
    shallowReactive,
    ShallowReactive,
} from "vue";

import {
    TplFeatureMode,
    Action,
    CallbackSetList,
    CallbackListItem,
} from "utools-helper/dist/template_plugin";

import {
    ID,
    INotebooks,
    Block_fullTextSearchBlock,
    IResponse_fullTextSearchBlock,
} from "./../types/siyuan";
import { IPlugin } from "./../types/utools";
import { IStorage } from "./../types/config";

import { init } from "./../utils/language";
import { merge } from "./../utils/object";
import { IconDataURL } from "./../utils/icon";
import { Status } from "./../utils/status";
import { OpenMode } from "./../utils/open";
import {
    BlockType,
    GroupBy,
    Method,
    NodeHeadingSubType,
    NodeListSubType,
    OrderBy,
    SiyuanClient,
    updateNotebooks,
} from "./../utils/siyuan";

import config_default from "./../config/default";

class Search extends Object implements IPlugin {
    public readonly code: string;
    public readonly mode = "list" as TplFeatureMode;

    protected _i18n = init();
    protected _dom = document.createElement('span');
    protected _status = ref(Status.normal);
    protected _message = ref("");
    protected _config = config_default;
    protected _client = new SiyuanClient(new URL(this._config.server.url), this._config.server.token, this._status, this._message);
    protected _notebooks: ShallowReactive<INotebooks>;

    // 子输入框为空时的占位符，默认为字符串"搜索"
    public placeholder = "搜索";

    constructor(code: string) {
        super();
        this.code = code;
        this._notebooks = shallowReactive<INotebooks>({
            list: [],
            map: new Map(),
        });

        watch(
            this._message,
            status => utools.showNotification(status),
        );

        /* 监听 list 更改时更新 map */
        watch(
            () => this._notebooks.list,
            list => {
                /* 重建映射 */
                this._notebooks.map.clear();
                list.forEach(notebook => {
                    notebook.icon = IconDataURL.icon2emojis(notebook.icon, this._client!.url);
                    this._notebooks.map.set(notebook.id, notebook);
                });
            },
        );

        /* 读取用户配置 */
        this.update();

        /* 设置 placeholder */
        this.placeholder = `${this._i18n.global.t(`search_config.method.label`)
            }: [${this._i18n.global.t(`search_config.method.${Method[this._config.search.method]}`)
            }] - [${this._i18n.global.t(`search_config.groupBy.${GroupBy[this._config.search.groupBy]}`)
            }] - [${this._i18n.global.t(`search_config.orderBy.${OrderBy[this._config.search.orderBy]}`)
            }]`;
    }

    /* 更新配置 */
    protected update() {
        const storage = utools.dbStorage.getItem(import.meta.env.VITE_STORAGE_KEY) as IStorage | void;
        if (storage) {
            merge(this._config, storage.config);
            this._client.update(new URL(this._config.server.url), this._config.server.token);
            this._i18n.global.locale = this._config.other.language.tag;
        }
    }

    /* 构造 siyuan url */
    protected buildSiyuanURL(id: ID, focus = false): URL {
        var url: URL;
        switch (this._config.other.open.mode) {
            default:
            case OpenMode.siyuan_desktop:
                url = new URL(`siyuan://blocks/${id}`);
                break;
            case OpenMode.siyuan_pwa:
                url = new URL(`web+siyuan://blocks/${id}`);
                break;
            case OpenMode.siyuan_web:
                url = new URL(this._config.server.url);
                url.searchParams.set("id", id);
                break;
            case OpenMode.utools_window:
                url = new URL(this._config.server.url);
                url.pathname = "/stage/build/mobile/"
                url.searchParams.set("id", id);
                break;
        }
        if (focus) url.searchParams.set("focus", "1");
        return url;
    }

    /* 将 fullTextSearchBlock[] 转换为 CallbackListItem[] */
    protected blocks2list(blocks: Block_fullTextSearchBlock[]): CallbackListItem[] {
        const list: CallbackListItem[] = [];
        blocks.forEach(block => {
            if (block.children?.length > 0) {
                list.push(...this.blocks2list(block.children));
            }
            else {
                const url = this.buildSiyuanURL(block.id);
                const notebook = this._notebooks.map.get(block.box);
                list.push({
                    title: (this._dom.innerHTML = block.content.replaceAll('<mark>', '「').replaceAll('</mark>', '」'), this._dom).textContent || block.content,
                    description: `${notebook?.name ?? ""}${block.hPath}`,
                    icon: (() => {
                        switch (block.type) {
                            case BlockType.NodeList:
                                return IconDataURL.default.block[block.type][block.subType as unknown as NodeListSubType].wrap;
                            case BlockType.NodeHeading:
                                return IconDataURL.default.block[block.type][block.subType as unknown as NodeHeadingSubType].wrap;
                            default:
                                return IconDataURL.default.block[block.type].wrap;
                        }
                    })(),
                    url: url.href,
                });
            }
        });
        return list;
    }

    // 进入插件应用时调用（可选）
    async enter(action: Action, callbackSetList: CallbackSetList): Promise<void> {
        /* 读取用户配置 */
        this.update();

        /* 更新笔记本列表 */
        await updateNotebooks(this._notebooks, this._client);

        /* 查询最近打开的文档 */
        const response = await this._client.getRecentDocs();

        // 如果进入插件应用就要显示列表数据
        callbackSetList(
            response.data.map(doc => {
                const url = this.buildSiyuanURL(doc.rootID);
                return {
                    title: doc.title,
                    description: url.href,
                    icon: IconDataURL.icon2emojis(doc.icon, this._client!.url),
                    url: url.href,
                } as CallbackListItem;
            }),
        )

        // callbackSetList([
        //     {
        //         title: '这是标题',
        //         description: '这是描述',
        //         icon: '', // 图标(可选)
        //         url: '',
        //     }
        // ]);
    }

    // 子输入框内容变化时被调用 可选 (未设置则无搜索)
    async search(action: Action, searchWord: string, callbackSetList: CallbackSetList) {
        /* 搜索内容为空 */
        if (searchWord.length === 0) {
            this.enter(action, callbackSetList);
            return;
        }

        const payload = Object.assign({}, this._config.search, {
            query: searchWord,
            page: 1,
        });

        const blocks: CallbackListItem[] = [];
        const response = await this._client.fullTextSearchBlock(payload);

        // 执行 callbackSetList 显示出来
        const pageCount = response?.data.pageCount ?? 1; // 查询内容总分页数
        const page_count = this._config.other.maxPage <= 0
            ? pageCount
            : Math.min(pageCount, this._config.other.maxPage); // 需要查询的分页数
        if (page_count > 1) { // 如果需要查询多页数据
            const responses: IResponse_fullTextSearchBlock[] = [];
            responses[0] = response;

            const promise_pool: Promise<IResponse_fullTextSearchBlock>[] = [];
            for (let page = 2; page <= page_count; ++page) {
                payload.page = page;
                promise_pool.push(this._client.fullTextSearchBlock(payload));
            }
            Promise.all(promise_pool)
                .then(res => {
                    responses.push(...res);
                }).finally(() => {
                    responses.forEach(response => blocks.push(...this.blocks2list(response?.data.blocks ?? [])))
                    callbackSetList(blocks);
                });
        }
        else { // 如果仅需要查询第一页数据
            blocks.push(...this.blocks2list(response?.data.blocks ?? []))
            callbackSetList(blocks);
        }

        // callbackSetList([
        //     {
        //         title: '这是标题',
        //         description: '这是描述',
        //         icon: '', // 图标
        //         url: 'https://yuanliao.info',
        //     }
        // ]);
    }

    // 用户选择列表中某个条目时被调用
    select(action: Action, itemData: CallbackListItem, callbackSetList: CallbackSetList) {
        switch (this._config.other.open.mode) {
            case OpenMode.siyuan_desktop:
            case OpenMode.siyuan_pwa:
            case OpenMode.siyuan_web:
                utools.shellOpenExternal(itemData.url!);
                break;

            case OpenMode.utools_window:
            default:
                // REF: https://www.u.tools/docs/developer/ubrowser.html#ubrowser-api
                utools.ubrowser
                    .goto(itemData.url!)
                    .run({
                        show: true,
                        center: true,
                        alwaysOnTop: true,
                    });
                break;
        }
        // window.utools.hideMainWindow();
    }
}
