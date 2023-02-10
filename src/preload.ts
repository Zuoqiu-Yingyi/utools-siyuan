import { Config } from "./plugins/config";
import { Search } from "./plugins/search";

import { IExports, IPlugin } from "./types/utools";

const globalThis = window as unknown as { exports: IExports, utools: UToolsApi, STORAGE_KEY: string };

const plugins: IPlugin[] = [
    new Config('config'),
    new Search('search'),
];

const exports: IExports = {};

plugins.forEach(plugin => {
    exports[plugin.code] = {
        mode: plugin.mode,
        args: plugin,
    };
});

globalThis.exports = exports;
