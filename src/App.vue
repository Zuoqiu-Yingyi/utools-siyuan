<script setup lang="ts">
import Settings from "./components/Settings.vue";
import { ref, provide, reactive, unref, watch, inject, shallowReactive, computed } from "vue";
import { I18n } from "vue-i18n";

import { IConfig, IStorage } from "./types/config";
import { INotebooks } from "./types/siyuan";

import { SiyuanClient } from "./utils/siyuan";
import { Status } from "./utils/status";
import { mapLabel } from "./utils/language";
import { Theme } from "./utils/theme";
import { Icon } from "./utils/icon";
import { copy, merge } from "./utils/object";

import config_default from "./config/default";

/* 国际化 */
const i18n = inject("i18n") as I18n; // 国际化引擎

/* 笔记本列表 */
const notebooks = shallowReactive<INotebooks>({
    list: [],
    map: new Map(),
});

/* 监听 list 更改时更新 map */
watch(
    () => notebooks.list,
    list => {
        /* 重建映射 */
        notebooks.map.clear();
        list.forEach(notebook => {
            notebook.icon = Icon.icon2emojis(notebook.icon, client.url);
            notebooks.map.set(notebook.id, notebook);
        });
    },
);
provide("notebooks", notebooks);

/* 用户配置 */
config_default.other.language.tag = unref(i18n.global.locale);
const config: IConfig = reactive(copy(config_default));
config.other.language.tag = i18n.global.locale;

/* 用户配置列表 */
const configs = reactive<Map<string, IConfig>>(new Map());
const configs_entries = computed(() => Array.from(configs.entries()));

/* 生产环境 */
if (import.meta.env.PROD) {
    /* 从储存中读取用户配置列表 */
    const storage = utools.dbStorage.getItem(import.meta.env.VITE_STORAGE_KEY) as IStorage | undefined;
    if (storage) {
        /* 加载当前配置 */
        merge(config, storage.config ?? {});

        /* 加载配置列表 */
        configs.clear();
        Object.values(storage.configs as Record<number, [string, IConfig]>).forEach(([key, value]) => {
            configs.set(key, value);
        });
    }

    /* 保存用户配置列表 */
    watch(configs_entries, entries => {
        utools.dbStorage.setItem(
            import.meta.env.VITE_STORAGE_KEY,
            {
                config: copy(config),
                configs: copy(entries),
            } as IStorage,
        );
    });
}

const status = ref(Status.normal); // 连接状态
const message = ref(""); // 连接状态消息
const version = ref(""); // 内核版本

const client = new SiyuanClient(new URL(config.server.url), config.server.token, status, message);

watch(
    [() => config.server.protocol, () => config.server.hostname, () => config.server.port, () => config.server.token],
    ([protocol, hostname, port]) => {
        notebooks.list.length = 0; // 思源服务源更改, 删除原笔记本列表

        const url = new URL(`${protocol}://${hostname}:${port}`);
        config.server.url = url.origin;

        client.update(url, config.server.token);
        setTimeout(async () => {
            try {
                const r = await client.version();
                version.value = `v${r.data}`;
                status.value = Status.normal;
            } catch (error) {
                version.value = "";
                status.value = Status.danger;
            }
        }, 0);
    },
    {
        immediate: true, // 立即执行一次
    },
);

watch(
    () => config.other.language.tag,
    tag => {
        i18n.global.locale = tag;
        config.other.language.label = mapLabel(tag);
    },
    {
        immediate: true, // 立即执行一次
    },
);

// REF: [依赖注入 | Vue.js](https://cn.vuejs.org/guide/components/provide-inject.html#provide)
provide("config", config);
provide("configs", configs);
provide("config_default", config_default);
provide("client", client);
provide("status", status);
provide("message", message);
provide("version", version);

/* 👇 主题状态 👇 */
const theme = reactive(new Theme());
provide("theme", theme);
/* 👆 主题状态 👆 */
</script>

<template>
    <Settings />
</template>

<style scoped lang="less">

</style>
