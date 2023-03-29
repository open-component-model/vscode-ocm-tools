import { shell } from "../shell";
import { output } from "../output";
import { getExtensionContext } from "../extensionContext";
import { CreateComponentPanel } from "../webviews/createComponent";
import { workspaceTreeViewProvider } from "../views/treeViews";
import { window, workspace } from "vscode";
import { existsSync, rmSync } from "fs";

export async function createComponentView() {
  CreateComponentPanel.createOrShow(getExtensionContext());
}

export async function createComponent(
  name: string,
  version: string,
  provider: string,
  scheme: string
) {
  if (!workspace.workspaceFolders) {
    return;
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
      return;
    }

    rmSync(outFile, { recursive: true, force: true });
  }

  const cmd = `ocm create componentarchive ${name} ${version} --provider ${provider} --scheme ${scheme} -F ${outFile}`;
  output.send(`Creating component ${name}:${version} to ${outFile}...`);

  const result = await shell.exec(cmd);
  result.code !== 0
    ? output.send(`Component creation failed: ${result.stderr}`)
    : result.stdout || result.stderr
    ? output.send(`Component creation complete: ${result.stdout || result.stderr}`)
    : output.send(`Component creation complete!`);

  workspaceTreeViewProvider.refresh();
}
