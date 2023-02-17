import { MarkdownString } from 'vscode';
import { ResourceTypes } from '../views/nodes/resourceNode';
import { SourceTypes } from '../views/nodes/sourceNode';
import { ReferenceTypes } from '../views/nodes/referenceNode';
import { ComponentMeta } from '../views/componentDescriptorToNode';
import { HttpsGardenerCloudSchemasComponentDescriptorOcmV3Alpha1 } from '../ocm/ocmv3';

export type KnownTreeNodeResources = ResourceTypes | SourceTypes | ReferenceTypes | HttpsGardenerCloudSchemasComponentDescriptorOcmV3Alpha1;

/**
 * Create markdown table for tree view item hovers.
 * 2 clumns, left aligned.
 * @param kubernetesObject Standard kubernetes object
 * @returns vscode MarkdownString object
 */
export function createMarkdownTable(meta: ComponentMeta, obj: KnownTreeNodeResources): MarkdownString {
	const markdown = new MarkdownString(undefined, true);
	markdown.isTrusted = true;
	// Create table header
	markdown.appendMarkdown('Property | Value\n');
	markdown.appendMarkdown(':--- | :---\n');

	// Should exist on every object
	createMarkdownTableRow('name', meta.name, markdown);
	createMarkdownTableRow('version', meta.version, markdown);
	if ("type" in obj && obj.type) {
		createMarkdownTableRow('type', obj.type, markdown);
	}

	// Only show the first 10 lines (2 lines - header)
	const markdownAsLines = markdown.value.split('\n');
	if (markdownAsLines.length > 12) {
		markdown.value = markdownAsLines
			.slice(0, 12)
			.join('\n');
	}

	return markdown;
}

/**
 * Create markdown table row (only if the value is not equal `undefined`)
 * @param propertyName First table column value
 * @param propertyValue Second table column value
 * @param markdown object of vscode type MarkdownString
 */
function createMarkdownTableRow(propertyName: string, propertyValue: string | boolean | number | undefined | {}, markdown: MarkdownString) {
	if (propertyValue === undefined) {
		return;
	}
	markdown.appendMarkdown(`${propertyName} | ${propertyValue}\n`);
}

/**
 * Append horizontal rule `<hr>`
 * @param markdown object of vscode type MarkdownString
 */
export function createMarkdownHr(markdown: MarkdownString) {
	markdown.appendMarkdown('\n\n---\n\n');
}

/**
 * Append an error message
 * @param markdown object of vscode type MarkdownString
 */
export function createMarkdownError(prefix: string, error = '', markdown: MarkdownString) {
	markdown.appendMarkdown(`<span style="color:#f14c4c;">$(error)</span> ${prefix}: ${error}\n\n`);
}