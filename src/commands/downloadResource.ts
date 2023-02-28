import { shell } from '../shell';
import { workspace } from 'vscode';
import { ResourceNode } from '../views/nodes/resourceNode';
import { getComponentURI } from '../views/componentDescriptorToNode';
import { output } from '../output';

/*
TODO: this only supports downloading directories 
we should be able to support any kind of resource; compressed or otherwise
*/
export async function downloadResource(node: ResourceNode) {
    if (!workspace.workspaceFolders) {return;}
    const component = getComponentURI(node.meta);
    const targetPath = workspace.workspaceFolders[0].uri.toString().replace("file://","");
    const cmd = `ocm resource download ${component} ${node.resource.name} -O ${targetPath}/${node.resource.name}.tar`;
    output.send(`Downloading resource ${component} from ${node.resource.name} to ${workspace.workspaceFolders[0].uri}...`);
	const result = await shell.exec(cmd);
    output.send(`Download complete: ${result.stdout}`);
}