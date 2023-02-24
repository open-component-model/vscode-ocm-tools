import { ExtensionContext, window, Uri, workspace } from 'vscode';
import { getExtensionContext } from '../extensionContext';
import { GlobalState, GlobalStateKey } from '../globalState';
import { ComponentNode } from '../views/nodes/componentNode';
import { remoteTreeViewProvider } from '../views/treeViews';

export async function removeRemoteComponent(node: ComponentNode) {
	let ctx: ExtensionContext = getExtensionContext();
	let state: GlobalState = new GlobalState(ctx);
	let existingComponents: string[] | undefined = state.get(GlobalStateKey.Components);
	if (!existingComponents) { return; }
	let component: string = `${node.meta.registry}//${node.meta.name}`;
	state.set(GlobalStateKey.Components, existingComponents.filter(x => x !== component));
	remoteTreeViewProvider.refresh();
	let msg: string = `Component removed: ${component}`;
	window.showInformationMessage(msg, {
		modal: false,
	});
}