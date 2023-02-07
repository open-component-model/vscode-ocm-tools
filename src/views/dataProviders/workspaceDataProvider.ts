import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { parse } from 'yaml';
import { DataProvider } from './dataProvider';
import { TreeNode } from '../nodes/treeNode';
import { ComponentDescriptorNode } from '../nodes/componentDescriptorNode';
import { ResourceNode, ResourceTypes} from '../nodes/resourceNode';
import { SourceNode, SourceTypes } from '../nodes/sourceNode';
import { ReferenceNode, ReferenceTypes } from '../nodes/referenceNode';


export class WorkspaceDataProvider extends DataProvider {
  async buildTree(): Promise<TreeNode[]> {
    if (!vscode.workspace.workspaceFolders) {
      return [];
    }

    let workspaceRoot = vscode.workspace.workspaceFolders[0].uri.path;

    let nodes: ComponentDescriptorNode[] = [];

    for await (const path of walk(workspaceRoot)) {
      let cd: any = parse(fs.readFileSync(path, 'utf-8'));
      if (cd.apiVersion) {
        let node = getNode(cd.metadata.name,cd.metadata.version,path, cd.spec.resources,cd.spec.sources,cd.spec.references);
        nodes.push(node);
      } else {
        cd = cd.component;
        let node = getNode(cd.name,cd.version, path, cd.resources, cd.sources,cd.componentReferences);
        nodes.push(node);
      }
    };

    return nodes;
  }
}

async function* walk(dir: string): AsyncGenerator<string, any, void> {
  for await (const d of await fs.promises.opendir(dir)) {
    const entry = path.join(dir, d.name);
    if (d.isDirectory()) { yield* walk(entry); }
    else if (d.isFile() && d.name === "component-descriptor.yaml") { yield entry; };
  }
}

function getNode(
  name: string, 
  version: string, 
  path: string, 
  res?: ResourceTypes[], src?: SourceTypes[], ref?: ReferenceTypes[]): ComponentDescriptorNode {
    let node = new ComponentDescriptorNode(name, version, path);

    let resources = new TreeNode("resources");
    let sources = new TreeNode("sources");
    let references = new TreeNode("references");

    if (res && res.length) {
      res.map((x: ResourceTypes) => resources.addChild(new ResourceNode(x.name,x)));
      node.addChild(resources);
    }

    if (src && src.length) {
      src.map((x: SourceTypes) => sources.addChild(new SourceNode(x.name, x)));
      node.addChild(sources);
    }

    if (ref && ref.length) {
      ref?.map((x: ReferenceTypes) => references.addChild(new ReferenceNode(x.name, x)));
      node.addChild(references);
    }

    return node;
}
