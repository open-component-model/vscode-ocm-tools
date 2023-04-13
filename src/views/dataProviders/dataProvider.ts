import { Event, EventEmitter, ExtensionContext, TreeDataProvider, TreeItem } from "vscode";
import { TreeNode } from "../nodes/treeNode";

/**
 * Defines tree view data provider base class for all GitOps tree views.
 */
export class DataProvider implements TreeDataProvider<TreeItem> {
  private _onDidChangeTreeData: EventEmitter<TreeItem | undefined | null | void> = new EventEmitter<
    TreeItem | undefined | null | void
  >();
  readonly onDidChangeTreeData: Event<TreeItem | undefined | null | void> =
    this._onDidChangeTreeData.event;

  context: ExtensionContext;

  constructor(context: ExtensionContext) {
    this.context = context;
  }

  /**
   * Reloads tree view item and its children.
   */
  public refresh() {
    this._onDidChangeTreeData.fire();
  }

  /**
   * Gets tree view item for the specified tree element.
   * @param element Tree element.
   * @returns Tree view item.
   */
  public getTreeItem(element: TreeItem): TreeItem {
    return element;
  }

  /**
   * Gets tree element parent.
   * @param element Tree item to get parent for.
   * @returns Parent tree item or null for the top level nodes.
   */
  public getParent(element: TreeItem): TreeItem | null {
    if (element instanceof TreeNode && element.parent) {
      return element.parent;
    }
    return null;
  }

  /**
   * Gets children for the specified tree element.
   * Creates new tree view items for the root node.
   * @param element The tree element to get children for.
   * @returns Tree element children or empty array.
   */
  public async getChildren(element?: TreeItem): Promise<TreeItem[]> {
    if (element instanceof TreeNode) {
      return element.children;
    } else {
      return await this.buildTree();
    }
  }

  /**
   * Creates initial tree view items collection.
   * @returns
   */
  buildTree(): Promise<TreeNode[]> {
    return Promise.resolve([]);
  }
}
