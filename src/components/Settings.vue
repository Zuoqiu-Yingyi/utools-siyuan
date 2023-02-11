<!-- REF [Arco Design Vue](https://arco.design/vue/component/tabs) -->
<script setup lang="ts">
import FileTreeSelect from "./FileTreeSelect.vue";

import { inject, watch, ref, ShallowReactive, UnwrapNestedRefs, computed } from "vue";
import { useI18n, I18n, VueI18nTranslation } from "vue-i18n";

import { Notification } from "@arco-design/web-vue";

import { IConfig } from "./../types/config";
import { INotebooks } from "./../types/siyuan";

import { Method, GroupBy, OrderBy, Leaf, Container, washNotebooks, SiyuanClient } from "./../utils/siyuan";
import { Theme, THEME_MOD } from "./../utils/theme";
import { copy, merge } from "./../utils/object";

// const { t: $t } = useI18n();
const i18n = inject("i18n") as I18n; // 国际化引擎
const t = i18n.global.t as VueI18nTranslation;

const config = inject("config") as IConfig; // 用户配置
const notebooks = inject("notebooks") as ShallowReactive<INotebooks>; // 笔记本列表
const client = inject("client") as InstanceType<typeof SiyuanClient>; // 思源客户端

/* 测试思源服务 */
async function testSiyuanServer(): Promise<void> {
    // console.log(config.server.url);
    try {
        const response = await client.lsNotebooks();
        notebooks.list = washNotebooks(response.data.notebooks);

        Notification.success({
            title: t("conect_siyuan_client"),
            content: t("conect_success"),
            closable: true, // 是否显示关闭按钮
            duration: 3000, // 显示持续时间
        });
    } catch (e) {
        console.warn(e);
        Notification.error({
            title: t("conect_siyuan_client"),
            content: String(e),
            closable: true,
            duration: 3000,
        });
    }
}

/* 根据协议设置端口 */
watch(
    () => config.server.protocol,
    (protocol: string) => {
        config.server.port = protocol === "https" ? 443 : 6806;
    },
);

/* 👇 搜索型过滤 👇 */
const leafs_init: Leaf[] = []; // 叶子块初值
config.search.types.heading && leafs_init.push(Leaf.h);
config.search.types.paragraph && leafs_init.push(Leaf.p);
config.search.types.mathBlock && leafs_init.push(Leaf.m);
config.search.types.table && leafs_init.push(Leaf.t);
config.search.types.codeBlock && leafs_init.push(Leaf.c);
config.search.types.htmlBlock && leafs_init.push(Leaf.html);
config.search.types.embedBlock && leafs_init.push(Leaf.query_embed);

const leafs = ref(leafs_init); // 叶子块复选框组状态列表
const leaf = computed(() => leafs.value.length === 7); // 叶子块全选框状态
const leaf_indeterminate = computed(() => leafs.value.length > 0 && leafs.value.length < 7); // 叶子块全选框状态是否未知

const containers_init: Container[] = []; // 容器块初值
config.search.types.document && containers_init.push(Container.d);
config.search.types.superBlock && containers_init.push(Container.s);
config.search.types.blockquote && containers_init.push(Container.b);
config.search.types.list && containers_init.push(Container.l);
config.search.types.listItem && containers_init.push(Container.i);

const containers = ref(containers_init); // 容器块复选框组状态列表
const container = computed(() => containers.value.length === 5); // 容器块全选框状态
const container_indeterminate = computed(() => containers.value.length > 0 && containers.value.length < 5); // 容器块全选框状态是否未知

/* 处理叶子块全选 */
function handleLeaf(value: boolean | (string | number | boolean)[]): void {
    if (value) {
        leafs.value = [Leaf.h, Leaf.p, Leaf.m, Leaf.t, Leaf.c, Leaf.html, Leaf.query_embed];
    } else {
        leafs.value = [];
    }
}

/* 处理叶子块选择 */
function handleLeafs(values: (string | number | boolean)[]): void {
    config.search.types.heading = Leaf.h in values;
    config.search.types.paragraph = Leaf.p in values;
    config.search.types.mathBlock = Leaf.m in values;
    config.search.types.table = Leaf.t in values;
    config.search.types.codeBlock = Leaf.c in values;
    config.search.types.htmlBlock = Leaf.html in values;
    config.search.types.embedBlock = Leaf.query_embed in values;
}

/* 处理容器块全选 */
function handleContainer(value: boolean | (string | number | boolean)[]): void {
    if (value) {
        containers.value = [Container.d, Container.s, Container.b, Container.l, Container.i];
    } else {
        containers.value = [];
    }
}

/* 处理容器块选择 */
function handleContainers(values: (string | number | boolean)[]): void {
    config.search.types.document = Container.d in values;
    config.search.types.superBlock = Container.s in values;
    config.search.types.blockquote = Container.b in values;
    config.search.types.list = Container.l in values;
    config.search.types.listItem = Container.i in values;
}
/* 👆 搜索型过滤 👆 */

/* 👇 主题 👇 */
const theme = inject("theme") as InstanceType<typeof Theme>; // 用户配置
/* 👆 主题 👆 */

/* 👇 配置列表 👇 */
const configs = inject("configs") as UnwrapNestedRefs<Map<string, IConfig>>; // 用户配置列表
const config_default = inject("config_default") as IConfig; // 用户默认配置
const options = computed(() => [...configs.keys()]);
const model_value = ref(""); // 选择框值

function saveOnClick(): void {
    configs.set(config.server.url, copy(config));
    model_value.value = config.server.url;
}

function deleteOnClick(): void {
    configs.delete(model_value.value);
    model_value.value = "";
}

function resetOnClick(): void {
    merge(config, config_default);
    model_value.value = "";
}

function onChange(key: string | number | Record<string, unknown> | (string | number | Record<string, unknown>)[]): void {
    merge(config, configs.get(key as string) as IConfig);
}
/* 👆 配置列表 👆 */
</script>

<template>
    <a-layout class="panel">
        <a-layout-header>
            <a-space>
                <a-select
                    size="small"
                    :options="options"
                    v-model:model-value="model_value"
                    @change="onChange"
                >
                    <template #empty>
                        <a-empty :description="$t('help.settings_empty')" />
                    </template>
                </a-select>

                <!-- 保存 -->
                <a-tooltip
                    size="small"
                    :content="$t('label.save')"
                >
                    <a-button
                        size="mini"
                        type="secondary"
                        status="success"
                        @click="saveOnClick"
                    >
                        <icon-save />
                    </a-button>
                </a-tooltip>

                <!-- 删除 -->
                <a-tooltip
                    size="small"
                    :content="$t('label.delete')"
                >
                    <a-button
                        size="mini"
                        type="secondary"
                        status="warning"
                        @click="deleteOnClick"
                    >
                        <icon-delete />
                    </a-button>
                </a-tooltip>

                <!-- 重置 -->
                <a-tooltip
                    size="small"
                    :content="$t('label.reset')"
                >
                    <a-button
                        size="mini"
                        type="secondary"
                        status="normal"
                        @click="resetOnClick"
                        ><icon-reply
                    /></a-button>
                </a-tooltip>
            </a-space>
        </a-layout-header>
        <a-layout-content>
            <a-form
                class="form"
                size="mini"
                :model="{}"
                auto-label-width
            >
                <!-- 保存的用户配置 -->

                <!-- REF [Arco Design Vue](https://arco.design/vue/component/collapse) -->
                <a-collapse>
                    <!-- 思源服务设置 -->
                    <a-collapse-item
                        class="collapse-item"
                        key="server"
                    >
                        <template #header>{{ $t("conect_siyuan_client") }}</template>

                        <!-- REF [Arco Design Vue](https://arco.design/vue/component/form) -->
                        <!-- 服务 -->
                        <a-form-item :label="$t('siyuan_server')">
                            <template #help>{{ $t("help.server") }}</template>

                            <!-- 协议名 -->
                            <a-select
                                style="min-width: 6em; max-width: 6em"
                                v-model:model-value="config.server.protocol"
                            >
                                <a-option>http</a-option>
                                <a-option>https</a-option>
                            </a-select>

                            <!-- &thinsp;://&thinsp; -->

                            <!-- 主机名 -->
                            <a-input
                                style="flex: auto"
                                v-model:model-value="config.server.hostname"
                                :placeholder="$t('hostname')"
                            >
                                <template #prepend>://</template>
                                <template #append>:</template>
                            </a-input>

                            <!-- &thinsp;:&thinsp; -->

                            <!-- 端口号 -->
                            <a-input-number
                                style="min-width: 6em; max-width: 6em"
                                v-model="config.server.port"
                                :min="1"
                                :max="65535"
                            >
                            </a-input-number>
                        </a-form-item>

                        <!-- 令牌 -->
                        <a-form-item :label="$t('token')">
                            <template #help>{{ $t("help.token") }}</template>

                            <!-- 令牌输入框 -->
                            <a-input-search
                                search-button
                                @search="testSiyuanServer"
                                v-model:model-value="config.server.token"
                                placeholder="0123456789abcdef"
                            >
                                <!-- 按钮图标 -->
                                <template #button-icon><icon-experiment /></template>

                                <!-- 按钮文本 -->
                                <template #button-default>{{ $t("test") }}</template>
                            </a-input-search>
                        </a-form-item>
                    </a-collapse-item>

                    <!-- 搜索设置 -->
                    <a-collapse-item
                        class="collapse-item"
                        key="search"
                    >
                        <template #header>{{ $t("search_settings") }}</template>

                        <!-- 搜索方案 -->
                        <a-form-item :label="$t('search_config.method.label')">
                            <a-select v-model:model-value="config.search.method">
                                <a-option :value="Method.keyword">{{ $t("search_config.method.keyword") }}</a-option>
                                <a-option :value="Method.querySyntax">{{ $t("search_config.method.querySyntax") }}</a-option>
                                <a-option :value="Method.regex">{{ $t("search_config.method.regex") }}</a-option>
                                <a-option :value="Method.sql">{{ $t("search_config.method.sql") }}</a-option>
                            </a-select>
                        </a-form-item>

                        <!-- 分组方案 -->
                        <a-form-item :label="$t('search_config.groupBy.label')">
                            <template #help>{{ $t("search_config.groupBy.details") }}</template>

                            <a-select v-model:model-value="config.search.groupBy">
                                <a-option :value="GroupBy.noGroupBy">{{ $t("search_config.groupBy.noGroupBy") }}</a-option>
                                <a-option :value="GroupBy.group">{{ $t("search_config.groupBy.group") }}</a-option>
                            </a-select>
                        </a-form-item>

                        <!-- 排序方案 -->
                        <a-form-item :label="$t('search_config.orderBy.label')">
                            <template #help>{{ $t("search_config.orderBy.details") }}</template>

                            <a-select v-model:model-value="config.search.orderBy">
                                <a-optgroup :label="$t('content')">
                                    <a-option :value="OrderBy.type">{{ $t("search_config.orderBy.type") }}</a-option>
                                    <a-option :value="OrderBy.sortByContent">{{ $t("search_config.orderBy.sortByContent") }}</a-option>
                                </a-optgroup>
                                <a-optgroup :label="$t('relevance')">
                                    <a-option :value="OrderBy.sortByRankDesc">{{ $t("search_config.orderBy.sortByRankDesc") }}</a-option>
                                    <a-option :value="OrderBy.sortByRankAsc">{{ $t("search_config.orderBy.sortByRankAsc") }}</a-option>
                                </a-optgroup>
                                <a-optgroup :label="$t('time')">
                                    <a-option :value="OrderBy.createdDESC">{{ $t("search_config.orderBy.createdDESC") }}</a-option>
                                    <a-option :value="OrderBy.createdASC">{{ $t("search_config.orderBy.createdASC") }}</a-option>
                                    <a-option :value="OrderBy.modifiedDESC">{{ $t("search_config.orderBy.modifiedDESC") }}</a-option>
                                    <a-option :value="OrderBy.modifiedASC">{{ $t("search_config.orderBy.modifiedASC") }}</a-option>
                                </a-optgroup>
                            </a-select>
                        </a-form-item>

                        <!-- 指定搜索路径 -->
                        <a-form-item :label="$t('search_config.path.label')">
                            <template #help>{{ $t("search_config.path.details") }}</template>
                            <file-tree-select />
                        </a-form-item>

                        <!-- 块类型筛选 -->
                        <a-form-item :label="$t('search_config.block_types.label')">
                            <template #help>{{ $t("search_config.block_types.details") }}</template>

                            <a-space class="search-types">
                                <!-- 叶子块 -->
                                <fieldset>
                                    <legend>
                                        <a-checkbox
                                            v-model:model-value="leaf"
                                            :indeterminate="leaf_indeterminate"
                                            @change="handleLeaf"
                                        >
                                            {{ $t("search_config.block_types.leaf") }}
                                        </a-checkbox>
                                    </legend>

                                    <a-checkbox-group
                                        v-model:model-value="leafs"
                                        @change="handleLeafs"
                                    >
                                        <a-checkbox :value="Leaf.h">{{ $t("search_config.block_types.heading") }}</a-checkbox>
                                        <a-checkbox :value="Leaf.p">{{ $t("search_config.block_types.paragraph") }}</a-checkbox>
                                        <a-checkbox :value="Leaf.m">{{ $t("search_config.block_types.mathBlock") }}</a-checkbox>
                                        <a-checkbox :value="Leaf.t">{{ $t("search_config.block_types.table") }}</a-checkbox>
                                        <a-checkbox :value="Leaf.c">{{ $t("search_config.block_types.codeBlock") }}</a-checkbox>
                                        <a-checkbox :value="Leaf.html">{{ $t("search_config.block_types.htmlBlock") }}</a-checkbox>
                                        <a-checkbox :value="Leaf.query_embed">{{ $t("search_config.block_types.embedBlock") }}</a-checkbox>
                                    </a-checkbox-group>
                                </fieldset>

                                <!-- 容器块 -->
                                <fieldset>
                                    <legend>
                                        <a-checkbox
                                            v-model:model-value="container"
                                            :indeterminate="container_indeterminate"
                                            @change="handleContainer"
                                        >
                                            {{ $t("search_config.block_types.container") }}
                                        </a-checkbox>
                                    </legend>

                                    <a-checkbox-group
                                        v-model:model-value="containers"
                                        @change="handleContainers"
                                    >
                                        <a-checkbox :value="Container.d">{{ $t("search_config.block_types.document") }}</a-checkbox>
                                        <a-checkbox :value="Container.s">{{ $t("search_config.block_types.superBlock") }}</a-checkbox>
                                        <a-checkbox :value="Container.b">{{ $t("search_config.block_types.blockquote") }}</a-checkbox>
                                        <a-checkbox :value="Container.l">{{ $t("search_config.block_types.list") }}</a-checkbox>
                                        <a-checkbox :value="Container.i">{{ $t("search_config.block_types.listItem") }}</a-checkbox>
                                    </a-checkbox-group>
                                </fieldset>
                            </a-space>
                        </a-form-item>
                    </a-collapse-item>

                    <!-- 其他设置 -->
                    <a-collapse-item
                        class="collapse-item"
                        key="other"
                    >
                        <template #header>{{ $t("other_settings") }}</template>

                        <!-- 界面语言 -->
                        <a-form-item :label="$t('language')">
                            <!-- 语言选择 -->
                            <a-select v-model:model-value="config.other.language.tag">
                                <a-option
                                    v-for="item in config.other.languages"
                                    :value="item.tag"
                                    :key="item.tag"
                                >
                                    {{ item.label }}
                                </a-option>
                            </a-select>
                        </a-form-item>

                        <!-- 主题模式 -->
                        <a-form-item
                            style="margin-bottom: 0"
                            :label="$t('theme.label')"
                        >
                            <!-- 主题模式选择 -->
                            <a-select v-model:model-value="theme.mode">
                                <a-option :value="THEME_MOD.light">
                                    {{ $t("theme.light") }}
                                </a-option>
                                <a-option :value="THEME_MOD.dark">
                                    {{ $t("theme.dark") }}
                                </a-option>
                                <a-option :value="THEME_MOD.system">
                                    {{ $t("theme.system") }}
                                </a-option>
                            </a-select>
                        </a-form-item>
                    </a-collapse-item>
                </a-collapse>
            </a-form>
        </a-layout-content>
    </a-layout>
</template>
<style scoped lang="less">
.panel {
    width: 100%;
    height: 100%;

    overflow-y: auto !important;
    background-color: var(--color-bg-1);
}

.collapse-item {
    // 折叠面板标题
    > :first-child {
        background-color: var(--color-fill-1);

        border-color: var(--color-border-2);
        padding-top: 2px;
        padding-bottom: 2px;
    }

    // 折叠面板内容
    > :last-child {
        background-color: transparent;
        padding: 0 0.5em;
    }
}

.search-types {
    align-items: flex-start;
}

fieldset {
    margin: 0.5em;
    border: 1px solid var(--color-neutral-5);

    legend {
        padding-right: 0.5em;
    }
}
</style>
