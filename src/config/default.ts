import {
    GroupBy,
    Method,
    OrderBy,
} from "./../utils/siyuan";

import { IConfig } from "./../types/config";
import { OpenMode } from "./../utils/open";

export default {
    server: {
        protocol: "http",
        hostname: "localhost",
        port: 6806,
        token: import.meta.env.VITE_TEST_TOKEN ?? "",
        url: "http://localhost:6806",
    },
    search: {
        groupBy: GroupBy.group,
        method: Method.keyword,
        orderBy: OrderBy.sortByRankDesc,
        paths: [],
        types: {
            heading: true,
            paragraph: true,
            mathBlock: true,
            table: true,
            codeBlock: true,
            htmlBlock: true,
            embedBlock: true,

            document: true,
            superBlock: false,
            blockquote: false,
            list: false,
            listItem: true,
        },
    },
    other: {
        open: {
            mode: OpenMode.siyuan_desktop,
        },
        language: {
            tag: "zh-Hans",
            label: "",
        },
        languages: [
            {
                tag: "en",
                label: "English",
            },
            {
                tag: "zh-Hans",
                label: "简体中文",
            },
            {
                tag: "zh-Hant",
                label: "繁體中文",
            },
        ],
    },
} as IConfig;
