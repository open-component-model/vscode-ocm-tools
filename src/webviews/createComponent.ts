import { readFileSync } from "fs";
import {
  Disposable,
  ExtensionContext,
  OpenDialogOptions,
  Uri,
  ViewColumn,
  Webview,
  WebviewPanel,
  window,
} from "vscode";
import { createComponent } from "../commands/createComponent";
import { asAbsolutePath } from "../extensionContext";
import { GlobalState } from "../globalState";
import { getNonce, getWebviewOptions } from "./webviewUtils";

/**
 * Message sent to webview to initialize it.
 */
interface CreateComponentWebviewContent {
  type: "updateWebviewContent";
  value: {};
}

interface OpenDialogResponse {
  type: "openDialogResponse";
  value: {
    fileUri: string;
    forResourceId: number;
  };
}

export interface FileResource {
  inputType: "file";
  name: string;
  type: string;
  mediaType: string;
  path: string;
  compress: boolean;
}

export interface DirectoryResource {
  inputType: "directory";
  name: string;
  type: string;
  path: string;
  compress: boolean;
}

export interface OciImageResource {
  inputType: "ociImage";
  name: string;
  version: string;
  imageReference: string;
}

export interface GitHubSource {
  name: string;
  version: string;
  accessType: "gitHub";
  repoUrl: string;
  commit: string;
}

export interface Reference {
  name: string;
  componentName: string;
  componentVersion: string;
}

export interface CreateComponent {
  componentName: string;
  version: string;
  provider: string;
  scheme: string;
  resources?: Array<FileResource | DirectoryResource | OciImageResource>;
  references?: Array<Reference>;
  sources?: Array<GitHubSource>;
}

export interface CreateComponentMessage {
  type: "createComponent";
  value: CreateComponent;
}

export interface ShowNotification {
  type: "showNotification";
  value: {
    text: string;
    isModal: boolean;
  };
}

export interface ShowOpenDialog {
  type: "showOpenDialog";
  value: {
    options: OpenDialogOptions;
    forResourceId: number;
  };
}

export interface WebviewLoaded {
  type: "webviewLoaded";
  value: true;
}

/** Message sent from Extension to Webview */
export type MessageToWebview = CreateComponentWebviewContent | OpenDialogResponse;

/** Message sent from Webview to Extension */
export type MessageFromWebview =
  | CreateComponentMessage
  | ShowNotification
  | ShowOpenDialog
  | WebviewLoaded;

/**
 * Manages create source webview panel.
 */
export class CreateComponentPanel {
  /**
   * Track the currently panel. Only allow a single panel to exist at a time.
   */
  public static currentPanel: CreateComponentPanel | undefined;

  public static readonly viewType = "createComponent";

  private readonly _panel: WebviewPanel;
  private readonly _extensionUri: Uri;
  private _disposables: Disposable[] = [];

  private state: GlobalState;
  /** Only send message to webview when it's ready (html parsed, "message" event listener set) */
  private _onWebviewFinishedLoading = () => {};

  public static createOrShow(context: ExtensionContext) {
    const column = window.activeTextEditor ? window.activeTextEditor.viewColumn : undefined;

    let extensionUri: Uri = context.extensionUri;

    if (CreateComponentPanel.currentPanel) {
      CreateComponentPanel.currentPanel._panel.reveal(column);
      return;
    }

    const panel = window.createWebviewPanel(
      CreateComponentPanel.viewType,
      "Create Component",
      column || ViewColumn.One,
      getWebviewOptions(extensionUri)
    );

    CreateComponentPanel.currentPanel = new CreateComponentPanel(panel, extensionUri, context);
  }

  public static revive(panel: WebviewPanel, extensionUri: Uri, context: ExtensionContext) {
    CreateComponentPanel.currentPanel = new CreateComponentPanel(panel, extensionUri, context);
  }

  private constructor(panel: WebviewPanel, extensionUri: Uri, context: ExtensionContext) {
    this._panel = panel;
    this._extensionUri = extensionUri;
    this.state = new GlobalState(context);

    this._update();

    this._panel.onDidDispose(() => this.dispose(), null, this._disposables);

    this._panel.webview.onDidReceiveMessage(
      async (message: MessageFromWebview) => {
        switch (message.type) {
          case "createComponent":
            const msg = `Creating component ${message.value.componentName}:${message.value.version}`;
            window.showInformationMessage(msg, { modal: false });

            const res = await createComponent(message.value);
            res.success
              ? window.showInformationMessage(res.message)
              : window.showErrorMessage(res.message);

            this.dispose();
            break;
          case "showOpenDialog":
            const fileUri = await window.showOpenDialog(message.value.options);
            if (fileUri && fileUri[0]) {
              this._postMessage({
                type: "openDialogResponse",
                value: {
                  fileUri: fileUri[0].fsPath,
                  forResourceId: message.value.forResourceId,
                },
              });
            }
            break;
          case "showNotification":
            window.showInformationMessage(message.value.text, { modal: message.value.isModal });
            break;
          case "webviewLoaded":
            this._onWebviewFinishedLoading();
            break;
        }
      },
      null,
      this._disposables
    );
  }

  public dispose() {
    CreateComponentPanel.currentPanel = undefined;

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

  private async _updateWebviewContent() {}

  private async _update() {
    this._onWebviewFinishedLoading = () => {
      this._updateWebviewContent();
      this._onWebviewFinishedLoading = () => {};
    };
    this._panel.webview.html = this._getHtmlForWebview(this._panel.webview);
  }

  private _getHtmlForWebview(webview: Webview): string {
    // Local path to main script run in the webview
    const scriptPathOnDisk = Uri.joinPath(
      this._extensionUri,
      "media",
      "createComponent",
      "view.js"
    );

    // And the uri we use to load this script in the webview
    const scriptUri = webview.asWebviewUri(scriptPathOnDisk);

    // Local path to css styles
    const styleResetPath = Uri.joinPath(this._extensionUri, "media", "reset.css");
    const styleVSCodePath = Uri.joinPath(this._extensionUri, "media", "vscode.css");
    const stylesPathMainPath = Uri.joinPath(
      this._extensionUri,
      "media",
      "createComponent",
      "view.css"
    );

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
				<meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${
          webview.cspSource
        }; img-src ${webview.cspSource} https:; script-src 'nonce-${nonce}';">

				<meta name="viewport" content="width=device-width, initial-scale=1.0">

				<link href="${stylesResetUri}" rel="stylesheet">
				<link href="${stylesVSCodeUri}" rel="stylesheet">
				<link href="${stylesMainUri}" rel="stylesheet">

				<title>Add Component</title>
			</head>
			<body>
				<main class="app">
					${readFileSync(asAbsolutePath("./media/createComponent/view.html").fsPath).toString()}
				</main>
				<script nonce="${nonce}" src="${scriptUri}" defer></script>
			</body>
			</html>`;
  }
}
