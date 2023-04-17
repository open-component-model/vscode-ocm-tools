import { ExtensionContext, TreeItem, TreeView, window } from "vscode";
import { KeyDataProvider } from "./dataProviders/keyDataProvider";
import { RemoteDataProvider } from "./dataProviders/remoteDataProvider";
import { WorkspaceDataProvider } from "./dataProviders/workspaceDataProvider";
import { Views } from "./views";

export let workspaceTreeViewProvider: WorkspaceDataProvider;
export let remoteTreeViewProvider: RemoteDataProvider;
export let keyTreeViewProvider: KeyDataProvider;

let workspaceTreeView: TreeView<TreeItem>;
let remoteTreeView: TreeView<TreeItem>;
let keyTreeView: TreeView<TreeItem>;

export function createTreeViews(context: ExtensionContext) {
  workspaceTreeViewProvider = new WorkspaceDataProvider(context);
  workspaceTreeView = window.createTreeView(Views.workspaceView, {
    treeDataProvider: workspaceTreeViewProvider,
    showCollapseAll: true,
  });

  remoteTreeViewProvider = new RemoteDataProvider(context);
  remoteTreeView = window.createTreeView(Views.remoteView, {
    treeDataProvider: remoteTreeViewProvider,
    showCollapseAll: true,
  });

  keyTreeViewProvider = new KeyDataProvider(context);
  keyTreeView = window.createTreeView(Views.keysView, {
    treeDataProvider: keyTreeViewProvider,
    showCollapseAll: true,
  });
}

export function refreshAllTreeViews() {
  refreshWorkspaceTreeView();
  refreshRemoteTreeView();
  refreshKeyTreeView();
}

export function refreshWorkspaceTreeView() {
  workspaceTreeViewProvider.refresh();
}

export function refreshRemoteTreeView() {
  remoteTreeViewProvider.refresh();
}

export function refreshKeyTreeView() {
  keyTreeViewProvider.refresh();
}
