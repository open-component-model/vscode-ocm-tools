import { ResourceNode, ResourceTypes } from './nodes/resourceNode';
import { SourceNode, SourceTypes } from './nodes/sourceNode';
import { ReferenceNode, ReferenceTypes } from './nodes/referenceNode';
import { ComponentVersionNode } from './nodes/componentVersionNode';
import { TreeNode } from './nodes/treeNode';
import { HttpsGardenerCloudSchemasComponentDescriptorV2 as ComponentDescriptorV2, Component as ComponentSpecV2 } from '../ocm/ocmv2';
import { HttpsGardenerCloudSchemasComponentDescriptorOcmV3Alpha1 as ComponentDescriptorV3, OciRepositoryContext } from '../ocm/ocmv3';

export type ComponentMeta = {
    name: string
    provider: string
    version: string
    registry: string
};

export function componentDescriptorParser(desc: ComponentDescriptorV2 | ComponentDescriptorV3, path: string): ComponentVersionNode {
    if (desc.apiVersion) {
        let cd: ComponentDescriptorV3 = <ComponentDescriptorV3>desc;
        return componentDescriptorToTree(cd.metadata.name, cd.metadata.version, path, cd.spec.resources, cd.spec.sources, cd.spec.references);
    }
    let cd: ComponentSpecV2 = (<ComponentDescriptorV2>desc).component;
    return componentDescriptorToTree(cd.name, cd.version, path, cd.resources, cd.sources, cd.componentReferences);
}

export function getComponentDescriptorMeta(desc: ComponentDescriptorV2 | ComponentDescriptorV3): ComponentMeta {
    let name: string;
    let version: string;
    let registry: string | undefined;
    let provider: string | undefined;
    if (desc.apiVersion) {
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
    } else {
        name = (<ComponentDescriptorV2>desc).component.name;
        version = (<ComponentDescriptorV2>desc).component.version;
        provider = (<ComponentDescriptorV2>desc).component.provider;
        let repoCtx: OciRepositoryContext[] | undefined = (<ComponentDescriptorV2>desc).component.repositoryContexts
        if (repoCtx !== undefined && repoCtx.length > 0) {
            registry = (<ComponentDescriptorV2>desc).component.repositoryContexts[0].baseUrl;
            if (repoCtx[0].subPath !== undefined) {
                registry = `${registry}/${repoCtx[0].subPath}`;
            }
        }
    }
    return <ComponentMeta>{ name: name, provider: provider, version: version, registry: registry };
}

function componentDescriptorToTree(
    name: string,
    version: string,
    path: string,
    res?: ResourceTypes[], src?: SourceTypes[], ref?: ReferenceTypes[]): ComponentVersionNode {
    let node = new ComponentVersionNode(name, version, path);

    let resources = new TreeNode("resources");
    let sources = new TreeNode("sources");
    let references = new TreeNode("references");

    if (res && res.length) {
        res.map((x: ResourceTypes) => resources.addChild(new ResourceNode(x.name, x)));
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