import { commands, ExtensionContext } from 'vscode';
import { createTreeViews } from './views/treeViews';
import { GlobalState, GlobalStateKey } from './globalState';
import { openAddComponentWebview, removeComponent } from './commands/openAddComponentWebview';
import { setExtensionContext } from './extensionContext';
import * as shell from 'shelljs';

export function activate(context: ExtensionContext) {
	//@ts-ignore
	shell.config.execPath = shell.which('node').toString();
	setExtensionContext(context);
	createTreeViews(context);

	commands.registerCommand("ocm.add", openAddComponentWebview, {ctx: context});
	commands.registerCommand("ocm.remove", removeComponent);

}

export function deactivate(): void { }