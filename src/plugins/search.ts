export {
    Search,
};

import {
    ref,
    Ref,
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
} from "./../types/siyuan";
import { IPlugin } from "./../types/utools";
import { IConfig } from "./../types/config";

import { Icon } from "./../utils/icon";
import { Status } from "./../utils/status";
import {
    SiyuanClient,
    updateNotebooks,
} from "./../utils/siyuan";


class Search extends Object implements IPlugin {
    public readonly code: string;
    public readonly mode = "list" as TplFeatureMode;

    protected _dom = document.createElement('span');
    protected _config: IConfig | undefined;
    protected _client: InstanceType<typeof SiyuanClient> | undefined;
    protected _status: Ref<Status>;
    protected _message: Ref<string>;
    protected _notebooks: ShallowReactive<INotebooks>;

    // 子输入框为空时的占位符，默认为字符串"搜索"
    public placeholder = "搜索";

    constructor(code: string) {
        super();
        this.code = code;
        this._status = ref(Status.normal);
        this._message = ref("");
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
                    notebook.icon = Icon.icon2emojis(notebook.icon, this._client!.url);
                    this._notebooks.map.set(notebook.id, notebook);
                });
            },
        );
    }

    /* 构造 siyuan url */
    protected buildSiyuanURL(id: ID, focus = false): URL {
        const url = new URL(`siyuan://blocks/${id}`);
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
                    // TODO 设置块类型 icon
                    icon: notebook?.icon ?? Icon.default.notebook.wrap,
                    url: url.href,
                });
            }
        });
        return list;
    }

    // 进入插件应用时调用（可选）
    async enter(action: Action, callbackSetList: CallbackSetList): Promise<void> {
        /* 读取用户配置 */
        const storage = utools.dbStorage.getItem(import.meta.env.VITE_STORAGE_KEY);
        if (storage) {
            this._config = storage.config;
            this._client = new SiyuanClient(new URL(this._config!.server.url), this._config!.server.token, this._status, this._message);
            // TODO 根据配置选项设置 placeholder

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
                        icon: Icon.icon2emojis(doc.icon, this._client!.url),
                        url: url.href,
                    } as CallbackListItem;
                }),
            )
        }

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
        const payload = Object.assign({}, this._config?.search, {
            query: searchWord,
        });

        const response = await this._client?.fullTextSearchBlock(payload);

        // 执行 callbackSetList 显示出来
        callbackSetList(this.blocks2list(response?.data.blocks ?? []));

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
        utools.shellOpenExternal(itemData.url!);
        window.utools.hideMainWindow();
    }
}
