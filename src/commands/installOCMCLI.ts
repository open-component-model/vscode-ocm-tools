import fs from 'fs';
import { IncomingMessage } from 'http';
import https from 'https';
import os from 'os';
import path from 'path';
import request from 'request';
import { commands, window } from 'vscode';
import { Errorable, failed, succeeded } from '../errorable';
import { globalState } from '../extension';
import { GlobalStateKey } from '../globalState';
import { output } from '../output';
import { Platform, shell } from '../shell';
import { runTerminalCommand } from '../terminal';
import { appendToPathEnvironmentVariableWindows, createDir, deleteFile, downloadFile, getAppdataPath, moveFile, readFile, unzipFile } from '../utils/fsUtils';
import { refreshAllTreeViews } from '../views/treeViews';

const ocmGitHubProject = 'open-component-model/ocm';

/**
 * Get latest version tag from releases of the specified project.
 *
 * @param gitHubUserProject user/project string e.g. `open-component-model/ocm`
 * @returns version string e.g. `0.4.0`
 */
async function getLatestVersionFromGitHub(gitHubUserProject: string): Promise<Errorable<string>> {
	return new Promise(resolve => {
		https.get(`https://github.com/${gitHubUserProject}/releases/latest`, (res: IncomingMessage) => {

			const location = res.headers.location;
			if (!location) {
				resolve({
					succeeded: false,
					error: [`Failed to get latest ${gitHubUserProject} version: No location in response.`],
				});
				return;
			}

			const latestVersion = location.split('/').pop()?.replace(/^v/, '');
			if (!latestVersion) {
				resolve({
					succeeded: false,
					error: ['Failed to parse version from the location header.'],
				});
				return;
			}

			resolve({
				succeeded: true,
				result: latestVersion,
			});

		}).on('error', err => {
			resolve({
				succeeded: false,
				error: [err.message],
			});
		});
	});
}

/**
 * Download a `checksums.txt` file from the OCM GitHub repository
 * and return it's path on the disk in case of success.
 */
async function downloadChecksums(): Promise<Errorable<string>> {
	const checksumsFileName = "checksums.txt";
	const downloadLink = `https://github.com/${ocmGitHubProject}/releases/latest/download/${checksumsFileName}`;
	const localChecksumPath = path.join(os.tmpdir(), checksumsFileName);
	const downloadChecksumResult = await downloadFile(downloadLink, localChecksumPath);
	if (failed(downloadChecksumResult)) {
		return {
			succeeded: false,
			error: downloadChecksumResult.error,
		};
	} else {
		return {
			succeeded: true,
			result: localChecksumPath,
		};
	}
}
/**
 * Checksum has format:
 * ```
 * 05b70be72e47779d9b9a1404adf97035fca35b5f2649929ea265c92de93a3e22 ocm_Darwin_x86_64.tar.gz
 * 19caebb01b670391ed3ef243d6cd8ff71b314c5fd1a057c8fbf3170540aa31cd ocm_Linux_i386.tar.gz
 * ```
 */
function checkChecksum(checksumFileContents: string, targetFileName: string, computedChecksum: string): Errorable<null> {
	const lines = checksumFileContents.split('\n')
		.filter(line => line.length)
		.map(line => line.split('  '));

	const targetLine = lines.find(line => line[1] === targetFileName);
	if (!targetLine) {
		return {
			succeeded: false,
			error: [`File not found in the checksums.txt file ${targetFileName}`],
		};
	}

	if (targetLine[0] === computedChecksum) {
		return {
			succeeded: true,
			result: null,
		};
	} else {
		return {
			succeeded: false,
			error: [`Checksum mismatch for the file ${targetFileName}`],
		};
	}
}

/**
 * Compute checksum of the file on Windows OS using built-in `CertUtil`.
 */
async function computeChecksumWindows(filePath: string, hashAlgorithm: 'MD5' | 'SHA1' | 'SHA256' | 'SHA384' | 'SHA512'): Promise<Errorable<string>> {
	const shellResult = await shell.exec(`CertUtil -hashfile "${filePath}" ${hashAlgorithm}`);
	if (shellResult.code === 0) {
		const checksum = shellResult.stdout.split('\n')[1]?.trim();
		if (checksum) {
			return {
				succeeded: true,
				result: checksum,
			};
		}
	}

	return {
		succeeded: false,
		error: [`Failed to compute checksum of the file "${filePath}". ${shellResult?.stderr || shellResult?.stdout}`],
	};
}

/**
 * Install ocm cli on the user machine https://github.com/open-component-model/ocm
 */
export async function installOCMCli() {
	const platform = shell.platform();
	if (platform === Platform.Unsupported) {
		window.showErrorMessage(`Unsupported platform ${process.platform}`);
		return;
	}

	if (platform === Platform.Windows) {
		const latestOCMVersionResult = await getLatestVersionFromGitHub(ocmGitHubProject);
		if (failed(latestOCMVersionResult)) {
			window.showErrorMessage(`Failed to infer the latest OCM version ${latestOCMVersionResult.error[0]}`);
			return;
		}

		output.send(`✔ Latest OCM version: ${latestOCMVersionResult.result}`, { revealOutputView: true, newline: 'single' });

		const archString = os.arch() === 'arm64' ? 'arm64' : 'x64' ? 'amd64' : '386';
		const gitHubAssetArchiveName = `ocm_${latestOCMVersionResult.result}_windows_${archString}.zip`;
		const downloadLink = `https://github.com/${latestOCMVersionResult}/releases/latest/download/${gitHubAssetArchiveName}`;
		const localArchiveFilePath = path.join(os.tmpdir(), gitHubAssetArchiveName);

		const downloadResult = await downloadFile(downloadLink, localArchiveFilePath);
		if (failed(downloadResult)) {
			window.showErrorMessage(`File download failed: ${downloadResult.error[0]}`);
			return;
		}

		output.send(`✔ ${downloadLink} downloaded`, { newline: 'single' });

		const unzipResult = await unzipFile(localArchiveFilePath);
		if (failed(unzipResult)) {
			window.showErrorMessage(`File unzip failed: ${unzipResult.error[0]}`);
			return;
		}

		output.send(`✔ Extracted: "${localArchiveFilePath}"`, { newline: 'single' });

		const appDataPathResult = getAppdataPath();
		if (failed(appDataPathResult)) {
			window.showErrorMessage(appDataPathResult.error[0]);
			return;
		}

		const executablePath = path.join(unzipResult.result, 'ocm.exe');
		const appDataOCMExecutablePath = path.join(appDataPathResult.result, 'ocm', 'ocm.exe');

		const createDirResult = await createDir(path.join(appDataPathResult.result, 'ocm'));
		if (failed(createDirResult)) {
			window.showErrorMessage(createDirResult.error[0]);
			return;
		}

		const checksumDownloadResult = await downloadChecksums();
		if (failed(checksumDownloadResult)) {
			window.showErrorMessage(`Failed to download the checksums.txt file ${checksumDownloadResult.error[0]}`);
			return;
		}

		const readChecksumFileResult = await readFile(checksumDownloadResult.result);
		if (failed(readChecksumFileResult)) {
			window.showErrorMessage(`Error reading checksums.txt file ${readChecksumFileResult.error[0]}`);
			return;
		}

		const computeChecksumResult = await computeChecksumWindows(localArchiveFilePath, 'SHA256');
		if (failed(computeChecksumResult)) {
			window.showErrorMessage(`${computeChecksumResult.error[0]}`);
			return;
		}

		const checkChecksumResult = checkChecksum(readChecksumFileResult.result, gitHubAssetArchiveName, computeChecksumResult.result);
		if (failed(checkChecksumResult)) {
			window.showErrorMessage(checkChecksumResult.error[0]);
			return;
		}

		output.send('✔ Checksum matches', { newline: 'single' });

		const moveFileResult = await moveFile(executablePath, appDataOCMExecutablePath);
		if (failed(moveFileResult)) {
			window.showErrorMessage(moveFileResult.error[0]);
			return;
		}

		output.send(`✔ OCM executable path is: "${appDataOCMExecutablePath}"`, { newline: 'single' });

		const appendToPathResult = await appendToPathEnvironmentVariableWindows(path.join(appDataPathResult.result, 'ocm'));
		if (failed(appendToPathResult)) {
			window.showErrorMessage(appendToPathResult.error[0]);
			return;
		}

		output.send('✔ OCM added to the PATH environment variable', { newline: 'single' });

		globalState.set(GlobalStateKey.OCMPath, path.join(appDataPathResult.result, 'ocm'));

		deleteFile(localArchiveFilePath);
		deleteFile(path.join(os.tmpdir(), `ocm_${latestOCMVersionResult.result}_checksums.txt`));

		output.send(`✔ OCM ${latestOCMVersionResult.result} successfully installed`);

		refreshAllTreeViews();
		showNotificationToReloadTheEditor();

		return;
	}

	// Linux/MacOS
	const installFileName = 'ocm-install.sh';
	const tempDirPath = os.tmpdir();
	const tempFilePath = path.join(tempDirPath, installFileName);

	request(
		{
			url: 'https://ocm.software/install.sh',
			rejectUnauthorized: true,
		},
		(error: Error, response: any, body: string) => {
			if (!error && response.statusCode === 200) {
				fs.writeFile(tempFilePath, body, err => {
					if (err) {
						window.showErrorMessage(err.message);
						return;
					}
					// cannot use `shell.execWithOutput()` Script requires input from the user (password)
					runTerminalCommand(`bash "./${installFileName}"`, {
						cwd: tempDirPath,
						focusTerminal: true,
					});
				});
			} else {
				window.showErrorMessage(`Request failed ${error}`);
			}
		},
	);
}

async function showNotificationToReloadTheEditor() {
	const reloadEditorButton = 'Reload Editor';
	const pressedButton = await window.showInformationMessage('OCM successfully installed.', reloadEditorButton);
	if (pressedButton === reloadEditorButton) {
		commands.executeCommand('workbench.action.reloadWindow');
	}
}
