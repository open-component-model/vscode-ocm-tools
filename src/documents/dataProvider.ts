import { EventEmitter, ExtensionContext, TextDocumentContentProvider, Uri, workspace } from 'vscode';
import { getComponentDescriptor } from '../commands/getComponentDescriptor';
import { getItemYAML } from '../commands/getItemYaml';

// eslint-disable-next-line @typescript-eslint/naming-convention
export const OCMScheme = 'ocm';

class OCMProvider implements TextDocumentContentProvider {
    onDidChangeEmitter = new EventEmitter<Uri>();
    onDidChange = this.onDidChangeEmitter.event;
    async provideTextDocumentContent(uri: Uri): Promise<string> {
        let resource: string | undefined = uri.path.split('/').pop();
        if (resource === undefined) {
            return new Promise((resolve, reject) => resolve(""));
        }
        let component = uri.path.replace(resource, "");
        switch (uri.query) {
            case "type=Resource": {
                return await getItemYAML("resource", component.replace(/\/$/, ""), resource.replace(".yaml", ""));
            }
            case "type=Source": {
                return await getItemYAML("source", component.replace(/\/$/, ""), resource.replace(".yaml", ""));
            }
            case "type=Reference": {
                return await getItemYAML("reference", component.replace(/\/$/, ""), resource.replace(".yaml", ""));
            }
            case "type=ComponentVersion": {
                return await getComponentDescriptor(component.replace(/\/$/, ""), resource.replace(".yaml", ""));
            }
            default: {
                return new Promise((resolve, reject) => resolve(""));
            }
        }
    }
};

export function createDocumentProvider(context: ExtensionContext): void {
    context.subscriptions.push(workspace.registerTextDocumentContentProvider(OCMScheme, new OCMProvider()));
}