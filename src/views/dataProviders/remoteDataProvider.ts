import { DataProvider } from './dataProvider';
import { TreeNode } from '../nodes/treeNode';
import { componentDescriptorParser, getComponentDescriptorMeta, ComponentMeta } from '../componentDescriptorToNode';
import { GlobalState, GlobalStateKey } from '../../globalState';
import { HttpsGardenerCloudSchemasComponentDescriptorV2 as ComponentDescriptorV2 } from '../../ocm/ocmv2';
import { HttpsGardenerCloudSchemasComponentDescriptorOcmV3Alpha1 as ComponentDescriptorV3 } from '../../ocm/ocmv3';
import { ComponentNode } from '../nodes/componentNode';
import shell from 'shelljs';

export class RemoteDataProvider extends DataProvider {
  async buildTree(): Promise<TreeNode[]> {
    let nodes: {[key: string]: TreeNode} = {};

    let globalState = new GlobalState(this.context);
    let components: string[] | undefined = 	globalState.get(GlobalStateKey.Components);

    components?.forEach(element => {
      // TODO: we need the component to be the top of the tree with the versions nested within that.
      // context menu needs to have the ability to remove component from global state
      // remote panel should have the ability to add a component
      const cmd = `ocm get components ${element} -ojson --scheme=v3alpha1`;
      const versions = JSON.parse(shell.exec(cmd).stdout).items;
      versions?.forEach((cd: ComponentDescriptorV2 | ComponentDescriptorV3) => {
        let meta: ComponentMeta = getComponentDescriptorMeta(cd);

        if (!nodes.hasOwnProperty(meta.name)) {
          nodes[meta.name] = new ComponentNode(meta.name, meta.provider);
        }

        let node = componentDescriptorParser(cd,"");
        nodes[meta.name].addChild(node);
      });
    });

    return Object.values(nodes);
  }
}