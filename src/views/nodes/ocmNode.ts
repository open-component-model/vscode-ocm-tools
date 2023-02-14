import { MarkdownString } from 'vscode';
import { ResourceTypes } from './resourceNode';
import { SourceTypes } from './sourceNode';
import { ReferenceTypes } from './referenceNode';
import { TreeNode, TreeNodeIcon } from './treeNode';
import { createMarkdownTable } from '../../utils/markdownUtils';

/**
 * Base class for all the OCM tree view items.
 */
export class OCMNode extends TreeNode {

	resource: ResourceTypes | SourceTypes | ReferenceTypes;

	constructor(label: string, obj: ResourceTypes | SourceTypes | ReferenceTypes) {
		super(label);

		this.resource = obj; 

		// update reconciliation status
		this.updateStatus(obj);
	}

	// @ts-ignore
	get tooltip() {
		return this.getMarkdownHover(this.resource);
	}

	// @ts-ignore
	get description() {
		return `${this.resource.name} ${this.resource.version}`;
	}

	/**
	 * Creates markdwon string for Source tree view item tooltip.
	 * @param source GitRepository, HelmRepository or Bucket kubernetes object.
	 * @returns Markdown string to use for Source tree view item tooltip.
	 */
	getMarkdownHover(obj: ResourceTypes | SourceTypes | ReferenceTypes): MarkdownString {
		return createMarkdownTable(obj);
	}

	/**
	 * Update source status with showing error icon when fetch failed.
	 * @param source target source
	 */
	updateStatus(obj: ResourceTypes | SourceTypes | ReferenceTypes): void {
		//this.setIcon(TreeNodeIcon.Success);
	}
}