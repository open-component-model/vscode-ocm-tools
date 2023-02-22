import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { workspace } from 'vscode';
import YAML from 'yaml';
import util from 'util';
import { exec } from '../exec';
import { getExtensionContext } from '../extensionContext';
import { KeyEntry, OCMConfigTypes } from '../ocm/configTypes';
import { resolveTilde } from '../utils/pathUtils';
import { KeyNode } from '../views/nodes/keyNode';
import { keyTreeViewProvider } from '../views/treeViews';

export async function deleteSigningKeys(key: KeyNode): Promise<void> {
	const keyDir = resolveTilde(key.path);
	const privateKey = join(keyDir, key.name + ".key");
	const publicKey = join(keyDir, key.name + ".pub");

	const configPath: string | undefined = workspace.getConfiguration("openComponentModel").get("configurationFile");
	if (!configPath) { return; }

	const configData = readFileSync(resolveTilde(configPath));
	const configFile = YAML.parse(configData.toString());
	const keyElement: KeyEntry = {
		"type": OCMConfigTypes.signingConfigType,
		"privateKeys": {
			[key.name]: {
				"path": privateKey
			}
		},
		"publicKeys": {
			[key.name]: {
				"path": publicKey
			}
		},
	};

	configFile.configurations = configFile.configurations.filter((element: KeyEntry) => !util.isDeepStrictEqual(element,keyElement));

	writeFileSync(resolveTilde(configPath), YAML.stringify(configFile));

	keyTreeViewProvider.refresh();
}
