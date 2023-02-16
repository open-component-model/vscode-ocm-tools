import * as shell from 'shelljs';
import { ExtensionContext } from 'vscode';
import { registerCommands } from './commands';
import { createDocumentProvider } from './documents/dataProvider';
import { setExtensionContext } from './extensionContext';
import { createTreeViews } from './views/treeViews';

export function activate(context: ExtensionContext) {
	//@ts-ignore
	shell.config.execPath = shell.which('node').toString();

	setExtensionContext(context);
	createTreeViews(context);
	createDocumentProvider(context);
	registerCommands();
}

export function deactivate(): void { }


