import { DataProvider } from './dataProvider';
import { TreeNode } from '../nodes/treeNode';
import { componentDescriptorParser, getComponentDescriptorMeta, ComponentMeta } from '../componentDescriptorToNode';
import { GlobalState, GlobalStateKey } from '../../globalState';
import { ComponentNode } from '../nodes/componentNode';
import { ThemeIcon } from 'vscode';
import { fetchComponents } from '../../commands/fetchComponents';

export class RemoteDataProvider extends DataProvider {
  async buildTree(): Promise<TreeNode[]> {
    let nodes: { [key: string]: TreeNode } = {};

    let globalState = new GlobalState(this.context);
    let components: string[] | undefined = globalState.get(GlobalStateKey.Components);

    if (!components) { return []; }

    for (const name of components) {
      for await (const cd of fetchComponents(name)) {
        let meta: ComponentMeta = getComponentDescriptorMeta(cd);
        
        if (!nodes.hasOwnProperty(meta.registry)) {
          let regNode: TreeNode = new TreeNode(meta.registry);
          regNode.setIcon(new ThemeIcon("database"));
          nodes[meta.registry] = regNode;
        }

        let n: ComponentNode | undefined;
        for (const item of nodes[meta.registry].children) {
          if (item.label === meta.name) {
            n = <ComponentNode>item;
            break;
          }
        }

        if (typeof n === 'undefined') {
          n = new ComponentNode(meta.name, meta.provider, meta.registry);
          nodes[meta.registry].addChild(n);
        }

        let node = componentDescriptorParser(cd, "");

        n.addChild(node);
      }
    }

    return Object.values(nodes);
  }
}