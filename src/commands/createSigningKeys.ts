import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { workspace } from 'vscode';
import YAML from 'yaml';
import { exec } from '../shell';
import { getExtensionContext } from '../extensionContext';
import { OCMConfigTypes } from '../ocm/configTypes';
import { resolveTilde } from '../utils/pathUtils';
import { keyTreeViewProvider } from '../views/treeViews';
import { CreateSigningKeysPanel } from '../webviews/createSigningKeys';

export async function createSigningKeysView() {
	CreateSigningKeysPanel.createOrShow(getExtensionContext());
}

export async function createSigningKeys(path: string, name: string): Promise<void> {
	const keyDir = resolveTilde(path);
	const privateKey = join(keyDir,name+".key");
	const publicKey = join(keyDir,name+".pub");

	if (!existsSync(keyDir)) {
		mkdirSync(keyDir,{recursive: true});
	}

	const cmd = `ocm create rsakeypair ${privateKey} ${publicKey}`;

	const res = await exec(cmd, { silent: true });

	const configPath: string | undefined = workspace.getConfiguration("openComponentModel").get("configurationFile");
	if (!configPath) { return;}

	const configData = readFileSync(resolveTilde(configPath));
	const configFile = YAML.parse(configData.toString());
	const keyElement = {
		"type": OCMConfigTypes.signingConfigType,
		"privateKeys": {
			[name]: {
				"path": privateKey
			}
		},
		"publicKeys": {
			[name]: {
				"path": publicKey
			}
		},		
	};

	configFile.configurations.push(keyElement);

	writeFileSync(resolveTilde(configPath), YAML.stringify(configFile));

	keyTreeViewProvider.refresh();
	// add key view nodes and data provider

	// enable adding existing keys and updating the config

	// try to verify components using any available keys for the provider

	// when signing components let the user choose the signing key from 
}
