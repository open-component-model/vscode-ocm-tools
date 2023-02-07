import { ResourceType, OciImageResource, GenericResource } from '../../ocm/ocmv3';
import { OCMNode } from './ocmNode';

export type ResourceTypes = ResourceType | OciImageResource | GenericResource;

export class ResourceNode extends OCMNode {
	constructor(label: string, resource: ResourceType | OciImageResource | GenericResource) {
		super(label,resource);
	}
}