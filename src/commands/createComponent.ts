import { shell } from "../shell";
import { output } from "../output";
import { getExtensionContext } from "../extensionContext";
import { CreateComponentPanel } from "../webviews/createComponent";
import { workspace } from "vscode";

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
  const outFile = `${targetPath}/${name}`;

  const cmd = `ocm create componentarchive ${name} ${version} --provider ${provider} --scheme ${scheme} -o ${outFile}`;
  output.send(`Creating component ${name}:${version} to ${outFile}...`);

  const result = await shell.exec(cmd);
  output.send(`Component creation complete: ${result.stdout}`);
}
