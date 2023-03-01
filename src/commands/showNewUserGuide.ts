import { readFileSync } from 'fs';
import * as vscode from 'vscode';
import { asAbsolutePath } from '../extensionContext';


export function showNewUserGuide() {
	const panel = vscode.window.createWebviewPanel(
		'ocmNewUserGuide', // Identifies the type of the webview. Used internally
		'Welcome to Open Component Model - New User Guide',
		vscode.ViewColumn.One, // Editor column to show the new webview panel in.
		{
			enableScripts: false,
		},

	);

	panel.iconPath = asAbsolutePath('resources/icons/gitops-logo.png');
	panel.webview.html = getWebviewContent(panel.webview);
}

function getWebviewContent(webview: vscode.Webview) {
	const styleResetPath = webview.asWebviewUri(asAbsolutePath('media/reset.css'));
	const styleVSCodePath = webview.asWebviewUri(asAbsolutePath('media/vscode.css'));
	const styleNewUserGuide = webview.asWebviewUri(asAbsolutePath('media/newUserGuide/view.css'));

	const htmlBody = readFileSync(asAbsolutePath('media/newUserGuide/view.html').fsPath).toString();

	return `<!DOCTYPE html>
	<html lang="en">
		<head>
			<meta charset="UTF-8">
			<meta name="viewport" content="width=device-width, initial-scale=1.0">
			<link rel='stylesheet' href='${styleResetPath}' />
			<link rel='stylesheet' href='${styleVSCodePath}' />
			<link rel='stylesheet' href='${styleNewUserGuide}' />
			<title>Welcome to GitOps - New User Guide</title>
		</head>
		<body>
			${htmlBody}
		</body>

	</html>`;
}
