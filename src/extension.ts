import * as vscode from 'vscode';
import { createTreeViews } from './views/treeViews';

export function activate(context: vscode.ExtensionContext) {
	let disposable = vscode.commands.registerCommand('ocm.startup', () => {
		vscode.window.showInformationMessage('ocm activated');
	});

	context.subscriptions.push(disposable);
		
	createTreeViews();
}

export function deactivate() {}
