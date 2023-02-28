import { shell } from '../shell';
import { window, workspace } from 'vscode';
import { getComponentURI } from '../views/componentDescriptorToNode';
import { ComponentVersionNode } from '../views/nodes/componentVersionNode';
import { ComponentNode } from '../views/nodes/componentNode';
import { output } from '../output';

export async function transferComponent(node: ComponentVersionNode | ComponentNode) {
    if (!workspace.workspaceFolders) { return; }
    const component = getComponentURI(node.meta);
    let target = await window.showInputBox({title: "Transfer Component",prompt: "Enter the url of an OCM Repository, e.g. 'ghcr.io/acme'"});
    if (!target) { return; }
    
    const cmd = `ocm transfer component -f ${component} ${target}`;
    output.send(`Transferring component: ${component} to ${target}...`);
    
    const res = await shell.exec(cmd);
    output.send(`Transfer complete: ${res.stdout}`);
}