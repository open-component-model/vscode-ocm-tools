import { exec } from '../exec';
import { window, workspace } from 'vscode';
import { getComponentURI } from '../views/componentDescriptorToNode';
import { ComponentVersionNode } from '../views/nodes/componentVersionNode';

export async function downloadComponent(node: ComponentVersionNode) {
    if (!workspace.workspaceFolders) {return;}
    const component = getComponentURI(node.meta);
    const targetPath = workspace.workspaceFolders[0].uri.toString().replace("file://","");
    const outFile = `${targetPath}/${node.meta.name}`;
    const cmd = `ocm component download ${component} -O ${outFile}`;
    window.showInformationMessage(`Downloading resource ${component} from ${node.meta.name} to ${outFile}...`);
	const result = await exec(cmd, { silent: true });
    window.showInformationMessage(`Download complete: ${result.stdout}`);
}