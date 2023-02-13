import { DataProvider } from './dataProvider';
import { TreeNode } from '../nodes/treeNode';
import { ChildProcess } from 'child_process';

import { componentDescriptorParser, getComponentDescriptorMeta, ComponentMeta } from '../componentDescriptorToNode';
import { GlobalState, GlobalStateKey } from '../../globalState';
import { HttpsGardenerCloudSchemasComponentDescriptorV2 as ComponentDescriptorV2 } from '../../ocm/ocmv2';
import { HttpsGardenerCloudSchemasComponentDescriptorOcmV3Alpha1 as ComponentDescriptorV3 } from '../../ocm/ocmv3';
import { ComponentNode } from '../nodes/componentNode';
import * as shelljs from 'shelljs';

export class RemoteDataProvider extends DataProvider {
  async buildTree(): Promise<TreeNode[]> {
    let nodes: { [key: string]: TreeNode } = {};

    let globalState = new GlobalState(this.context);
    let components: string[] | undefined = globalState.get(GlobalStateKey.Components);
    if (!components) { return []; }
    
    for (const name of components) {
      for await (const cd of fetchComponents(name)) {
        let meta: ComponentMeta = getComponentDescriptorMeta(cd);
       
        if (!nodes.hasOwnProperty(meta.name)) {
          nodes[meta.name] = new ComponentNode(meta.name, meta.provider);
        }

        let node = componentDescriptorParser(cd, "");
        nodes[meta.name].addChild(node);
      }
    }

    return Object.values(nodes);
  }
}

//TODO: this should be in library
async function* fetchComponents(name: string): AsyncGenerator<ComponentDescriptorV2 | ComponentDescriptorV3, any, void> {
  const cmd = `ocm get components ${name} -ojson --scheme=v3alpha1`;
  const result = await exec(cmd, { silent: true });
  const items = JSON.parse(result.stdout).items;
  for (const i of items) {
    yield i;
  };
}

async function exec(cmd: string, opts: any, callback?: ((proc: ChildProcess) => void) | null, stdin?: string): Promise<ShellResult> {
  return new Promise<any>(resolve => {
    const proc = shelljs.exec(cmd, opts, (code: any, stdout: any, stderr: any) => resolve({ code: code, stdout: stdout, stderr: stderr }));
    if (stdin) {
      proc.stdin?.end(stdin);
    }
    if (callback) {
      callback(proc);
    }
  });
}

export interface ShellResult {
  readonly code: number;
  readonly stdout: string;
  readonly stderr: string;
}