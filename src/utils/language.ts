/* 映射地区 */
export function mapLocal(local: string, accept: string[] | object): string {
    switch (true) {
        case local in accept:
        default:
            break;

        case local.startsWith("en"):
            local = "en";
            break;

        case local.startsWith("zh-CNS"):
            local = "zh-Hans";
            break;
        case local.startsWith("zh-CNT"):
            local = "zh-Hant";
            break;

        case local.startsWith("zh-Hans"):
        case local.startsWith("zh-CN"):
        case local.startsWith("zh-SG"):
            local = "zh-Hans";
            break;

        case local.startsWith("zh-Hant"):
        case local.startsWith("zh-TW"):
        case local.startsWith("zh-HK"):
        case local.startsWith("zh-MO"):
            local = "zh-Hant";
            break;

        case local.startsWith("zh"):
            local = "zh-Hans";
            break;
    }
    return local;
}

/* 映射展示字段 */
export function mapLabel(local: string): string {
    switch (true) {
        case local.startsWith("en"):
            return "English";
        case local === "zh-Hans":
            return "简体中文";
        case local === "zh-Hant":
            return "繁体中文";
        case local.startsWith("zh"):
            return "中文";
        default:
            return local;
    }
}
