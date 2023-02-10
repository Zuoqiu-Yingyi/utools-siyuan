import { TreeNodeData } from "@arco-design/web-vue";

export interface TreeNode extends TreeNodeData {
    key: string;
    title: string;
    isLeaf: boolean;
}
