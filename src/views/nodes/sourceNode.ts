import { SourceDefinition } from '../../ocm/ocmv3';
import { OCMNode } from './ocmNode';

export type SourceTypes = SourceDefinition;

export class SourceNode extends OCMNode {
	constructor(label: string, source: SourceDefinition) {
		super(label, source);
	}
}