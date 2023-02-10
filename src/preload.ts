import { Config } from "./plugins/config";

import { IExports, IPlugin } from "./types/utools";

const globalThis = window as unknown as { exports: IExports, utools: UToolsApi };

const plugins: IPlugin[] = [
    new Config(),
];

const exports: IExports = {};

plugins.forEach(plugin => {
    exports[plugin.code] = {
        mode: plugin.mode,
        args: plugin,
    };
});

globalThis.exports = exports;
