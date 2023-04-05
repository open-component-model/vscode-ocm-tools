import { workspace } from "vscode";
import { output } from "../output";
import { shell, ShellResult } from "../shell";
import { Reference } from "../webviews/createComponent";

export interface AddReferenceResult {
  success: boolean;
  message: string;
}

export async function addReference(reference: Reference): Promise<AddReferenceResult> {
  if (!workspace.workspaceFolders) {
    return { success: false, message: "No workspace folder found." };
  }

  const workspacePath = workspace.workspaceFolders[0].uri.toString().replace("file://", "");
  const componentPath = `${workspacePath}/component-archive`;

  const cmd = `ocm add reference ${componentPath} --name ${reference.name} --component ${reference.componentName} --version ${reference.componentVersion}`;

  output.send(`Adding reference ${reference.name} to component-archive...`);
  const result: ShellResult = await shell.exec(cmd);

  if (result.code !== 0) {
    output.send(`Adding reference failed: ${result.stderr}`);
    return { success: false, message: result.stderr };
  }

  result.stdout || result.stderr
    ? output.send(`Adding reference complete: ${result.stdout || result.stderr}`)
    : output.send(`Adding reference complete.`);

  return { success: true, message: result.stdout || result.stderr };
}
