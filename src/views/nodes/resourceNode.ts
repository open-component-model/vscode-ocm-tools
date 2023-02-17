import { MarkdownString, ThemeIcon } from 'vscode';
import { CommandIDs } from '../../commands';
import { ResourceType, OciImageResource, GenericResource } from '../../ocm/ocmv3';
import { createMarkdownTable, KnownTreeNodeResources } from '../../utils/markdownUtils';
import { ComponentMeta } from '../componentDescriptorToNode';
import { OCMNode } from './ocmNode';

export type ResourceTypes = ResourceType | OciImageResource | GenericResource;

export class ResourceNode extends OCMNode {
	kind: string = "Resource";

	meta: ComponentMeta;

	constructor(resource: ResourceType | OciImageResource | GenericResource, meta: ComponentMeta) {
		super(resource.name, resource);
		this.meta = meta;
		let icon: ThemeIcon | string;
		switch (resource.type) {
			case "File":
				icon = new ThemeIcon("file");
				break;
			case "Directory":
				icon = new ThemeIcon("folder");
				break;
			case "helmChart":
				icon = "helm";
				break;
			case "ociImage":
				icon = "docker";
				break;
			default:
				icon = new ThemeIcon("file");
		}
		this.setIcon(icon);
	}

	get contexts() {
		return [this.kind];
	}

	// @ts-ignore
	get tooltip() {
		return this.getMarkdownHover(this.meta, this.resource);
	}

	getMarkdownHover(meta: ComponentMeta, obj: KnownTreeNodeResources): MarkdownString {
		return createMarkdownTable(meta, obj);
	}

	// @ts-ignore
	get command(): Command | undefined {
		return {
			command: CommandIDs.resourceOpen,
			arguments: [this.meta, this.resource, this.kind],
			title: 'View Resource',
		};
	}
}