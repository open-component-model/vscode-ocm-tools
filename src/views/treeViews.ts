import { TreeItem, TreeView, window, commands } from 'vscode';
import { WorkspaceDataProvider } from './dataProviders/workspaceDataProvider';
import { RemoteDataProvider } from './dataProviders/remoteDataProvider';

import { ExtensionContext } from 'vscode';
import { Views } from './views';
import { TreeNode } from './nodes/treeNode';

export let workspaceTreeViewProvider: WorkspaceDataProvider;
export let remoteTreeViewProvider: RemoteDataProvider;

let workspaceTreeView: TreeView<TreeItem>;
let remoteTreeView: TreeView<TreeItem>;

export function createTreeViews(context: ExtensionContext) {
	workspaceTreeViewProvider = new WorkspaceDataProvider(context);

	workspaceTreeView = window.createTreeView(Views.WorkspaceView, {
		treeDataProvider: workspaceTreeViewProvider,
		showCollapseAll: true,
	});

	remoteTreeViewProvider = new RemoteDataProvider(context);

	remoteTreeView = window.createTreeView(Views.RemoteView, {
		treeDataProvider: remoteTreeViewProvider,
		showCollapseAll: true,
	});
}

export function refreshWorkspaceTreeView(node?: TreeNode) {
	workspaceTreeViewProvider.refresh(node);
}

export function refreshRemoteTreeView(node?: TreeNode) {
	remoteTreeViewProvider.refresh(node);
}