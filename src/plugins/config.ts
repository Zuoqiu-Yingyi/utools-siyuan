export {
    Config,
};

import { TplFeatureMode, Action } from "utools-helper/dist/template_plugin";
import { IPlugin } from "./../types/utools";

class Config extends Object implements IPlugin {
    static readonly ID = "B990E74D-44FC-4AB7-A62F-0227802EF719";

    code = "config";
    mode = "none" as TplFeatureMode;

    constructor() {
        super();
    }

    enter(action: Action): void {
        // action = { code, type, payload }
        // REF [uTools API | uTools](https://u.tools/docs/developer/api.html#createbrowserwindow-url-options-callback)
        const ubWindow = utools.createBrowserWindow(
            './index.html',
            {},
            () => {
                // 显示
                ubWindow.show()

                // 置顶
                // ubWindow.setAlwaysOnTop(true)

                // 窗口全屏
                // ubWindow.setFullScreen(true)

                // 向子窗口传递数据
                // ubWindow.webContents.send('ping')
                // require('electron').ipcRenderer.sendTo(ubWindow.webContents.id, 'ping')

                // 执行脚本
                // ubWindow.executeJavaScript('fetch("https://jsonplaceholder.typicode.com/users/1").then(resp => resp.json())')
                //     .then((result) => {
                //         console.log(result) // Will be the JSON object from the fetch call
                //     })
            })

        window.utools.hideMainWindow();
        // do some thing
        window.utools.outPlugin();
    }
}
