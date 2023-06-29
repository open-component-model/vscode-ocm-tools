import { fetchComponents } from "../../commands/fetchComponents";
import { GlobalState, GlobalStateKey } from "../../globalState";
import {
  ComponentMeta,
  componentDescriptorParser,
  getComponentDescriptorMeta,
} from "../componentDescriptorToNode";
import { ComponentNode } from "../nodes/componentNode";
import { RegistryNode } from "../nodes/registryNode";
import { TreeNode } from "../nodes/treeNode";
import { DataProvider } from "./dataProvider";

export class RemoteDataProvider extends DataProvider {
  async buildTree(): Promise<TreeNode[]> {
    let nodes: { [key: string]: RegistryNode } = {};

    let globalState = new GlobalState(this.context);
    let components: string[] | undefined = globalState.get(GlobalStateKey.Components);

    if (!components) {
      return [];
    }

    for (const name of components) {
      for await (const cd of fetchComponents(name)) {
        let meta: ComponentMeta = getComponentDescriptorMeta(cd);

        if (!nodes.hasOwnProperty(meta.registry)) {
          let regNode: RegistryNode = new RegistryNode(meta.registry);

          nodes[meta.registry] = regNode;
        }

        let n: ComponentNode | undefined;
        for (const item of nodes[meta.registry].children) {
          if (item.label === meta.name) {
            n = <ComponentNode>item;
            break;
          }
        }

        if (typeof n === "undefined") {
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
