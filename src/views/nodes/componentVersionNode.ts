import { MarkdownString, ThemeColor, ThemeIcon } from 'vscode';
import { HttpsGardenerCloudSchemasComponentDescriptorV2 as ComponentDescriptorV2 } from '../../ocm/ocmv2';
import { HttpsGardenerCloudSchemasComponentDescriptorOcmV3Alpha1 as ComponentDescriptorV3 } from '../../ocm/ocmv3';
import { TreeNode, TreeNodeIcon } from './treeNode';
import { createMarkdownTable } from '../../utils/markdownUtils';

/**
 * Base class for all the OCM tree view items.
 */
export class ComponentVersionNode extends TreeNode {
	name: string;

	version: string;
	
	path: string;

	constructor(name: string, version: string, path: string) {
		super(version);

		this.name = name;

		this.version = version;

		this.path = path;

		this.iconPath = new ThemeIcon("unverified", new ThemeColor('editorWarning.foreground'));
	}

	// @ts-ignore
	get tooltip() {
		return this.version;
	}

	// @ts-ignore
	get description() {
		return "";
	}

	get contexts() {
		return ["ComponentVersion"];
	}
}