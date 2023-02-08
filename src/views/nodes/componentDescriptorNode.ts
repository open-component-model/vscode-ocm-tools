import { MarkdownString } from 'vscode';
import { HttpsGardenerCloudSchemasComponentDescriptorV2 as ComponentDescriptorV2 } from '../../ocm/ocmv2';
import { HttpsGardenerCloudSchemasComponentDescriptorOcmV3Alpha1 as ComponentDescriptorV3 } from '../../ocm/ocmv3';
import { TreeNode, TreeNodeIcon } from './treeNode';
import { createMarkdownTable } from '../../utils/markdownUtils';

/**
 * Base class for all the OCM tree view items.
 */
export class ComponentDescriptorNode extends TreeNode {
	name: string;

	version: string;
	
	path: string;

	constructor(name: string, version: string, path: string) {
		super(name);

		this.name = name;

		this.version = version;

		this.path = path;
	}

	// @ts-ignore
	get tooltip() {
		return this.name;
	}

	// @ts-ignore
	get description() {
		return `${this.name} ${this.version}`;
	}
}