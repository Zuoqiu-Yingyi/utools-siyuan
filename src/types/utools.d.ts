import {
    Action,
    CallbackSetList,
    CallbackListItem,
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
    public readonly code: string; // 功能代码
    public readonly mode: TplFeatureMode; // 功能模式
    public placeholder?: string; // 子输入框为空时的占位符，默认为字符串"搜索"
    public indexes?: IIndex[]; // 文档模式下的页面索引

    /* 进入插件应用时调用（可选） */
    public enter?(action?: Action, callbackSetList?: CallbackSetList): void;

    /* 子输入框内容变化时被调用 可选 (未设置则无搜索) */
    public search?(action?: Action, searchWord?: string, callbackSetList?: CallbackSetList): void;

    /* 用户选择列表中某个条目时被调用 */
    public select?(action?: Action, itemData?: CallbackListItem, callbackSetList?: CallbackSetList): void;
}

// REF [模板插件应用 | uTools](https://u.tools/docs/developer/template.html#preload-js-%E6%96%87%E4%BB%B6)
export interface IExport {
    mode: TplFeatureMode;
    args: IPlugin;
}

export interface IExports {
    [code: string]: IExport;
}
