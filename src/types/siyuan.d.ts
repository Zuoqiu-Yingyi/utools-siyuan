import {
    Method,
    GroupBy,
    OrderBy,
    BlockType,
    BlockSubType,
    SortMode,
} from "./../utils/siyuan";

export type ID = string; // ID 类型

/* 响应体 */
export interface IResponse {
    code: number;
    msg: string;
    data: object | string | number | boolean | null;
}

// /api/notebook/lsNotebooks

export interface Notebook {
    id: ID;
    name: string;
    icon: string;
    sort: number;
    closed: boolean;
}

export interface INotebooks {
    list: Notebook[]; // 笔记本对象列表
    map: Map<string, Notebook>; // 笔记本 ID => 笔记本对象
}

export interface Data_lsNotebooks {
    notebooks: Notebook[];
}

export interface IResponse_lsNotebooks {
    code: number;
    msg: string;
    data: Data_lsNotebooks;
}

// /api/system/version

export interface IResponse_version {
    code: number;
    msg: string;
    data: string;
}

// /api/search/fullTextSearchBlock

/* 块类型 */
export interface BlockTypes {
    heading: boolean; // 标题块
    paragraph: boolean; // 段落块
    mathBlock: boolean; // 公式块
    table: boolean; // 表格块
    codeBlock: boolean; // 代码块
    htmlBlock: boolean; // HTML 块
    embedBlock: boolean; // 嵌入块

    document: boolean; // 文档块
    superBlock: boolean; // 超级块
    blockquote: boolean; // 引述块
    list: boolean; // 列表块
    listItem: boolean; // 列表项
}

export interface IPayload_fullTextSearchBlock {
    groupBy: GroupBy; // 搜索结果分组方案
    method: Method; // 搜索方案
    orderBy: OrderBy; // 搜索结果排序方案
    paths: string[]; // 指定搜索路径(以 *.sy 结尾不包含子文档)
    query: string; // 查询语句
    types: BlockTypes; // 搜索块类型
}

export interface Ial {
    [key: string]: string;
}

export interface Block_fullTextSearchBlock {
    box: string;
    path: string;
    hPath: string;
    id: ID;
    rootID: ID;
    parentID: ID;
    name: string;
    alias: string;
    memo: string;
    tag: string;
    content: string;
    fcontent: string;
    markdown: string;
    folded: boolean;
    type: BlockType;
    subType: BlockSubType;
    refText: string;
    refs?: Block_fullTextSearchBlock[];
    defID: ID;
    defPath: string;
    ial: Ial;
    children: Block_fullTextSearchBlock[];
    depth: number;
    count: number;
    sort: number;
    created: string;
    updated: string;
}

export interface Data_fullTextSearchBlock {
    blocks: Block_fullTextSearchBlock[];
    matchedBlockCount: number;
    matchedRootCount: number;
}

export interface IResponse_fullTextSearchBlock {
    code: number;
    msg: string;
    data: Data_fullTextSearchBlock;
}

// /api/block/getBlockBreadcrumb

export interface IPayload_getBlockBreadcrumb {
    id: ID;
    excludeTypes: BlockType[];
}

export interface Data_getBlockBreadcrumb {
    id: ID;
	name: string;
	type: BlockType;
    subType: BlockSubType;
    children?: Data_getBlockBreadcrumb[];
}

export interface IResponse_getBlockBreadcrumb {
	code: number;
	msg: string;
    data: Data_getBlockBreadcrumb[];
}

// /api/filetree/searchDocs

export interface IPayload_searchDocs {
	k: string;
}

export interface Data_searchDocs {
	box: string;
	boxIcon: string;
	hPath: string;
	path: string;
}

export interface IResponse_searchDocs {
	code: number;
	msg: string;
    data: Data_searchDocs[];
}

// api/filetree/listDocsByPath

export interface IPayload_listDocsByPath {
	notebook: string;
	path: string;
	sort: number;
}

export interface File {
	path: string;
	name: string;
	icon: string;
	name1: string;
	alias: string;
	memo: string;
	bookmark: string;
	id: string;
	count: number;
	size: number;
	hSize: string;
	mtime: number;
	ctime: number;
	hMtime: string;
	hCtime: string;
    sort: SortMode;
	subFileCount: number;
}

export interface Data_listDocsByPath {
	box: string;
	files: File[];
	path: string;
}

export interface IResponse_listDocsByPath {
	code: number;
	msg: string;
    data: Data_listDocsByPath;
}
