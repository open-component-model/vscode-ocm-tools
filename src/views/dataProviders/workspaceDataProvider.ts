import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { DataProvider } from './dataProvider';
import { TreeNode } from '../nodes/treeNode';
import { ComponentNode } from '../nodes/componentNode';
import { componentDescriptorParser, getComponentDescriptorMeta, ComponentMeta } from '../componentDescriptorToNode';
import { fetchComponents } from '../../commands/fetchComponents';

export class WorkspaceDataProvider extends DataProvider {
  async buildTree(): Promise<TreeNode[]> {
    if (!vscode.workspace.workspaceFolders) {
      return [];
    }

    let workspaceRoot = vscode.workspace.workspaceFolders[0].uri.path;

    let nodes: {[key: string]: TreeNode} = {};

    for await (const path of walk(workspaceRoot)) {
      for await (const cd of fetchComponents(path)) {
        let meta: ComponentMeta = getComponentDescriptorMeta(cd);

        if (!nodes.hasOwnProperty(meta.name)) {
          nodes[meta.name] = new ComponentNode(meta.name, meta.provider);
        }
        
        let node = componentDescriptorParser(cd, path);
        nodes[meta.name].addChild(node);
      }

    };

    return Object.values(nodes);
  }
}

async function* walk(dir: string): AsyncGenerator<string, any, void> {
  for await (const d of await fs.promises.opendir(dir)) {
    const entry = path.join(dir, d.name);
    if (d.isDirectory()) { yield* walk(entry); }
    else if (d.isFile() && d.name === "component-descriptor.yaml") { yield dir; };
  }
}