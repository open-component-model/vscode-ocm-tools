import { ExtensionContext } from 'vscode';
import { getExtensionContext } from '../extensionContext';
import { AddComponentPanel } from '../webviews/addComponent';

export async function openAddComponentWebview(this: {ctx: ExtensionContext}) {
	AddComponentPanel.createOrShow(getExtensionContext().extensionUri,this.ctx);
}