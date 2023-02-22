import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { workspace } from 'vscode';
import YAML from 'yaml';
import util from 'util';
import { KeyEntry, OCMConfigTypes } from '../ocm/configTypes';
import { resolveTilde } from '../utils/pathUtils';
import { KeyNode } from '../views/nodes/keyNode';
import { keyTreeViewProvider } from '../views/treeViews';
import { getConfigFile } from '../ocm/getConfigFile';
import { writeConfigFile } from '../ocm/writeConfigFile';

export async function deleteSigningKeys(key: KeyNode): Promise<void> {
	const keyDir = resolveTilde(key.path);
	const privateKey = join(keyDir, key.name + ".key");
	const publicKey = join(keyDir, key.name + ".pub");
	const configFile = getConfigFile();
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

	writeConfigFile(configFile);

	keyTreeViewProvider.refresh();
}
