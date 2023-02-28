import * as vscode from 'vscode';
import * as path from 'path';
import { DataProvider } from './dataProvider';
import { TreeNode } from '../nodes/treeNode';
import { workspace } from 'vscode';
import { readFileSync } from 'fs';
import YAML from 'yaml';
import { KeyEntry, OCMConfigTypes } from '../../ocm/configTypes';
import { resolveTilde } from '../../utils/pathUtils';
import { KeyNode } from '../nodes/keyNode';


export class KeyDataProvider extends DataProvider {
  async buildTree(): Promise<TreeNode[]> {
    if (!vscode.workspace.workspaceFolders) {
      return [];
    }

    const configPath: string | undefined = workspace.getConfiguration("openComponentModel").get("configurationFile");
    if (!configPath) { return []; }

    let nodes: TreeNode[] = [];

    const configData = readFileSync(resolveTilde(configPath));
    const configFile = YAML.parse(configData.toString());

    configFile.configurations.forEach((element: KeyEntry) => {
      if (element.type === OCMConfigTypes.signingConfigType) {
        for (let i of Object.keys(element.privateKeys)) {
          nodes.push(new KeyNode(i, path.dirname(element.privateKeys[i].path)));
        }
      }
    });

    return nodes;
  }
}
