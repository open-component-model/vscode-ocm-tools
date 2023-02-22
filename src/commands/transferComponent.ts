import { exec } from '../exec';
import { window, workspace } from 'vscode';
import { getComponentURI } from '../views/componentDescriptorToNode';
import { ComponentVersionNode } from '../views/nodes/componentVersionNode';
import { ComponentNode } from '../views/nodes/componentNode';

export async function transferComponent(node: ComponentVersionNode | ComponentNode) {
    if (!workspace.workspaceFolders) { return; }
    const component = getComponentURI(node.meta);
    let target = await window.showInputBox({title: "Transfer Component",prompt: "Enter the url of an OCM Repository, e.g. 'ghcr.io/acme'"});
    if (!target) { return; }
    const cmd = `ocm transfer component -f ${component} ${target}`;
    console.log(cmd);
    const res = await exec(cmd, { silent: false });
    window.showInformationMessage(res.stdout);
}