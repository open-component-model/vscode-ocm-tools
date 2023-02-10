import { TreeNode, TreeNodeIcon } from './treeNode';

/**
 * Base class for all the OCM tree view items.
 */
export class ComponentNode extends TreeNode {
	name: string;

	provider: string;
	
	constructor(name: string, provider: string) {
		super(name);

		this.name = name;

		this.provider = provider;
	}

	// @ts-ignore
	get tooltip() {
		return this.name;
	}

	// @ts-ignore
	get description() {
		return `${this.provider}`;
	}
}