import { TreeItem, TreeView, window } from 'vscode';
import { WorkspaceDataProvider } from './dataProviders/workspaceDataProvider';
import { Views } from './views';

export let workspaceTreeViewProvider: WorkspaceDataProvider;

let workspaceTreeView: TreeView<TreeItem>;

export function createTreeViews() {
	workspaceTreeViewProvider = new WorkspaceDataProvider();

	workspaceTreeView = window.createTreeView(Views.WorkspaceView, {
		treeDataProvider: workspaceTreeViewProvider,
		showCollapseAll: true,
	});
}
