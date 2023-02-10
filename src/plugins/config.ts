export {
    Config,
};

import { TplFeatureMode } from "utools-helper/dist/template_plugin";
import { IPlugin } from "./../types/utools";

class Config implements IPlugin {
    public readonly code: string;
    public readonly mode = "none" as TplFeatureMode;

    constructor(code: string) {
        this.code = code;
    }

    public enter(): void {
        // REF [uTools API | uTools](https://u.tools/docs/developer/api.html#createbrowserwindow-url-options-callback)
        const ubWindow = utools.createBrowserWindow(
            './index.html',
            {},
            () => {
                // 显示
                ubWindow.show()

                // 隐藏主窗口
                utools.hideMainWindow();

                // 退出插件
                utools.outPlugin();

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
    }
}
