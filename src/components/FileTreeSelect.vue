<script setup lang="ts">
import { inject, ShallowReactive, shallowRef } from "vue";
import { useI18n } from "vue-i18n";
import { Notification, TreeNodeData } from "@arco-design/web-vue";

import { INotebooks, IPayload_listDocsByPath } from "./../types/siyuan";
import { IConfig } from "./../types/config";

import { updateNotebooks, SiyuanClient } from "./../utils/siyuan";
import { DocTree } from "./../utils/doctree";
import { SortMode } from "./../utils/siyuan";
import { TreeNode } from "./../utils/tree";

const { t: $t } = useI18n();

const config = inject("config") as IConfig; // 用户配置
const client = inject("client") as InstanceType<typeof SiyuanClient>; // 客户端
const notebooks = inject("notebooks") as ShallowReactive<INotebooks>; // 笔记本列表
const expanded_keys = shallowRef<string[] | undefined>([]); // 展开的节点

const doctree = new DocTree(notebooks); // 文档树对象

/* 动态加载文档树 */
async function onLoadMore(node: TreeNode): Promise<void> {
    // doctree.mode = Mode.default;
    try {
        expanded_keys.value = undefined;
        const paths = node.key.split("/");
        const payload: IPayload_listDocsByPath = {
            notebook: paths[0],
            path: "",
            sort: SortMode.SortModeCustom,
        };
        if (paths.length === 1) {
            // 笔记本
            payload.path = "/";
        } else {
            // 文档
            payload.path = `/${paths.slice(1).join("/")}`;
        }
        const response = await client.listDocsByPath(payload);
        doctree.updateNode(node, response.data.files, new URL(config.server.url));
    } catch (error) {
        console.warn(error);
        Notification.error({
            title: $t("search"),
            content: String(error),
            closable: true,
            duration: 3000,
        });
    }
}

/* 清空输入框 */
async function onclear(): Promise<void> {
    expanded_keys.value = undefined;
    await updateNotebooks(notebooks, client);
    doctree.initRoots();
}

/* 搜索 */
async function onsearch(k: string): Promise<void> {
    if (k.length === 0) {
        // if (doctree.mode === Mode.default) return;
        onclear();
    } else {
        // doctree.mode = Mode.search;
        try {
            await updateNotebooks(notebooks, client);
            const response = await client.searchDocs({ k });
            doctree.parseSearchDocs(response.data);
            expanded_keys.value = (() => {
                const keys: string[] = [];
                for (const node of doctree.map.values()) {
                    if (!node.disabled ?? false) keys.push(node.key);
                }
                return keys;
            })(); // 展开搜索结果
        } catch (error) {
            console.warn(error);
            Notification.error({
                title: $t("search"),
                content: String(error),
                closable: true,
                duration: 3000,
            });
        }
    }
}

/* 下拉列表展开状态更改 */
function onPopupVisibleChange(visible: boolean) {
    if (visible) updateNotebooks(notebooks, client);
}
</script>

<template>
    <a-tree-select
        size="mini"
        dropdown-class-name="tree-select-dropdown"
        v-model:model-value="config.search.paths"
        :multiple="true"
        :data="doctree.data"
        :allow-clear="true"
        :allow-search="true"
        :disable-filter="true"
        :placeholder="$t('search_config.path.placeholder')"
        :load-more="(node: TreeNodeData) => onLoadMore(node as TreeNode)"
        :tree-props="{
            showLine: true,
            expandedKeys: expanded_keys,
        }"
        @clear="onclear"
        @search="onsearch"
        @popup-visible-change="onPopupVisibleChange"
    >
        <template #empty>
            <a-empty :description="$t('help.search_empty')" />
        </template>
        <template #tree-slot-icon="{ data }">
            <span
                class="node-icon"
                v-html="data?.icon"
            ></span>
        </template>
    </a-tree-select>
</template>

<style lang="less">
.tree-select-dropdown {
    .icon {
        width: 18px;
        height: 18px;
        // REF: [CSS vertical-align 属性](https://www.w3school.com.cn/cssref/pr_pos_vertical-align.asp)
        vertical-align: text-bottom;
    }
}
</style>
