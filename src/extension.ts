import { ExtensionContext } from 'vscode';
import { createTreeViews } from './views/treeViews';
import { GlobalState, GlobalStateKey } from './globalState';
import shell from 'shelljs';

export function activate(context: ExtensionContext) {
	//@ts-ignore
	shell.config.execPath = shell.which('node').toString();

	let globalState = new GlobalState(context);

	// globalState.set(GlobalStateKey.Components, [
	// 	"ghcr.io/phoban01//phoban.io/podinfo",
	// 	"ghcr.io/phoban01/ocm//github.com/weaveworks/weave-gitops"
	// ]);

	createTreeViews(context);
}

export function deactivate(): void { }
