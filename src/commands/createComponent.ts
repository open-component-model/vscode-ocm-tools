import { existsSync, rmSync } from "fs";
import { window, workspace } from "vscode";
import { getExtensionContext } from "../extensionContext";
import { output } from "../output";
import { shell } from "../shell";
import { workspaceTreeViewProvider } from "../views/treeViews";
import { CreateComponent, CreateComponentPanel } from "../webviews/createComponent";
import { addReference, AddReferenceResult } from "./addReference";
import { addResource, AddResourceResult } from "./addResources";
import { addSource, AddSourceResult } from "./addSource";

export async function createComponentView() {
  CreateComponentPanel.createOrShow(getExtensionContext());
}

export interface CreateComponentResult {
  success: boolean;
  message: string;
}

export async function createComponent(component: CreateComponent): Promise<CreateComponentResult> {
  if (!workspace.workspaceFolders) {
    return { success: false, message: "No workspace folder found." };
  }

  const targetPath = workspace.workspaceFolders[0].uri.toString().replace("file://", "");
  const outFile = `${targetPath}/component-archive`;

  if (existsSync(outFile)) {
    const answer = await window.showWarningMessage(
      "compent-archive already exists. Overwrite?",
      "Yes",
      "No"
    );

    if (answer !== "Yes") {
      output.send(`Component creation cancelled, ${outFile} already exists.`);
      return {
        success: false,
        message: `Component creation cancelled. ${outFile} already exists.`,
      };
    }

    rmSync(outFile, { recursive: true, force: true });
  }

  const cmd = `ocm create componentarchive ${component.componentName} ${component.version} --provider ${component.provider} --scheme ${component.scheme} -F ${outFile}`;
  output.send(
    `Creating component ${component.componentName}:${component.version} to ${outFile}...`
  );

  const result = await shell.exec(cmd);

  if (result.code !== 0) {
    output.send(`Component creation failed: ${result.stderr}`);
    return { success: false, message: "Create component failed: " + result.stderr };
  }

  if (component.resources && component.resources.length > 0) {
    for (const resource of component.resources) {
      const res: AddResourceResult = await addResource(resource);
      if (!res.success) {
        // return early if a resource could not be added.
        workspaceTreeViewProvider.refresh();
        return {
          success: false,
          message: `Component creation failed adding resource: ${res.message}`,
        };
      }
    }
  }

  if (component.references && component.references.length > 0) {
    for (const reference of component.references) {
      const res: AddReferenceResult = await addReference(reference);
      if (!res.success) {
        // return early if a reference could not be added.
        workspaceTreeViewProvider.refresh();
        return {
          success: false,
          message: `Component creation failed adding reference: ${res.message}`,
        };
      }
    }
  }

  if (component.sources && component.sources.length > 0) {
    for (const source of component.sources) {
      const res: AddSourceResult = await addSource(source);
      if (!res.success) {
        // return early if a source could not be added.
        workspaceTreeViewProvider.refresh();
        return {
          success: false,
          message: `Component creation failed adding source: ${res.message}`,
        };
      }
    }
  }

  workspaceTreeViewProvider.refresh();

  const message =
    result.stdout || result.stderr
      ? `Component creation complete: ${result.stdout || result.stderr}`
      : `Component creation complete!`;
  output.send(message);
  return { success: true, message: message };
}
