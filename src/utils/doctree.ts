export {
    Mode,
    DocTree,
};

import { ShallowReactive, reactive, watch, h } from "vue";
import { VueI18nTranslation } from "vue-i18n";

import { TreeNode } from "./../types/tree";
import { Data_searchDocs, ID, INotebooks, Notebook, File } from "./../types/siyuan";

import { IconDOM } from "./icon";

enum Mode {
    default, // 默认模式 (从笔记本一级开始, 逐级展开&加载文档树并选择)
    search, // 搜索模式 (搜索文档名并构建文档树)
}

/* 文档树 */
class DocTree {

    constructor(
        protected _notebooks: ShallowReactive<INotebooks>, // 笔记本
        public $t: VueI18nTranslation, // i10n 方法
        public data = reactive<TreeNode[]>([]), // 树形数据(key: 完整 path)
        public map: Map<ID, TreeNode> = new Map(), // ID => 树节点
        public mode = Mode.default, // 模式
    ) {
        this.$t = $t;

        /* 跟踪笔记本数据更新 */
        watch(
            () => this._notebooks.list,
            notebooks => this.initRoots(notebooks),
            { immediate: true },
        )
    }

    /* 初始化文档树根节点 */
    public initRoots(notebooks: Notebook[] = this._notebooks.list): void {
        this.data.length = 0;
        this.map.clear();

        const roots: TreeNode[] = [];
        notebooks.forEach(notebook => {
            const node: TreeNode = {
                key: notebook.id,
                title: notebook.name,
                isLeaf: false,
                icon: () => [h("span", { innerHTML: notebook.icon })],
            };
            this.map.set(notebook.id, node);
            roots.push(node);
        });

        this.data.push(...roots);
    }

    /* 更新节点 */
    public updateNode(node: TreeNode, files: File[], url: URL) {
        const children: TreeNode[] = [];
        files.forEach(file => {
            /* 新节点 */
            const child: TreeNode = {
                key: `${node.key}/${file.id}`,
                // title: `${node.title}/${file.name.substring(0, file.name.length - 3)}`,
                title: file.name.substring(0, file.name.length - 3),
                icon: () => [h("span", { innerHTML: IconDOM.icon2emojis(file.icon, url) })],
                isLeaf: file.subFileCount === 0,
            };
            children.push(child);
            this.map.set(file.id, child);
        });
        node.children = children;
    }

    /* 解析搜索的文档 */
    public parseSearchDocs(docs: Data_searchDocs[]): void {
        this.initRoots();
        this.data.forEach(root => {
            root.isLeaf = true;
            root.disabled = true;
        });
        docs.forEach(doc => {
            delete this.map.get(doc.box)?.disabled;

            const paths: string[] = []; // ID 路径
            const hPaths: string[] = []; // 可读路径
            switch (true) {
                case doc.path.endsWith("/"): // 笔记本
                    paths.push(doc.box);
                    hPaths.push(doc.hPath.split("/")[0]);
                    break;
                case doc.path.endsWith(".sy"): // 文档
                    paths.push(...`${doc.box}${doc.path.split(".")[0]}`.split("/"));
                    hPaths.push(...doc.hPath.split("/"));
                    break;
                default:
                    break;
            }

            if (paths.length !== hPaths.length) // ID 路径与可读路径深度不一致
                throw new Error(`Path length mismatch: path="${doc.path}", hPath="${doc.hPath}"`);

            if (paths.length === 0) // 无效的路径
                return;

            let depth = paths.length; // 节点深度
            while (depth-- && !this.map.has(paths[depth])); // 找到第一个已存在的节点

            if (depth === -1) // 未找到已存在的根节点
                throw new Error(`Notebook not found: path="${paths[0]}", hPath="${hPaths[0]}"`);

            for (let node = this.map.get(paths[depth]); depth + 1 < paths.length; ++depth) {
                if (node === undefined) // 未找到已存在的节点
                    throw new Error(`Document not found: path="${paths.slice(0, depth + 1).join("/")}", hPath="${hPaths.slice(0, depth + 1).join("/")}"`);

                /* 新节点 */
                const child: TreeNode = {
                    key: paths.slice(0, depth + 2).join("/"),
                    // title: hPaths.slice(0, depth + 2).join("/"),
                    title: hPaths[depth + 1],
                    isLeaf: true,
                };
                this.map.set(paths[depth + 1], child);

                node.isLeaf = false; // 非叶子节点
                if (Array.isArray(node.children))// 存在子节点列表
                    node.children.push(child);
                else // 不存在子节点列表
                    node.children = [child];
                node = child; // 处理下一层节点
            }
        })
    }
}
