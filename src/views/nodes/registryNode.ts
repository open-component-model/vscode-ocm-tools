import { ThemeIcon } from "vscode";
import { TreeNode } from "./treeNode";

export class RegistryNode extends TreeNode {
  name: string;

  constructor(name: string) {
    super(name);

    this.name = name;

    this.iconPath = new ThemeIcon("database");
  }

  // @ts-ignore
  get tooltip() {
    return this.name;
  }

  get contexts() {
    return ["Registry"];
  }
}
