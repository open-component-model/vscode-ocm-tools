import { existsSync, mkdirSync, unlinkSync, writeFileSync } from "fs";
import { workspace } from "vscode";
import YAML from "yaml";
import { Reference } from "../ocm/ocmv3";
import { output } from "../output";
import { shell } from "../shell";

export interface AddReferenceResult {
  success: boolean;
  message: string;
}

export async function addReference(
  reference: Reference,
  componentPath: string
): Promise<AddReferenceResult> {
  if (!workspace.workspaceFolders) {
    return { success: false, message: "No workspace folder found." };
  }

  const workspacePath = workspace.workspaceFolders[0].uri.toString().replace("file://", "");
  const tempPath = `${workspacePath}/.ocm`;

  if (!existsSync(tempPath)) {
    mkdirSync(tempPath);
  }

  output.send(`Adding reference ${reference.name} to component-archive...`);

  const random = Math.random().toString(36).substring(7);
  const filename = `${tempPath}/resource-${random}.yaml`;
  writeFileSync(`${filename}`, YAML.stringify(reference));
  const cmd = `ocm add reference ${componentPath} ${filename}`;
  const result = await shell.exec(cmd);

  // Remove the temporary file
  unlinkSync(filename);

  if (result.code !== 0) {
    output.send(`Adding reference failed: ${result.stderr}`);
    return { success: false, message: result.stderr };
  }

  result.stdout || result.stderr
    ? output.send(`Adding reference complete: ${result.stdout || result.stderr}`)
    : output.send(`Adding reference complete.`);

  return { success: true, message: result.stdout || result.stderr };
}
