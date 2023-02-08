import { Reference} from '../../ocm/ocmv3';
import { OCMNode } from './ocmNode';

export type ReferenceTypes = Reference;

export class ReferenceNode extends OCMNode {
	constructor(label: string, reference: Reference) {
		super(label,reference);
	}
}