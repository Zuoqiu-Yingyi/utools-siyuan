export {
    Search,
};

import {
    TplFeatureMode,
    Action,
    CallbackSetList,
    CallbackListItem,
} from "utools-helper/dist/template_plugin";

import { IPlugin } from "./../types/utools";

class Search extends Object implements IPlugin {
    public readonly code: string;
    public readonly mode = "list" as TplFeatureMode;

    // 子输入框为空时的占位符，默认为字符串"搜索"
    public placeholder = "搜索";

    constructor(code: string) {
        super();
        this.code = code;
    }

    // 进入插件应用时调用（可选）
    enter(action: Action, callbackSetList: CallbackSetList) {
        // 如果进入插件应用就要显示列表数据
        callbackSetList([
            {
                title: '这是标题',
                description: '这是描述',
                icon: '' // 图标(可选)
            }
        ]);
    }

    // 子输入框内容变化时被调用 可选 (未设置则无搜索)
    search(action: Action, searchWord: string, callbackSetList: CallbackSetList) {
        // 获取一些数据
        // 执行 callbackSetList 显示出来
        callbackSetList([
            {
                title: '这是标题',
                description: '这是描述',
                icon: '', // 图标
                url: 'https://yuanliao.info'
            }
        ]);
    }

    // 用户选择列表中某个条目时被调用
    select(action: Action, itemData: CallbackListItem, callbackSetList: CallbackSetList) {
        window.utools.hideMainWindow();
        window.utools.outPlugin();
    }
}
