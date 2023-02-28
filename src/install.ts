import { shell } from './shell';
import { commands, window } from "vscode";
import { Errorable, failed } from "./errorable";
import { installOCMCli } from './commands/installOCMCLI';

export async function promptToInstallOCM(): Promise<Errorable<null>> {
	const ocmVersion = await getOCMVersion();
	if (failed(ocmVersion)) {
		showInstallOCMNotification();
		return {
			succeeded: false,
			error: ['OCM not found'],
		};
	} else {
		return {
			succeeded: true,
			result: null,
		};
	}
}

export async function getOCMVersion(): Promise<Errorable<null>> {
	const ocmVersionShellResult = await shell.exec('ocm version');

	if (ocmVersionShellResult.code !== 0) {
		return {
			succeeded: false,
			error: ["ocm not found"],
		};
	}

	return {
		succeeded: true,
		result: null,
	};
}

async function showInstallOCMNotification() {
	const installButton = 'Install OCM';
	const pressedButton = await window.showErrorMessage('Please install the ocm CLI to use OCM Tools Extension.', installButton);
	if (pressedButton === installButton) {
		installOCMCli();
	}
}