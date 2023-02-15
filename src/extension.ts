import { commands, ExtensionContext } from 'vscode';
import { createTreeViews } from './views/treeViews';
import { addComponent, removeComponent } from './commands';
import { setExtensionContext } from './extensionContext';
import * as shell from 'shelljs';

export function activate(context: ExtensionContext) {
	//@ts-ignore
	shell.config.execPath = shell.which('node').toString();

	setExtensionContext(context);
	createTreeViews(context);

	commands.registerCommand("ocm.add", addComponent);
	commands.registerCommand("ocm.remove", removeComponent);
}

export function deactivate(): void { }