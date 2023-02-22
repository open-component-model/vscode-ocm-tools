import { ThemeColor, ThemeIcon } from 'vscode';
import { TreeNode } from './treeNode';

/**
 * Base class for all the OCM tree view items.
 */
export class KeyNode extends TreeNode {
	name: string;
	path: string;
	
	constructor(name: string, path: string) {
		super(name);

		this.name = name;

		this.path = path;

		this.iconPath = new ThemeIcon("key", new ThemeColor('terminal.ansiGreen'));
	}

	// @ts-ignore
	get tooltip() {
		return this.name;
	}

	// @ts-ignore
	get description() {
		return `${this.path}`;
	}

	get contexts() {
		return ["Key"];
	}
}