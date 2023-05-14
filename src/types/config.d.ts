import { IPayload_fullTextSearchBlock } from "./siyuan"
import { OPEN_MODE } from "./open"

export interface IServer {
    protocol: string,
    hostname: string,
    port: number,
    token: string,
    url: string,
}

export interface IConfig {
    server: IServer,
    search: Omit<IPayload_fullTextSearchBlock, 'query'>, // 省略 query 属性
    other: {
        maxPage: number,
        open: IOpen,
        language: ILanguage,
        languages: ILanguage[],
    },
}

export interface IOpen {
    mode: OPEN_MODE,
}

export interface ILanguage {
    tag: string | WritableComputedRef<string>, // 语言标识
    label: string, // 语言名称
}

export interface IStorage {
    config: IConfig,
    configs: [string, IConfig][],
}
