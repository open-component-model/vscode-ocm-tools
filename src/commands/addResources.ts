import { existsSync, mkdirSync, unlinkSync, writeFileSync } from "fs";
import { workspace } from "vscode";
import YAML from "yaml";
import { OciArtifactResource, Resource } from "../ocm/types";
import { output } from "../output";
import { shell } from "../shell";

export interface AddResourceResult {
  success: boolean;
  message: string;
}

export async function addResource(
  resource: Resource | OciArtifactResource,
  componentPath: string
): Promise<AddResourceResult> {
  if (!workspace.workspaceFolders) {
    return { success: false, message: "No workspace folder found." };
  }

  const workspacePath = workspace.workspaceFolders[0].uri.toString().replace("file://", "");
  const tempPath = `${workspacePath}/.ocm`;

  if (!existsSync(tempPath)) {
    mkdirSync(tempPath);
  }

  const random = Math.random().toString(36).substring(7);
  const filename = `${tempPath}/resource-${random}.yaml`;
  writeFileSync(`${filename}`, YAML.stringify(resource));
  const cmd = `ocm add resource ${componentPath} ${filename}`;
  const result = await shell.exec(cmd);

  // Remove the temporary file
  unlinkSync(filename);

  if (result.code !== 0) {
    output.send(`Adding resource failed: ${result.stderr}`);
    return { success: false, message: result.stderr };
  }

  result.stdout || result.stderr
    ? output.send(`Adding resource complete: ${result.stdout || result.stderr}`)
    : output.send(`Adding resource complete!`);

  return { success: true, message: result.stdout || result.stderr };
}
