import { ThemeColor, ThemeIcon } from 'vscode';
import { TreeNode, TreeNodeIcon } from './treeNode';

/**
 * Base class for all the OCM tree view items.
 */
export class ComponentNode extends TreeNode {
	name: string;

	provider: string;

	registry?: string;
	
	constructor(name: string, provider: string, registry?: string) {
		super(name);

		this.name = name;

		this.provider = provider;

		if (registry) {
			this.registry = registry;
		}

		this.iconPath = new ThemeIcon("symbol-method", new ThemeColor('terminal.ansiGreen'));
	}

	// @ts-ignore
	get tooltip() {
		return this.name;
	}

	// @ts-ignore
	get description() {
		return `${this.provider}`;
	}

	get contexts() {
		return ["Component"];
	}
}