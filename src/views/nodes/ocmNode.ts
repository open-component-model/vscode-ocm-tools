import { MarkdownString } from 'vscode';
import { ResourceTypes } from './resourceNode';
import { SourceTypes } from './sourceNode';
import { ReferenceTypes } from './referenceNode';
import { TreeNode, TreeNodeIcon } from './treeNode';
import { createMarkdownTable } from '../../utils/markdownUtils';
import { HttpsGardenerCloudSchemasComponentDescriptorOcmV3Alpha1 as ComponentDescriptorV3 } from '../../ocm/ocmv3';

/**
 * Base class for all the OCM tree view items.
 */
export class OCMNode extends TreeNode {	
	resource: ResourceTypes | SourceTypes | ReferenceTypes | ComponentDescriptorV3;

	constructor(label: string, obj: ResourceTypes | SourceTypes | ReferenceTypes | ComponentDescriptorV3) {
		super(label);

		this.resource = obj; 

		// update reconciliation status
		this.updateStatus(obj);
	}


	// @ts-ignore
	get description() {
		return `${this.resource.name} ${this.resource.version}`;
	}

	/**
	 * Update source status with showing error icon when fetch failed.
	 * @param source target source
	 */
	updateStatus(obj: ResourceTypes | SourceTypes | ReferenceTypes | ComponentDescriptorV3): void {
		//this.setIcon(TreeNodeIcon.Success);
	}
}