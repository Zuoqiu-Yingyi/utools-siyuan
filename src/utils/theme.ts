export type {
    ITheme,
};

export {
    THEME_MOD,
    Theme,
};

import { reactive, watch, watchEffect, UnwrapNestedRefs } from "vue";

/* 主题状态接口 */
interface ITheme {
    mode: THEME_MOD; // 主题模式
    state: ThemeState; // 当前主题状态
    system: ThemeState; // 系统主题状态
}

/* 主题模式 */
enum THEME_MOD {
    dark, // 深色主题
    light, // 浅色主题
    system, // 跟随系统
}

/* 主题状态 */
type ThemeState = THEME_MOD.dark | THEME_MOD.light;

/**
 * 系统主题状态
 */
class Theme implements ITheme {
    /** 
     * 设置主题
     * REF: [Arco Design Vue](https://arco.design/vue/docs/dark)
     */
    static setTheme(theme: THEME_MOD): void {
        switch (theme) {
            case THEME_MOD.dark:
                document.body.setAttribute("arco-theme", "dark");
                break;

            case THEME_MOD.light:
                document.body.removeAttribute('arco-theme');
                break;

            case THEME_MOD.system:
            default:
                switch (true) {
                    case window.matchMedia('(prefers-color-scheme: dark)').matches:
                        document.body.setAttribute("arco-theme", "dark");
                        break;

                    case window.matchMedia('(prefers-color-scheme: light)').matches:
                    default:
                        document.body.removeAttribute('arco-theme');
                        break;
                }
                break;
        }
    }

    /**
     * 获取系统主题状态
     */
    static getSystemTheme(): ThemeState {
        switch (true) {
            case window.matchMedia('(prefers-color-scheme: dark)').matches:
                return THEME_MOD.dark;

            case window.matchMedia('(prefers-color-scheme: light)').matches:
            default:
                return THEME_MOD.light;
        }
    }

    /**
     * 深色配色媒体查询
     * REF [Window.matchMedia() - Web API 接口参考 | MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/matchMedia)
     * REF [MediaQueryList - Web API 接口参考 | MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/MediaQueryList)
     */
    protected _media_query_list = window.matchMedia('(prefers-color-scheme: dark)');

    /**
     * 系统主题切换事件监听回调函数
     * REF [EventTarget.addEventListener() - Web API 接口参考 | MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/EventTarget/addEventListener)
     * REF [EventTarget.removeEventListener() - Web API 接口参考 | MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/EventTarget/removeEventListener)
     */
    protected readonly _listener = (e: MediaQueryListEvent) => {
        this._r.system = e.matches ? THEME_MOD.dark : THEME_MOD.light;

        if (this.mode === THEME_MOD.system) {
            this._r.state = this.system;
        }
    };

    protected _r: UnwrapNestedRefs<ITheme>; // 响应式数据

    constructor(
        theme = reactive<ITheme>({
            mode: THEME_MOD.system,
            state: Theme.getSystemTheme(),
            system: Theme.getSystemTheme(),
        }),
    ) {
        this._r = theme;

        /* 监听主题模式变更 */
        watch(
            () => this._r.mode,
            mode => {
                switch (mode) {
                    case THEME_MOD.dark:
                    case THEME_MOD.light:
                        this.stopListen();
                        this._r.state = mode;
                        break;

                    case THEME_MOD.system:
                    default:
                        this.startListen();
                        this._r.system = Theme.getSystemTheme();
                        this._r.state = this.system;
                        break;
                }
            },
        );

        /* 监听当前主题状态变更 */
        watchEffect(() => Theme.setTheme(this._r.state));
    }

    public get mode(): THEME_MOD {
        return this._r.mode;
    }
    public set mode(mode: THEME_MOD) {
        this._r.mode = mode;
    }

    public get state(): ThemeState {
        return this._r.state;
    }
    public set state(state: ThemeState) {
        this._r.state = state;
    }

    public get system(): ThemeState {
        return this._r.system;
    }
    public set system(system: ThemeState) {
        this._r.system = system;
    }

    /* 开始监听 */
    public startListen(): void {
        this._media_query_list.addEventListener("change", this._listener);
    }

    /* 终止监听 */
    public stopListen(): void {
        this._media_query_list.removeEventListener("change", this._listener);
    }
}
