import {
    Action,
    IListItem,
} from "utools-helper/dist/template_plugin";

export interface IArgs {

}

/* 页面索引 */
export interface IIndex {
    t: string; // 标题
    d: string; // 描述
    p: string; // 页面路径
}


export interface IPlugin {
    code: string; // 功能代码
    mode: TplFeatureMode; // 功能模式
    placeholder?: string; // 子输入框为空时的占位符，默认为字符串"搜索"
    indexes?: IIndex[]; // 文档模式下的页面索引

    /* 进入插件应用时调用（可选） */
    enter?(action?: Action): IListItem | Promise<IListItem> | IListItem[] | Promise<IListItem[]> | void;

    /* 子输入框内容变化时被调用 可选 (未设置则无搜索) */
    search?(word: string, action?: Action): IListItem | Promise<IListItem> | IListItem[] | Promise<IListItem[]> | void;

    /* 用户选择列表中某个条目时被调用 */
    select?(item: IListItem, action?: Action): IListItem | Promise<IListItem> | IListItem[] | Promise<IListItem[]> | void;
}

// REF [模板插件应用 | uTools](https://u.tools/docs/developer/template.html#preload-js-%E6%96%87%E4%BB%B6)
export interface IExport {
    mode: TplFeatureMode;
    args: IPlugin;
}

export interface IExports {
    [code: string]: IExport;
}
