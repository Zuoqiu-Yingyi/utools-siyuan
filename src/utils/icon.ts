export {
    Icon,
};

class Icon {

    /**
     * UTF-32 解码
     * REF [javascript 的 字符串编码 - 知乎](https://zhuanlan.zhihu.com/p/386511092)
     * @params: hex: 16 进制 UTF-32 字符串
     * @params: wrap: 是否使用 span 包裹解码后的字符串
     * @params: className: span 标签 class 属性
     * @return: 解码后字符串 / span 标签 HTML
     */
    public static utf32Decode(hex: string, wrap = false, className = "icon", defalutIcon = "📄"): string {
        const icon = hex.length > 0 ? String.fromCodePoint(parseInt(hex, 16)) : defalutIcon;
        return wrap ? Icon.char2dataURL(icon, className) : icon;
    }

    public static char2dataURL(char: string, className = "icon"): string {
        return `data:image/svg+xml,${encodeURIComponent(`<svg class="${className}" version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128"><text x="64" y="108" font-size="128" text-anchor="middle">${char}</text></svg>`)}`;
    }

    /**
     * 自定义图标转换为 img 标签
     * @params: path: 自定义图标路径
     * @params: url: 思源服务 URL
     * @params: className: img 标签 class 属性
     * @return: img 标签 HTML
     */
    public static icon2img(path: string, url: URL): string {
        return `${url.origin}/emojis/${path}`;
    }

    public static icon2emojis(icon: string, url: URL): string {
        return /^[0-9a-f]*$/.test(icon) ? Icon.utf32Decode(icon, true) : Icon.icon2img(icon, url);
    }

    public static default = {
        document: {
            text: "📄",
            wrap: Icon.char2dataURL("📄"),
        },
        notebook: {
            text: "📔",
            wrap: Icon.char2dataURL("📔"),
        },
    };
}
