import { IPayload_fullTextSearchBlock } from "./siyuan"

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
    render: {
        breadcrumb: {
            wrap: boolean,
            item: {
                wrap: boolean,
            },
        },
        tree: {
            fold: boolean,
        },
    },
    other: {
        open: boolean, // 是否自动打开抽屉
        language: ILanguage,
        languages: ILanguage[],
    },
}

interface ILanguage {
    tag: string | WritableComputedRef<string>, // 语言标识
    label: string, // 语言名称
}
