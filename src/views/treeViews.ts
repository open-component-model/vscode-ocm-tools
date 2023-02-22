import { TreeItem, TreeView, window, commands } from 'vscode';
import { WorkspaceDataProvider } from './dataProviders/workspaceDataProvider';
import { RemoteDataProvider } from './dataProviders/remoteDataProvider';
import { ExtensionContext } from 'vscode';
import { Views } from './views';
import { TreeNode } from './nodes/treeNode';
import { KeyDataProvider } from './dataProviders/keyDataProvider';

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

export function refreshWorkspaceTreeView(node?: TreeNode) {
	workspaceTreeViewProvider.refresh(node);
}

export function refreshRemoteTreeView(node?: TreeNode) {
	remoteTreeViewProvider.refresh(node);
}
