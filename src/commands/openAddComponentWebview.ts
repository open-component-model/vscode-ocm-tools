import { ExtensionContext, window } from 'vscode';
import { getExtensionContext } from '../extensionContext';
import { AddComponentPanel } from '../webviews/addComponent';
import { ComponentVersionNode } from '../views/nodes/componentVersionNode';
import { ComponentNode } from '../views/nodes/componentNode';
import { GlobalState,GlobalStateKey } from '../globalState';
import { remoteTreeViewProvider } from '../views/treeViews';

export async function removeComponent(node: ComponentNode) {
	let ctx: ExtensionContext = getExtensionContext();
	let state: GlobalState = new GlobalState(ctx);

	let components: string[] | undefined = state.get(GlobalStateKey.Components);
	
	if (!components) {return ;}

	let item: string = `${node.registry}//${node.name}`;

	components = components.filter(x => x !== item);
	
	state.set(GlobalStateKey.Components, components);

	remoteTreeViewProvider.refresh();

	let msg: string = `Component removed: ${item}`;
	window.showInformationMessage(msg, {
		modal: false,
	});
}

export async function openAddComponentWebview() {
	AddComponentPanel.createOrShow(getExtensionContext());
}