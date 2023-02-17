import { window, Uri, workspace } from 'vscode';
import { HttpsGardenerCloudSchemasComponentDescriptorOcmV3Alpha1 as ComponentDescriptorV3, Reference, ResourceType, SourceDefinition } from '../ocm/ocmv3';
import { ComponentMeta } from '../views/componentDescriptorToNode';

export async function openDocument(meta: ComponentMeta, elem: ResourceType | SourceDefinition | Reference | ComponentDescriptorV3, type: string): Promise<void> {
	let source: string = meta.registry ? meta.registry : meta.path;
	let uri: string;
	if (type === "ComponentVersion") {
		uri = `ocm:${source}//${meta.name}/${meta.version}.yaml?type=${type}`;
	} else {
		uri = `ocm:${source}//${meta.name}/${elem.name}.yaml?type=${type}`;
	}
	const doc = await workspace.openTextDocument(Uri.parse(uri));
	await window.showTextDocument(doc, { preview: false });
};