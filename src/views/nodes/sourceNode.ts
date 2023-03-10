import { SourceDefinition } from '../../ocm/ocmv3';
import { OCMNode } from './ocmNode';
import { ComponentMeta } from '../componentDescriptorToNode';
import { CommandIDs } from '../../commands';

export type SourceTypes = SourceDefinition;

export class SourceNode extends OCMNode {
	kind: string = "Source";

	meta: ComponentMeta;

	constructor(source: SourceDefinition, meta: ComponentMeta) {
		super(source.name, source);
		this.meta = meta;
	}

	// @ts-ignore
	get command(): Command | undefined {
		return {
			command: CommandIDs.sourceOpen,
			arguments: [this.meta, this.resource, this.kind],
			title: 'View Source Definition',
		};
	}
}