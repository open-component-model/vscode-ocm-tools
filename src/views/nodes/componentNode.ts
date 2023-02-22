import { ThemeColor, ThemeIcon } from 'vscode';
import { ComponentMeta, getComponentDescriptorMeta } from '../componentDescriptorToNode';
import { TreeNode, TreeNodeIcon } from './treeNode';

/**
 * Base class for all the OCM tree view items.
 */
export class ComponentNode extends TreeNode {
	meta: ComponentMeta;

	constructor(name: string, provider: string, registry?: string) {
		super(name);

		this.meta = <ComponentMeta>{
			name: name,
			provider: provider,
		};

		if (registry) {
			this.meta.registry = registry;
		}

		this.iconPath = new ThemeIcon("symbol-method", new ThemeColor('terminal.ansiGreen'));
	}

	// @ts-ignore
	get tooltip() {
		return this.meta.name;
	}

	// @ts-ignore
	get description() {
		return `${this.meta.provider}`;
	}

	get contexts() {
		return ["Component"];
	}
}