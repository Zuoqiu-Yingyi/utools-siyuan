export {
    Config,
};

import { Plugin } from "utools-helper";
import { Action, TplFeatureMode } from "utools-helper/dist/template_plugin";

class Config implements Plugin {
    static readonly ID = "B990E74D-44FC-4AB7-A62F-0227802EF719";

    mode = "doc" as TplFeatureMode;
    code = "config";
    args = {
        // 索引集合
        // indexes: require('./indexes.json')
        indexes: [
            {
                t: '这是标题',
                d: '这是描述',
                p: 'doc/xxx.html', //页面, 只能是相对路径
            }
        ],
        // 子输入框为空时的占位符，默认为字符串"搜索"
        placeholder: "搜索",
    };
}
