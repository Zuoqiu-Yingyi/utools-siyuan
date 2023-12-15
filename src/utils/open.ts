
export enum OpenMode {
    siyuan_desktop = "siyuan_desktop", // 打开桌面端 (通过 siyuan:// 协议)
    siyuan_pwa = "siyuan_pwa", // 打开 PWA (通过 web+siyuan:// 协议)
    siyuan_web = "siyuan_web", // 打开浏览器 Web 端 (默认浏览器打开 http(s)://host:port/?id=?)
    utools_window = "utools_window", // 打开浏览器 Web 端 (utools 窗口打开 http(s)://host:port/?id=?)
}
