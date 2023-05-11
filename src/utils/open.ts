
export enum OpenMode {
    siyuan_desktop = "siyuan_desktop", // 打开桌面端 (通过 siyuan:// 协议)
    siyuan_web = "siyuan_web", // 打开浏览器 Web 端 (通过 http(s)://host:port/?id=? 协议)
    siyuan_pwa = "siyuan_pwa", // 打开 PWA (通过 web+siyuan:// 协议)
}
