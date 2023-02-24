import { exec } from '../exec';
import { window, workspace } from 'vscode';
import { getComponentURI } from '../views/componentDescriptorToNode';
import { ComponentVersionNode } from '../views/nodes/componentVersionNode';
import { getConfigFile } from '../ocm/getConfigFile';
import { OCMConfigTypes, KeyEntry } from '../ocm/configTypes';
import { ComponentNode } from '../views/nodes/componentNode';

export async function signComponent(node: ComponentVersionNode | ComponentNode) {
    if (!workspace.workspaceFolders) { return; }
    const component = getComponentURI(node.meta);
    const configFile = getConfigFile();
    let keys: string[] = [];
    configFile.configurations.forEach((element: KeyEntry) => {
        if (element.type === OCMConfigTypes.signingConfigType) {
            for (let i of Object.keys(element.privateKeys)) {
                keys.push(i);
            }
        }
    });
    let result = await window.showQuickPick(keys, { title: "Select a signing key..."});
    if (!result) { return; }
    const cmd = `ocm component sign --signature ${result} ${component}`;
    window.showInformationMessage(`Signing component: ${component}`);
    const res = await exec(cmd, { silent: false });
    window.showInformationMessage(`Signing result: ${res.stdout}`);
}