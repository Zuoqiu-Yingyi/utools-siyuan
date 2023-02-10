export {
    MODE,
    Leaf,
    Container,
    BlockType,
    BlockSubType,
    Method,
    GroupBy,
    OrderBy,
    SortMode,

    openSiyuanURL,
    washNotebooks,
    updateNotebooks,

    SiyuanClient,
};

import { Ref, ShallowReactive } from "vue";
import { Status } from "./status";
import {
    ID,

    Notebook,
    INotebooks,

    IResponse,

    IResponse_version,
    IResponse_lsNotebooks,

    IPayload_fullTextSearchBlock,
    IResponse_fullTextSearchBlock,

    IPayload_getBlockBreadcrumb,
    IResponse_getBlockBreadcrumb,

    IPayload_searchDocs,
    IResponse_searchDocs,

    IPayload_listDocsByPath,
    IResponse_listDocsByPath,

    IResponse_getRecentDocs,
} from "./../types/siyuan";

/* 叶子块 */
enum Leaf {
    /* 可搜索时过滤 */
    h, // 标题块
    p, // 段落块
    m, // 公式块
    t, // 表格块
    c, // 代码块
    html, // HTML 块

    /* 不可搜索时过滤 */
    tb, // 分隔线
    audio, // 音频块
    video, // 视频块
    iframe, // iframe
    widget, // 挂件块
    query_embed, // 嵌入块
}

/* 容器块 */
enum Container {
    d, // 文档块
    s, // 超级块
    b, // 引述块
    l, // 列表块
    i, // 列表项
}

/* 块级节点类型 */
enum BlockType {
    NodeNotebook = "NodeNotebook", // <icon-book />
    NodeFolder = "NodeFolder", // <icon-book />

    NodeDocument = "NodeDocument", // 🍞 <icon-file />
    NodeSuperBlock = "NodeSuperBlock", // <icon-interaction />
    NodeBlockquote = "NodeBlockquote", // <icon-quote />
    NodeList = "NodeList", // <icon-list />
    NodeListItem = "NodeListItem", // 🍞 <icon-mind-mapping />

    NodeHeading = "NodeHeading", // 🍞
    NodeParagraph = "NodeParagraph", // 🍞 <icon-language />
    NodeMathBlock = "NodeMathBlock",  // 🍞 <icon-formula />
    NodeTable = "NodeTable", // 🍞 <icon-nav />
    NodeCodeBlock = "NodeCodeBlock", // 🍞 <icon-code-block />
    NodeHTMLBlock = "NodeHTMLBlock", // 🍞 <icon-code />

    NodeThematicBreak = "NodeThematicBreak", // 🍞 <icon-minus />
    NodeAudio = "NodeAudio", // 🍞 <icon-file-audio />
    NodeVideo = "NodeVideo", // 🍞 <icon-file-video />
    NodeIFrame = "NodeIFrame", // 🍞 <icon-cloud />
    NodeWidget = "NodeWidget", // 🍞 <icon-apps />
    NodeBlockQueryEmbed = "NodeBlockQueryEmbed", // 🍞 <icon-find-replace />
}

/* 块级节点子类型 */
enum BlockSubType {
    h1 = "h1", // <icon-h1 />
    h2 = "h2", // <icon-h2 />
    h3 = "h3", // <icon-h3 />
    h4 = "h4", // <icon-h4 />
    h5 = "h5", // <icon-h5 />
    h6 = "h6", // <icon-h6 />
    u = "u", // <icon-unordered-list />
    o = "o", // <icon-ordered-list />
    t = "t", // <icon-select-all />
    none = "",
}

/**
 * 搜索方案
 * REF: https://github.com/siyuan-note/siyuan/blob/145243e0583b7259fed143833a648e61f8863528/kernel/api/search.go#L221
 */
enum Method {
    keyword, // 关键字
    querySyntax, // 查询语法
    sql, // SQL
    regex, // 正则表达式
}

/**
 * 搜索结果分组方案
 * REF: https://github.com/siyuan-note/siyuan/blob/145243e0583b7259fed143833a648e61f8863528/kernel/api/search.go#L231
 */
enum GroupBy {
    noGroupBy, // 不分组
    group, // 按文档分组
}

/**
 * 搜索结果排序方案
 * REF: https://github.com/siyuan-note/siyuan/blob/145243e0583b7259fed143833a648e61f8863528/kernel/api/search.go#L226
 */
enum OrderBy {
    type, // 按块类型（默认）
    createdASC, // 创建时间升序
    createdDESC, // 创建时间降序
    modifiedASC, // 修改时间升序
    modifiedDESC, // 修改时间降序
    sortByContent, // 按原文内容顺序（仅限按文档分组）
    sortByRankAsc, // 按相关度升序
    sortByRankDesc, // 按相关度降序
}

enum MODE {
    app = "app",
    desktop = "desktop",
    export = "export",
    mobile = "mobile",
}

/**
 * 文档排序方案
 * REF: [util package - github.com/siyuan-note/siyuan/kernel/util - Go Packages](https://pkg.go.dev/github.com/siyuan-note/siyuan/kernel/util)
 */
enum SortMode {
    SortModeNameASC,         // 0：文件名字母升序
    SortModeNameDESC,        // 1：文件名字母降序
    SortModeUpdatedASC,      // 2：文件更新时间升序
    SortModeUpdatedDESC,     // 3：文件更新时间降序
    SortModeAlphanumASC,     // 4：文件名自然数升序
    SortModeAlphanumDESC,    // 5：文件名自然数降序
    SortModeCustom,          // 6：自定义排序
    SortModeRefCountASC,     // 7：引用数升序
    SortModeRefCountDESC,    // 8：引用数降序
    SortModeCreatedASC,      // 9：文件创建时间升序
    SortModeCreatedDESC,     // 10：文件创建时间降序
    SortModeSizeASC,         // 11：文件大小升序
    SortModeSizeDESC,        // 12：文件大小降序
    SortModeSubDocCountASC,  // 13：子文档数升序
    SortModeSubDocCountDESC, // 14：子文档数降序
}

/* 打开思源 URL */
function openSiyuanURL(id: ID, focus = false): void {
    const url = new URL(`siyuan://blocks/${id}`);
    if (focus) url.searchParams.set("focus", "1");
    window.open(url, "_blank");
}

/**
 * 清洗笔记本列表
 * - 过滤未打开的笔记本
 * - 笔记本排序
 */
function washNotebooks(notebooks: Notebook[]): Notebook[] {
    return notebooks.filter(notebook => !notebook.closed).sort((a, b) => a.sort - b.sort);
}

/* 更新笔记本列表 */
async function updateNotebooks(
    notebooks: ShallowReactive<INotebooks>,
    client: InstanceType<typeof SiyuanClient>,
) {
    if (notebooks.list.length === 0) {
        const response = await client.lsNotebooks();
        notebooks.list = washNotebooks(response.data.notebooks);
    }
}

class SiyuanClient {

    public readonly method: string = "POST"; // 请求方法
    public readonly headers: {
        Authorization: string;
        [propName: string]: string;
    }; // 请求头

    constructor(
        public url: URL,
        public token: string,
        protected _status?: Ref<Status>,
        protected _message?: Ref<string>,
    ) {
        this.headers = {
            Authorization: `Token ${this.token}`,
        };
    }

    /* 更新配置 */
    public update(
        url: URL,
        token: string,
    ) {
        this.url = url;
        this.token = token;
        this.headers.Authorization = `Token ${this.token}`;
    }

    /* 更新状态 */
    public set status(status: Status) {
        if (this._status?.value) {
            this._status.value = status;
        }
    }
    public set message(message: string) {
        if (this._message?.value !== undefined) {
            this._message.value = message;
        }
    }

    /* 获得思源样式文件 URL */
    public async getSiyuanStyleURL(mode: MODE = MODE.desktop): Promise<URL> {
        const style_url = new URL(this.url);
        switch (mode) {
            case MODE.export: // 导出样式文件
                style_url.pathname = `/stage/build/export/base.css`;
                return style_url;
            default:
                style_url.pathname = `/stage/build/${mode}/index.html`;
                style_url.searchParams.set("r", new Date().getTime().toString(36));
                break;
        }

        /* 获得 index.html 内容 */
        const response = await fetch(
            style_url.href,
            {
                method: "GET",
                headers: this.headers,
            },
        );

        if (response.ok) {
            const html = await response.text();

            /* 在 index.html 中匹配 base.*.css 文件名 */
            const result = /<link href="(?<style>base\.[0-9a-f]{20}\.css)" rel="stylesheet">/.exec(html);
            if (!result?.groups?.style) {
                // console.error(result);
                throw new Error(`Can't match to a style file.`);
            }

            style_url.pathname = `/stage/build/${mode}/${result?.groups?.style}`;
            return style_url;
        }
        else {
            throw new Error(response.statusText);
        }
    }

    /* 获得内核版本 */
    public async version(): Promise<IResponse_version> {
        const response = await this._request("/api/system/version") as IResponse_version;
        return response;
    }

    /* 列出笔记本信息 */
    public async lsNotebooks(): Promise<IResponse_lsNotebooks> {
        const response = await this._request("/api/notebook/lsNotebooks") as IResponse_lsNotebooks;
        return response;
    }

    /* 查询最近打开的文档 */
    public async getRecentDocs(): Promise<IResponse_getRecentDocs> {
        const response = await this._request("/api/storage/getRecentDocs") as IResponse_getRecentDocs;
        return response;
    }

    /* 全局搜索 */
    public async fullTextSearchBlock(payload: IPayload_fullTextSearchBlock): Promise<IResponse_fullTextSearchBlock> {
        const response = await this._request("/api/search/fullTextSearchBlock", payload) as IResponse_fullTextSearchBlock;
        return response;
    }

    /* 获得指定块的面包屑 */
    public async getBlockBreadcrumb(payload: IPayload_getBlockBreadcrumb): Promise<IResponse_getBlockBreadcrumb> {
        const response = await this._request("/api/block/getBlockBreadcrumb", payload) as IResponse_getBlockBreadcrumb;
        return response;
    }

    /* 搜索文档 */
    public async searchDocs(payload: IPayload_searchDocs): Promise<IResponse_searchDocs> {
        const response = await this._request("/api/filetree/searchDocs", payload) as IResponse_searchDocs;
        return response;
    }

    /* 查询子文档 */
    public async listDocsByPath(payload: IPayload_listDocsByPath): Promise<IResponse_listDocsByPath> {
        const response = await this._request("/api/filetree/listDocsByPath", payload) as IResponse_listDocsByPath;
        return response;
    }

    protected async _request(
        pathname: string,
        payload: object = {},
    ): Promise<IResponse> {
        this.status = Status.processing;
        this.message = "";

        this.url.pathname = pathname;
        let response;

        try {
            response = await fetch(
                this.url.href,
                {
                    body: JSON.stringify(payload),
                    method: this.method,
                    headers: this.headers,
                },
            );
        } catch (error) {
            this.status = Status.danger;
            this.message = String(error);
            throw error;
        }

        if (response.ok) {
            const body: IResponse = await response.json();

            if (body.code === 0) {
                this.status = Status.success;
                this.message = body.msg;
                return body;
            }
            else {
                const error = new Error(body.msg);
                this.status = Status.warning;
                this.message = String(error);
                throw error;
            }
        }
        else {
            const error = new Error(response.statusText);
            this.status = Status.danger;
            this.message = String(error);
            throw error;
        }
    }
}
