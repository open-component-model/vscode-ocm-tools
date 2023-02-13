import { readFileSync } from 'fs';
import { Disposable, ExtensionContext, Uri, ViewColumn, Webview, WebviewPanel, window } from 'vscode';
import { getNonce, getWebviewOptions } from './webviewUtils';
import { asAbsolutePath } from '../extensionContext';
import { GlobalState, GlobalStateKey } from '../globalState';
import { remoteTreeViewProvider } from '../views/treeViews';
/**
 * Message sent to webview to initialize it.
 */
interface AddComponentWebviewContent {
	type: 'updateWebviewContent';
	value: {};
}

export interface AddComponent {
	type: 'addComponent';
	value: {
		repositoryURL: string;
		componentName: string;
	};
}

export interface ShowNotification {
	type: 'showNotification';
	value: {
		text: string;
		isModal: boolean;
	};
}

export interface WebviewLoaded {
	type: 'webviewLoaded';
	value: true;
}

/** Message sent from Extension to Webview */
export type MessageToWebview = AddComponentWebviewContent;

/** Message sent from Webview to Extension */
export type MessageFromWebview = AddComponent | ShowNotification | WebviewLoaded;

/**
 * Manages create source webview panel.
 */
export class AddComponentPanel {
	/**
	 * Track the currently panel. Only allow a single panel to exist at a time.
	 */
	public static currentPanel: AddComponentPanel | undefined;

	public static readonly viewType = 'addComponent';

	private readonly _panel: WebviewPanel;
	private readonly _extensionUri: Uri;
	private _disposables: Disposable[] = [];

	private state: GlobalState;
	/** Only send message to webview when it's ready (html parsed, "message" event listener set) */
	private _onWebviewFinishedLoading = () => {};

	public static createOrShow(extensionUri: Uri, context: ExtensionContext) {
		const column = window.activeTextEditor ? window.activeTextEditor.viewColumn : undefined;

		// If we already have a panel, show it.
		if (AddComponentPanel.currentPanel) {
			AddComponentPanel.currentPanel._panel.reveal(column);
			return;
		}

		// Otherwise, create a new panel.
		const panel = window.createWebviewPanel(
			AddComponentPanel.viewType,
			'Add Component',
			column || ViewColumn.One,
			getWebviewOptions(extensionUri),
		);

		AddComponentPanel.currentPanel = new AddComponentPanel(panel, extensionUri,context);
	}

	public static revive(panel: WebviewPanel, extensionUri: Uri, context: ExtensionContext) {
		AddComponentPanel.currentPanel = new AddComponentPanel(panel, extensionUri, context);
	}

	private constructor(panel: WebviewPanel, extensionUri: Uri, context: ExtensionContext) {
		this._panel = panel;
		this._extensionUri = extensionUri;
		this.state = new GlobalState(context);
		
		// Set the webview's initial html content
		this._update();

		// Listen for when the panel is disposed
		// This happens when the user closes the panel or when the panel is closed programmatically
		this._panel.onDidDispose(() => this.dispose(), null, this._disposables);

		// Update the content based on view changes
		this._panel.onDidChangeViewState(e => {
			console.log(e);
			if (this._panel.visible) {
				this._update();
			}
		}, null, this._disposables );

		// Handle messages from the webview
		this._panel.webview.onDidReceiveMessage(async (message: MessageFromWebview) => {
			switch (message.type) {
				case 'addComponent': {
					//TODO:  validation before adding component to remote list
					const component = `${message.value.repositoryURL}//${message.value.componentName}`;
					const msg = `Added component ${component}`;

					let updatedComponents: string[];
					let existingComponents: string[] | undefined = this.state.get(GlobalStateKey.Components);

					if (!existingComponents) {
						updatedComponents = [component];
					} else {
						updatedComponents = existingComponents.concat(component);
					}

					this.state.set(GlobalStateKey.Components, updatedComponents);

					remoteTreeViewProvider.refresh();

					window.showInformationMessage(msg, {
						modal: false,
					});

					this.dispose();
					break;
				}
				case 'showNotification': {
					window.showInformationMessage(message.value.text, {
						modal: message.value.isModal,
					});
					break;
				}
				case 'webviewLoaded': {
					this._onWebviewFinishedLoading();
					break;
				}
			}
		},
		null,
		this._disposables,
		);
	}

	public dispose() {
		AddComponentPanel.currentPanel = undefined;

		// Clean up our resources
		this._panel.dispose();

		while (this._disposables.length) {
			const x = this._disposables.pop();
			if (x) {
				x.dispose();
			}
		}
	}

	private _postMessage(message: MessageToWebview) {
		this._panel.webview.postMessage(message);
	}

	private async _updateWebviewContent() {
	}

	/**
	 * Set webview html and send a message to update the contents.
	 */
	private async _update() {
		this._onWebviewFinishedLoading = () => {
			this._updateWebviewContent();
			this._onWebviewFinishedLoading = () => {};
		};
		this._panel.webview.html = this._getHtmlForWebview(this._panel.webview);
	}

	private _getHtmlForWebview(webview: Webview) {
		// Local path to main script run in the webview
		const scriptPathOnDisk = Uri.joinPath(this._extensionUri, 'media', 'addComponent.js');

		// And the uri we use to load this script in the webview
		const scriptUri = webview.asWebviewUri(scriptPathOnDisk);
		
		// Local path to css styles
		const styleResetPath = Uri.joinPath(this._extensionUri, 'media', 'reset.css');
		const styleVSCodePath = Uri.joinPath(this._extensionUri, 'media', 'vscode.css');
		const stylesPathMainPath = Uri.joinPath(this._extensionUri, 'media', 'addComponent.css');

		// Uri to load styles into webview
		const stylesResetUri = webview.asWebviewUri(styleResetPath);
		const stylesVSCodeUri = webview.asWebviewUri(styleVSCodePath);
		const stylesMainUri = webview.asWebviewUri(stylesPathMainPath);

		// Use a nonce to only allow specific scripts to be run
		const nonce = getNonce();
		return `<!DOCTYPE html>
			<html lang="en">
			<head>
				<meta charset="UTF-8">
				<!--
					Use a content security policy to only allow loading images from https or from our extension directory,
					and only allow scripts that have a specific nonce.
				-->
				<meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource}; img-src ${webview.cspSource} https:; script-src 'nonce-${nonce}';">

				<meta name="viewport" content="width=device-width, initial-scale=1.0">

				<link href="${stylesResetUri}" rel="stylesheet">
				<link href="${stylesVSCodeUri}" rel="stylesheet">
				<link href="${stylesMainUri}" rel="stylesheet">

				<title>Add Component</title>
			</head>
			<body>
				<main class="app">
					${readFileSync(asAbsolutePath('./media/addComponent.html').fsPath).toString()}
				</main>
				<script nonce="${nonce}" src="${scriptUri}" defer></script>
			</body>
			</html>`;
	}
}