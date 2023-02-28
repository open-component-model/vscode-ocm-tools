import { shell } from '../shell';
import { workspace } from 'vscode';
import { getComponentURI } from '../views/componentDescriptorToNode';
import { ComponentVersionNode } from '../views/nodes/componentVersionNode';
import { output } from '../output';

export async function downloadComponent(node: ComponentVersionNode) {
    if (!workspace.workspaceFolders) {return;}
    const component = getComponentURI(node.meta);
    const targetPath = workspace.workspaceFolders[0].uri.toString().replace("file://","");
    const outFile = `${targetPath}/${node.meta.name}`;
    
    const cmd = `ocm component download ${component} -O ${outFile}`;
    output.send(`Downloading resource ${component} from ${node.meta.name} to ${outFile}...`);
	
    const result = await shell.exec(cmd);
    output.send(`Download complete: ${result.stdout}`);
}