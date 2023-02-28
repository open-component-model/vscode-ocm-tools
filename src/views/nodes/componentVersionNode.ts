import { HttpsGardenerCloudSchemasComponentDescriptorOcmV3Alpha1 as ComponentDescriptorV3 } from '../../ocm/ocmv3';
import { ComponentMeta } from '../componentDescriptorToNode';
import { OCMNode } from './ocmNode';
import { CommandIDs } from '../../commands';

/**
 * Base class for all the OCM tree view items.
 */
export class ComponentVersionNode extends OCMNode {
	kind: string = "ComponentVersion";

	meta: ComponentMeta;

	constructor(resource: ComponentDescriptorV3, meta: ComponentMeta) {
		super(meta.version, resource);

		this.meta = meta;
	}

	// @ts-ignore
	get tooltip() {
		return this.meta.version;
	}

	// @ts-ignore
	get description() {
		return "";
	}

	get contexts() {
		return ["ComponentVersion"];
	}

	// @ts-ignore
	get command(): Command | undefined {
		return {
			command: CommandIDs.componentVersionOpen,
			arguments: [this.meta, this.resource, this.kind],
			title: 'View Component Descriptor',
		};
	}

	isSigned(value: boolean) {
		this.meta.signed = value;
	}
}