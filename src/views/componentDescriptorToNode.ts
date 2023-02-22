import { ResourceNode, ResourceTypes } from './nodes/resourceNode';
import { SourceNode, SourceTypes } from './nodes/sourceNode';
import { ReferenceNode, ReferenceTypes } from './nodes/referenceNode';
import { ComponentVersionNode } from './nodes/componentVersionNode';
import { TreeNode } from './nodes/treeNode';
import { HttpsGardenerCloudSchemasComponentDescriptorOcmV3Alpha1 as ComponentDescriptorV3, OciRepositoryContext } from '../ocm/ocmv3';

export type ComponentMeta = {
    name: string
    provider: string
    version: string
    registry: string
    path: string
    signed: boolean
    verified: boolean
};

export function getComponentURI(meta: ComponentMeta): string {
    const location = meta.path ? meta.path : meta.registry;
    return `${location}//${meta.name}:${meta.version}`;
}

export function componentDescriptorParser(cd: ComponentDescriptorV3, path: string): ComponentVersionNode {
    let meta: ComponentMeta = getComponentDescriptorMeta(cd);
    if (path !== "") {
        meta.path = path.replace("component-descriptor.yaml", "");
    }
    return componentDescriptorToTree(meta, cd);
}

export function getComponentDescriptorMeta(desc: ComponentDescriptorV3): ComponentMeta {
    let name: string;
    let version: string;
    let registry: string | undefined;
    let provider: string | undefined;
    name = (<ComponentDescriptorV3>desc).metadata.name;
    version = (<ComponentDescriptorV3>desc).metadata.version;
    provider = (<ComponentDescriptorV3>desc).metadata.provider?.name;
    let repoCtx: OciRepositoryContext[] | undefined = (<ComponentDescriptorV3>desc).repositoryContexts;
    if (repoCtx !== undefined && repoCtx.length > 0) {
        registry = (<OciRepositoryContext[]>(<ComponentDescriptorV3>desc).repositoryContexts)[0].baseUrl;
        if (repoCtx[0].subPath !== undefined) {
            registry = `${registry}/${repoCtx[0].subPath}`;
        }
    }
    return <ComponentMeta>{ name: name, provider: provider, version: version, registry: registry };
}

function componentDescriptorToTree(meta: ComponentMeta, cd: ComponentDescriptorV3): ComponentVersionNode {
    let node = new ComponentVersionNode(cd,meta);
    let res: ResourceTypes[] = cd.spec.resources ? cd.spec.resources : [];
    let src: SourceTypes[] = cd.spec.sources ? cd.spec.sources : [];
    let ref: ReferenceTypes[] = cd.spec.references ? cd.spec.references : [];
    let resources = new TreeNode("resources");
    let sources = new TreeNode("sources");
    let references = new TreeNode("references");
    if (res.length) {
        res.map((x: ResourceTypes) => resources.addChild(new ResourceNode(x, meta)));
        node.addChild(resources);
    }
    if (src.length) {
        src.map((x: SourceTypes) => sources.addChild(new SourceNode(x, meta)));
        node.addChild(sources);
    }
    if (ref.length) {
        ref?.map((x: ReferenceTypes) => references.addChild(new ReferenceNode(x, meta)));
        node.addChild(references);
    }
    return node;
}