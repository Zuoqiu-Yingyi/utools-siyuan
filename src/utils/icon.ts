import { BlockSubType, BlockType, NodeHeadingSubType, NodeListSubType } from "./siyuan";

export {
    IconDOM,
    IconDataURL,
};

type BlockIcon = {
    [T in Exclude<BlockType, BlockType.NodeHeading | BlockType.NodeList>]: {
        id: string;
        wrap: string;
    }
} & {
    [BlockType.NodeHeading]: {
        [T in NodeHeadingSubType]: {
            id: string;
            wrap: string;
        };
    }
} & {
    [BlockType.NodeList]: {
        [T in NodeListSubType]: {
            id: string;
            wrap: string;
        };
    }
};

/* DOM 字符串样式图标 */
class IconDOM {

    /**
     * UTF-32 解码
     * REF [javascript 的 字符串编码 - 知乎](https://zhuanlan.zhihu.com/p/386511092)
     * @params: hex: 16 进制 UTF-32 字符串
     * @params: wrap: 是否使用 span 包裹解码后的字符串
     * @params: className: span 标签 class 属性
     * @return: 解码后字符串 / span 标签 HTML
     */
    public static utf32Decode(hex: string, wrap = false, className = "icon"): string {
        const icon = hex.length > 0 ? String.fromCodePoint(parseInt(hex, 16)) : IconDOM.default.document.text;
        return wrap ? `<span class="${className}">${icon}</span>` : icon;
    }

    /**
     * 自定义图标转换为 img 标签
     * @params: path: 自定义图标路径
     * @params: url: 思源服务 URL
     * @params: className: img 标签 class 属性
     * @return: img 标签 HTML
     */
    public static icon2img(path: string, url: URL, className = "icon"): string {
        return `<img class="${className}" src="${url.origin}/emojis/${path}" />`;
    }

    public static icon2emojis(icon: string, url: URL): string {
        return /^[0-9a-f]*$/.test(icon) ? IconDOM.utf32Decode(icon, true) : IconDOM.icon2img(icon, url);
    }

    public static default = {
        notebook: {
            text: "📔",
            wrap: `<span class="icon">📔</span>`,
        },
        document: {
            text: "📄",
            wrap: `<span class="icon">📄</span>`,
        },
    };
}

/* Data URL 样式图标 */
class IconDataURL {

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
        return wrap ? IconDataURL.char2dataURL(icon, className) : icon;
    }

    /**
     * SVG 字符串转换为 dataURL
     * @params: svg: SVG 字符
     * @return: dataURL
     */
    public static svg2dataURL(svg: string): string {
        return `data:image/svg+xml,${encodeURIComponent(svg)}`;
    }

    /**
     * 字符转换为 dataURL SVG
     * @params: char: 字符
     * @params: className: svg 标签 class 属性
     * @return: dataURL
     */
    public static char2dataURL(char: string, className = "icon"): string {
        return IconDataURL.svg2dataURL(`<svg class="${className}" version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128"><text x="64" y="108" font-size="128" text-anchor="middle">${char}</text></svg>`);
    }

    /**
     * html 转换为 dataURL SVG
     * @params: html: html 字符串
     * @params: width: 视窗宽度
     * @params: height: 视窗高度
     * @params: lightColor: 浅色主题颜色
     * @params: darkColor: 深色主题颜色
     * @params: className: svg 标签 class 属性
     * @return: dataURL
     */
    public static html2dataURL(
        html: string,
        width = 32,
        height = 32,
        lightColor = "#888",
        darkColor = "#888",
        className = "icon",
    ): string {
        return IconDataURL.svg2dataURL(`<svg class="${className}" version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}"><style>@media (prefers-color-scheme: light) {*{fill: ${lightColor};}} @media (prefers-color-scheme: dark) {*{fill: ${darkColor};}}</style>${html}</svg>`);
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
        return /^[0-9a-f]*$/.test(icon) ? IconDataURL.utf32Decode(icon, true) : IconDataURL.icon2img(icon, url);
    }

    public static default = {
        notebook: {
            text: "📔",
            wrap: IconDataURL.char2dataURL("📔"),
        },
        document: {
            text: "📄",
            wrap: IconDataURL.char2dataURL("📄"),
        },
        block: {
            [BlockType.NodeNotebook]: {
                id: "iconFilesRoot",
                wrap: IconDataURL.html2dataURL('<path d="M29.072 25.43v-18.86h-13.072v18.86h13.072zM29.072 3.643q1.157 0 2.043 0.885t0.885 2.043v18.86q0 1.157-0.885 2.043t-2.043 0.885h-26.145q-1.157 0-2.043-0.885t-0.885-2.043v-18.86q0-1.157 0.885-2.043t2.043-0.885h26.145zM17.43 18.894h10.213v2.179h-10.213v-2.179zM17.43 11.677h10.213v2.179h-10.213v-2.179zM17.43 15.285h10.213v2.179h-10.213v-2.179z"></path>'),
            },
            [BlockType.NodeFolder]: {
                id: "iconFolder",
                wrap: IconDataURL.html2dataURL('<path d="M11.472 6.4l3.2 3.2h14.128v16h-25.6v-19.2h8.272zM12.8 3.2h-9.6c-1.76 0-3.184 1.44-3.184 3.2l-0.016 19.2c0 1.76 1.44 3.2 3.2 3.2h25.6c1.76 0 3.2-1.44 3.2-3.2v-16c0-1.76-1.44-3.2-3.2-3.2h-12.8l-3.2-3.2z"></path>'),
            },

            [BlockType.NodeDocument]: {
                id: "iconFile",
                wrap: IconDataURL.html2dataURL('<path d="M19.2 0h-12.8c-1.76 0-3.184 1.44-3.184 3.2l-0.016 25.6c0 1.76 1.424 3.2 3.184 3.2h19.216c1.76 0 3.2-1.44 3.2-3.2v-19.2l-9.6-9.6zM6.4 28.8v-25.6h11.2v8h8v17.6h-19.2z"></path>'),
            },
            [BlockType.NodeSuperBlock]: {
                id: "iconSuper",
                wrap: IconDataURL.html2dataURL('<path d="M5.123 3.2l-5.123 9.124 3.846 3.963h19.177l-7.023 7.219-4.405-4.535h-5.144l9.55 9.829 16-16.476h-27.703l3.052-5.46h17.34l1.762 3.15h4.248l-3.843-6.814z"></path>'),
            },
            [BlockType.NodeBlockquote]: {
                id: "iconQuote",
                wrap: IconDataURL.html2dataURL('<path d="M27.769 26.667h-9.316l3.556-7.111h-4.231v-14.222h14.222v12.871l-4.231 8.462zM24.213 23.111h1.351l2.88-5.76v-8.462h-7.111v7.111h6.436l-3.556 7.111zM9.991 26.667h-9.316l3.556-7.111h-4.231v-14.222h14.222v12.871l-4.231 8.462zM6.436 23.111h1.351l2.88-5.76v-8.462h-7.111v7.111h6.436l-3.556 7.111z"></path>'),
            },
            [BlockType.NodeList]: {
                [BlockSubType.u]: {
                    id: "iconList",
                    wrap: IconDataURL.html2dataURL('<path d="M7.777 3.929h24.223v3.403h-24.223v-3.403zM7.777 17.701v-3.403h24.223v3.403h-24.223zM7.777 28.071v-3.403h24.223v3.403h-24.223zM2.592 23.777q1.053 0 1.823 0.77t0.77 1.823-0.77 1.823-1.823 0.77-1.823-0.77-0.77-1.823 0.77-1.823 1.823-0.77zM2.592 3.038q1.053 0 1.823 0.729t0.77 1.863-0.77 1.863-1.823 0.729-1.823-0.729-0.77-1.863 0.77-1.863 1.823-0.729zM2.592 13.408q1.053 0 1.823 0.729t0.77 1.863-0.77 1.863-1.823 0.729-1.823-0.729-0.77-1.863 0.77-1.863 1.823-0.729z"></path>'),
                },
                [BlockSubType.o]: {
                    id: "iconOrderedList",
                    wrap: IconDataURL.html2dataURL('<path d="M8.375 17.659v-3.319h23.625v3.319h-23.625zM8.375 27.773v-3.319h23.625v3.319h-23.625zM8.375 4.227h23.625v3.319h-23.625v-3.319zM0 14.341v-1.738h5.057v1.58l-3.081 3.477h3.081v1.738h-5.057v-1.58l3.002-3.477h-3.002zM1.659 9.284v-5.057h-1.659v-1.738h3.319v6.795h-1.659zM0 24.454v-1.738h5.057v6.795h-5.057v-1.738h3.319v-0.79h-1.659v-1.738h1.659v-0.79h-3.319z"></path>'),
                },
                [BlockSubType.t]: {
                    id: "iconCheck",
                    wrap: IconDataURL.html2dataURL('<path d="M28.444 0h-24.889c-1.956 0-3.556 1.6-3.556 3.556v24.889c0 1.956 1.6 3.556 3.556 3.556h24.889c1.956 0 3.556-1.6 3.556-3.556v-24.889c0-1.956-1.6-3.556-3.556-3.556zM28.444 28.445h-24.889v-24.889h24.889v24.889zM26.649 10.667l-2.507-2.524-11.716 11.716-4.587-4.569-2.524 2.507 7.111 7.093z"></path>'),
                },
            },
            [BlockType.NodeListItem]: {
                id: "iconListItem",
                wrap: IconDataURL.html2dataURL('<path d="M7.778 17.683v-3.403h24.222v3.403h-24.222z"></path><path d="M5.4 16c0 1.49-1.209 2.7-2.7 2.7-1.49 0-2.7-1.21-2.7-2.7s1.21-2.7 2.7-2.7c1.491 0 2.7 1.21 2.7 2.7z"></path>'),
            },

            [BlockType.NodeHeading]: {
                [BlockSubType.h1]: {
                    id: "iconH1",
                    wrap: IconDataURL.html2dataURL('<path d="M14.031 29.089v-11.635h-11.122v11.635h-2.909v-26.179h2.909v11.635h11.12v-11.635h2.909v26.179z"></path><path d="M26.588 29.090v-0.013h-3.763v-2.182h3.763v-11.379c-1.028 0.966-2.294 1.692-3.7 2.081l-0.062 0.015v-2.515c0.881-0.243 1.65-0.577 2.36-1.001l-0.043 0.024c0.789-0.472 1.469-1.020 2.064-1.649l0.004-0.004h1.881v14.428h2.909v2.182h-2.909v0.013z"></path>'),
                },
                [BlockSubType.h2]: {
                    id: "iconH2",
                    wrap: IconDataURL.html2dataURL('<path d="M20.708 29.091c-0-0.029-0.001-0.064-0.001-0.099 0-1.638 0.619-3.132 1.635-4.26l-0.005 0.006c1.091-1.126 2.302-2.125 3.614-2.981l0.080-0.049c0.874-0.596 1.639-1.223 2.344-1.91l-0.004 0.004c0.676-0.71 1.1-1.665 1.124-2.72l0-0.005c0.005-0.061 0.008-0.132 0.008-0.204 0-0.735-0.292-1.402-0.766-1.891l0.001 0.001c-0.543-0.44-1.243-0.706-2.005-0.706-0.078 0-0.155 0.003-0.231 0.008l0.010-0.001c-0.053-0.004-0.115-0.006-0.177-0.006-0.881 0-1.664 0.42-2.16 1.070l-0.005 0.007c-0.549 0.803-0.876 1.794-0.876 2.862 0 0.068 0.001 0.135 0.004 0.202l-0-0.010h-2.502c-0.003-0.070-0.004-0.151-0.004-0.234 0-1.625 0.602-3.11 1.595-4.244l-0.006 0.007c0.98-1.104 2.404-1.797 3.989-1.797 0.081 0 0.161 0.002 0.241 0.005l-0.011-0c0.070-0.003 0.152-0.005 0.235-0.005 1.4 0 2.678 0.522 3.65 1.383l-0.006-0.005c0.919 0.862 1.492 2.084 1.492 3.44 0 0.051-0.001 0.102-0.002 0.153l0-0.007c-0.017 1.529-0.624 2.913-1.602 3.938l0.002-0.002c-1.012 0.966-2.122 1.848-3.308 2.624l-0.088 0.054c-1.337 0.743-2.414 1.812-3.146 3.102l-0.021 0.040h8.195v2.23zM13.943 29.091v-11.636h-11.034v11.636h-2.909v-26.182h2.909v11.636h11.033v-11.636h2.909v26.182z"></path>'),
                },
                [BlockSubType.h3]: {
                    id: "iconH3",
                    wrap: IconDataURL.html2dataURL('<path d="M22.106 27.946c-1.163-1.060-1.899-2.571-1.928-4.255l-0-0.005h2.525c-0.001 0.025-0.001 0.054-0.001 0.084 0 0.985 0.414 1.872 1.077 2.499l0.002 0.002c0.579 0.522 1.349 0.841 2.193 0.841 0.051 0 0.102-0.001 0.152-0.003l-0.007 0c0.041 0.002 0.088 0.003 0.136 0.003 0.93 0 1.778-0.355 2.414-0.936l-0.003 0.003c0.525-0.515 0.851-1.232 0.851-2.024 0-0.017-0-0.034-0-0.050l0 0.003c0.005-0.062 0.008-0.135 0.008-0.208 0-0.782-0.349-1.482-0.901-1.953l-0.004-0.003c-0.606-0.444-1.366-0.711-2.188-0.711-0.094 0-0.187 0.003-0.279 0.010l0.012-0.001h-1.193v-1.908h1.172c0.070 0.005 0.152 0.008 0.235 0.008 0.768 0 1.477-0.257 2.043-0.69l-0.008 0.006c0.483-0.449 0.785-1.087 0.785-1.797 0-0.047-0.001-0.095-0.004-0.141l0 0.006c0.003-0.044 0.004-0.095 0.004-0.147 0-0.686-0.274-1.307-0.717-1.762l0 0.001c-0.539-0.428-1.229-0.686-1.98-0.686-0.087 0-0.173 0.003-0.258 0.010l0.011-0.001c-0.059-0.004-0.129-0.006-0.198-0.006-0.81 0-1.551 0.294-2.123 0.781l0.005-0.004c-0.585 0.595-0.957 1.403-0.987 2.296l-0 0.006h-2.455c0.059-1.538 0.745-2.905 1.808-3.86l0.005-0.004c0.971-0.857 2.255-1.379 3.66-1.379 0.094 0 0.187 0.002 0.279 0.007l-0.013-0.001c0.094-0.005 0.204-0.008 0.315-0.008 1.378 0 2.649 0.458 3.669 1.231l-0.015-0.011c0.903 0.769 1.472 1.907 1.472 3.178 0 0.059-0.001 0.117-0.004 0.175l0-0.008c0.002 0.050 0.004 0.108 0.004 0.167 0 1.673-1.141 3.079-2.687 3.484l-0.025 0.006c0.881 0.248 1.629 0.727 2.199 1.367l0.004 0.005c0.515 0.613 0.827 1.411 0.827 2.282 0 0.050-0.001 0.099-0.003 0.148l0-0.007c0.002 0.045 0.002 0.099 0.002 0.152 0 1.425-0.6 2.709-1.56 3.615l-0.002 0.002c-1.086 0.928-2.507 1.494-4.060 1.494-0.081 0-0.162-0.002-0.242-0.005l0.012 0c-0.088 0.005-0.191 0.007-0.295 0.007-1.421 0-2.727-0.491-3.758-1.312l0.012 0.009zM13.941 29.255v-11.966h-11.033v11.635h-2.909v-26.178h2.909v11.635h11.033v-11.309h2.909v26.178z"></path>'),
                },
                [BlockSubType.h4]: {
                    id: "iconH4",
                    wrap: IconDataURL.html2dataURL('<path d="M27.14 29.093v-3.608h-7.988v-2.4l8.080-10.62h2.296v10.993h2.473v2.027h-2.473v3.608zM21.194 23.459h5.946v-7.779h-0.068zM14.035 29.093v-11.639h-11.125v11.639h-2.91v-26.187h2.91v11.639h11.125v-11.639h2.91v26.187z"></path>'),
                },
                [BlockSubType.h5]: {
                    id: "iconH5",
                    wrap: IconDataURL.html2dataURL('<path d="M31.226 12.293v2.406h-7.967l-0.467 4.577h0.070c0.484-0.493 1.078-0.876 1.742-1.111l0.032-0.010c0.579-0.222 1.249-0.351 1.949-0.351 0.029 0 0.058 0 0.087 0.001l-0.004-0c0.058-0.002 0.126-0.004 0.194-0.004 1.425 0 2.713 0.589 3.633 1.536l0.001 0.001c0.933 1.043 1.504 2.427 1.504 3.944 0 0.108-0.003 0.215-0.009 0.321l0.001-0.015c0.001 0.039 0.002 0.085 0.002 0.132 0 1.652-0.762 3.127-1.953 4.092l-0.010 0.008c-1.127 0.917-2.58 1.472-4.163 1.472-0.048 0-0.095-0-0.143-0.002l0.007 0c-0.047 0.001-0.101 0.002-0.157 0.002-1.41 0-2.712-0.465-3.76-1.251l0.016 0.012c-1.151-0.85-1.909-2.175-1.984-3.68l-0-0.011h2.685c0.056 0.827 0.462 1.55 1.069 2.028l0.006 0.005c0.557 0.368 1.24 0.588 1.974 0.588 0.061 0 0.122-0.002 0.182-0.005l-0.009 0c0.029 0.001 0.063 0.001 0.097 0.001 0.924 0 1.767-0.346 2.406-0.915l-0.004 0.003c0.62-0.585 1.006-1.413 1.006-2.331 0-0.043-0.001-0.086-0.003-0.128l0 0.006c0.003-0.060 0.005-0.129 0.005-0.199 0-0.928-0.328-1.78-0.874-2.445l0.005 0.007c-0.564-0.596-1.361-0.968-2.244-0.968-0.083 0-0.166 0.003-0.247 0.010l0.011-0.001c-0.041-0.001-0.090-0.002-0.138-0.002-0.627 0-1.222 0.139-1.755 0.387l0.026-0.011c-0.581 0.28-1.046 0.723-1.346 1.27l-0.008 0.016h-2.54l0.91-9.39z"></path><path d="M14.076 2.705v11.673h-11.158v-11.673h-2.918v26.265h2.918v-11.673h11.158v11.673h2.918v-26.265z"></path>'),
                },
                [BlockSubType.h6]: {
                    id: "iconH6",
                    wrap: IconDataURL.html2dataURL('<path d="M14.067 2.712v11.666h-11.151v-11.666h-2.916v26.248h2.916v-11.666h11.151v11.666h2.916v-26.248z"></path><path d="M31.669 16.518h-2.661c-0.178-1.318-1.295-2.323-2.647-2.323-0.087 0-0.173 0.004-0.258 0.012l0.011-0.001c-0.003 0-0.006 0-0.010 0-1.151 0-2.149 0.655-2.642 1.612l-0.008 0.017c-0.606 1.017-0.964 2.243-0.964 3.553 0 0.105 0.002 0.209 0.007 0.313l-0-0.015v0.21h0.117c0.432-0.657 1.025-1.176 1.724-1.507l0.026-0.011c0.615-0.296 1.338-0.469 2.101-0.469 0.049 0 0.099 0.001 0.148 0.002l-0.007-0c0.070-0.003 0.153-0.005 0.236-0.005 1.449 0 2.756 0.603 3.685 1.573l0.002 0.002c0.914 1.005 1.474 2.347 1.474 3.82 0 0.077-0.002 0.153-0.005 0.229l0-0.011c0.001 0.045 0.002 0.098 0.002 0.151 0 1.564-0.654 2.975-1.703 3.976l-0.002 0.002c-1.048 1.011-2.476 1.635-4.049 1.635-0.046 0-0.091-0.001-0.137-0.002l0.007 0c-0.088 0.005-0.192 0.008-0.295 0.008-1.797 0-3.391-0.869-4.385-2.21l-0.010-0.015c-1.008-1.518-1.609-3.383-1.609-5.388 0-0.208 0.006-0.414 0.019-0.619l-0.001 0.028c-0.009-0.166-0.013-0.36-0.013-0.556 0-2.24 0.639-4.33 1.745-6.098l-0.028 0.048c0.939-1.523 2.599-2.522 4.491-2.522 0.037 0 0.075 0 0.112 0.001l-0.006-0q4.904 0 5.532 4.553zM23.636 21.062c-0.54 0.618-0.87 1.433-0.87 2.325 0 0.077 0.002 0.154 0.007 0.23l-0.001-0.010c-0.003 0.054-0.005 0.117-0.005 0.181 0 0.897 0.348 1.712 0.916 2.319l-0.002-0.002c0.569 0.564 1.351 0.912 2.216 0.912 0.041 0 0.083-0.001 0.123-0.002l-0.006 0c0.038 0.002 0.084 0.003 0.129 0.003 0.881 0 1.675-0.374 2.232-0.972l0.002-0.002c0.567-0.628 0.914-1.463 0.914-2.38 0-0.049-0.001-0.098-0.003-0.146l0 0.007c0.002-0.045 0.003-0.097 0.003-0.149 0-0.884-0.329-1.691-0.871-2.306l0.003 0.004c-0.574-0.579-1.369-0.937-2.248-0.937-0.055 0-0.11 0.001-0.164 0.004l0.008-0c-0.058-0.004-0.126-0.006-0.195-0.006-0.86 0-1.635 0.36-2.184 0.938l-0.001 0.001z"></path>'),
                },
            },
            [BlockType.NodeParagraph]: {
                id: "iconParagraph",
                wrap: IconDataURL.html2dataURL('<path d="M16 3.765v28.235h-3.765v-9.412c-6.238 0-11.294-5.057-11.294-11.294s5.057-11.294 11.294-11.294v0h18.824v3.765h-5.647v28.235h-3.765v-28.235h-5.647zM12.235 3.765c-0 0-0 0-0.001 0-4.158 0-7.529 3.371-7.529 7.529s3.371 7.529 7.529 7.529c0 0 0 0 0.001 0h-0v-15.059z"></path>'),
            },
            [BlockType.NodeMathBlock]: {
                id: "iconMath",
                wrap: IconDataURL.html2dataURL('<path d="M26.343 32c1.668 0 2.748-1.032 2.748-2.602s-1.080-2.625-2.725-2.625h-15.402v-0.282l5.636-8.018c0.891-1.266 1.173-1.945 1.173-2.766 0-0.843-0.327-1.593-1.339-2.977l-5.236-7.243v-0.259h15.098c1.575 0 2.677-1.055 2.677-2.602 0-1.545-1.102-2.625-2.677-2.625h-19.864c-2.114 0-3.359 1.077-3.359 2.932 0 0.936 0.423 1.85 1.455 3.257l7.023 9.727-7.068 10.011c-1.361 1.97-1.573 2.439-1.573 3.352 0 1.689 1.291 2.72 3.43 2.72h20.005z"></path>'),
            },
            [BlockType.NodeTable]: {
                id: "iconTable",
                wrap: IconDataURL.html2dataURL('<path d="M22.801 2.286h-22.801v27.429h32v-27.429h-9.199zM19.372 5.714v4.571h-6.801v-4.571h6.801zM19.372 13.714v4.571h-6.801v-4.571h6.801zM3.429 5.714h5.714v4.571h-5.714v-4.571zM3.429 13.714h5.714v4.571h-5.714v-4.571zM3.429 26.286v-4.571h5.714v4.571h-5.714zM12.571 26.286v-4.571h6.801v4.571h-6.801zM28.571 26.286h-5.77v-4.571h5.77v4.571zM28.571 18.286h-5.77v-4.571h5.77v4.571zM22.801 10.286v-4.571h5.77v4.571h-5.77z"></path>'),
            },
            [BlockType.NodeCodeBlock]: {
                id: "iconCode",
                wrap: IconDataURL.html2dataURL('<path d="M9.946 8.501l-2.204-1.832-7.742 9.331 7.742 9.331 2.204-1.832-6.225-7.499 6.225-7.499zM8.844 17.431h2.862v-2.862h-2.862v2.862zM23.156 14.569h-2.862v2.862h2.862v-2.862zM14.569 17.431h2.862v-2.862h-2.862v2.862zM24.258 6.669l-2.204 1.832 6.225 7.499-6.225 7.499 2.204 1.832 7.742-9.331-7.742-9.331z"></path>'),
            },
            [BlockType.NodeHTMLBlock]: {
                id: "iconHTML5",
                wrap: IconDataURL.html2dataURL('<path d="M24.52 9.38l0.32-3.5h-17.68l0.94 10.68h12.24l-0.44 4.56-3.94 1.060-3.92-1.060-0.26-2.8h-3.5l0.44 5.56 7.24 2h0.080v-0.020l7.18-1.98 1-10.88h-12.88l-0.3-3.62h13.48zM1.92 0h28.16l-2.56 28.76-11.56 3.24-11.48-3.24z"></path>'),
            },
            [BlockType.NodeThematicBreak]: {
                id: "iconLine",
                wrap: IconDataURL.html2dataURL('<path d="M0 14h32v4h-32v-4z"></path>'),
            },
            [BlockType.NodeAudio]: {
                id: "iconRecord",
                wrap: IconDataURL.html2dataURL('<path d="M24.928 15.17h2.844q0 4.267-2.963 7.467t-7.151 3.832v5.531h-3.319v-5.531q-4.188-0.632-7.151-3.832t-2.963-7.467h2.844q0 3.714 2.647 6.123t6.281 2.41 6.281-2.41 2.647-6.123zM13.946 4.899v10.43q0 0.79 0.593 1.383t1.462 0.593q0.79 0 1.383-0.553t0.593-1.422l0.079-10.43q0-0.869-0.632-1.462t-1.422-0.593-1.422 0.593-0.632 1.462zM16 20.227q-2.054 0-3.556-1.501t-1.501-3.556v-10.114q0-2.054 1.501-3.556t3.556-1.501 3.556 1.501 1.501 3.556v10.114q0 2.054-1.501 3.556t-3.556 1.501z"></path>'),
            },
            [BlockType.NodeVideo]: {
                id: "iconVideo",
                wrap: IconDataURL.html2dataURL('<path d="M21.333 8.889v14.222h-17.778v-14.222h17.778zM23.111 5.333h-21.333c-0.978 0-1.778 0.8-1.778 1.778v17.778c0 0.978 0.8 1.778 1.778 1.778h21.333c0.978 0 1.778-0.8 1.778-1.778v-6.222l7.111 7.111v-19.556l-7.111 7.111v-6.222c0-0.978-0.8-1.778-1.778-1.778z"></path>'),
            },
            [BlockType.NodeIFrame]: {
                id: "iconLanguage",
                wrap: IconDataURL.html2dataURL('<path d="M22.986 19.23h5.408q0.451-2.103 0.451-3.23t-0.451-3.23h-5.408q0.225 1.577 0.225 3.23t-0.225 3.23zM20.131 28.094q1.878-0.601 3.906-2.291t3.080-3.418h-4.732q-0.751 3.005-2.254 5.709zM19.756 19.23q0.225-1.577 0.225-3.23t-0.225-3.23h-7.512q-0.225 1.577-0.225 3.23t0.225 3.23h7.512zM16 28.77q2.103-3.080 3.080-6.385h-6.16q0.977 3.305 3.080 6.385zM9.615 9.615q0.901-3.23 2.254-5.709-1.878 0.601-3.944 2.291t-3.042 3.418h4.732zM4.883 22.385q0.977 1.728 3.042 3.418t3.944 2.291q-1.502-2.704-2.254-5.709h-4.732zM3.606 19.23h5.408q-0.225-1.577-0.225-3.23t0.225-3.23h-5.408q-0.451 2.103-0.451 3.23t0.451 3.23zM16 3.23q-2.103 3.080-3.080 6.385h6.16q-0.977-3.305-3.080-6.385zM27.117 9.615q-1.052-1.728-3.080-3.418t-3.906-2.291q1.352 2.479 2.254 5.709h4.732zM16 0q6.61 0 11.305 4.695t4.695 11.305-4.695 11.305-11.305 4.695-11.305-4.695-4.695-11.305 4.695-11.305 11.305-4.695z"></path>'),
            },
            [BlockType.NodeWidget]: {
                id: "iconBoth",
                wrap: IconDataURL.html2dataURL('<path d="M2.909 3.636h26.182c1.6 0 2.909 1.309 2.909 2.909v18.909c0 1.6-1.309 2.909-2.909 2.909h-26.182c-1.6 0-2.909-1.309-2.909-2.909v-18.909c0-1.6 1.309-2.909 2.909-2.909zM29.091 25.455v-18.909h-11.636v18.909h11.636zM2.909 25.455h11.636v-18.909h-11.636v18.909zM13.091 11.636h-8.727v2.182h8.727zM13.091 15.273h-8.727v2.182h8.727zM13.091 18.909h-8.727v2.182h8.727z"></path>'),
            },
            [BlockType.NodeBlockQueryEmbed]: {
                id: "iconSQL",
                wrap: IconDataURL.html2dataURL('<path d="M17.6 14.4h-14.4c-1.76 0-3.2-1.44-3.2-3.2v-4.8c0-1.76 1.44-3.2 3.2-3.2h14.4v11.2zM3.2 11.2h11.2v-4.8h-11.2v4.8zM20.8 28.8h-17.6c-1.76 0-3.2-1.44-3.2-3.2v-4.8c0-1.76 1.44-3.2 3.2-3.2h17.6v11.2zM3.2 25.6h14.4v-4.8h-14.4v4.8zM32 11.2h-3.2l3.2-8h-11.2v11.2h3.2v14.4l8-17.6zM4.4 24.4h2.4v-2.4h-2.4v2.4zM4.4 10h2.4v-2.4h-2.4v2.4z"></path>'),
            },
        } as BlockIcon,
    };
}
