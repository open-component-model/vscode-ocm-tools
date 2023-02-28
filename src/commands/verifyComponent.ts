import { shell } from '../shell';
import { window, workspace } from 'vscode';
import { getComponentURI } from '../views/componentDescriptorToNode';
import { ComponentVersionNode } from '../views/nodes/componentVersionNode';
import { getConfigFile } from '../ocm/getConfigFile';
import { OCMConfigTypes, KeyEntry } from '../ocm/configTypes';
import { ComponentNode } from '../views/nodes/componentNode';
import { output } from '../output';

export async function verifyComponent(node: ComponentVersionNode | ComponentNode) {
    if (!workspace.workspaceFolders) { return; }
    const component = getComponentURI(node.meta);
    const configFile = getConfigFile();
    let keys: {[key: string]: string} = {};
    configFile.configurations.forEach((element: KeyEntry) => {
        if (element.type === OCMConfigTypes.signingConfigType) {
            for (let i of Object.keys(element.publicKeys)) {
                keys[i] = element.publicKeys[i].path;
            }
        }
    });
    
    let result = await window.showQuickPick(Object.keys(keys), { title: "Select a signing key..."});
    if (!result) { return; }
    
    const cmd = `ocm component verify --signature ${result} --public-key ${keys[result]} ${component}`;
    output.send(`Verifying component: ${component}`);
    
    const res = await shell.exec(cmd);
    output.send(`Verification result: ${res.stdout}`);
}