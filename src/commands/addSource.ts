import { existsSync, mkdirSync, unlinkSync, writeFileSync } from "fs";
import { workspace } from "vscode";
import YAML from "yaml";
import { SourceDefinition } from "../ocm/ocmv3";
import { output } from "../output";
import { shell } from "../shell";

export interface AddSourceResult {
  success: boolean;
  message: string;
}

export async function addSource(
  source: SourceDefinition,
  componentPath: string
): Promise<AddSourceResult> {
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
  writeFileSync(`${filename}`, YAML.stringify(source));
  const cmd = `ocm add source ${componentPath} ${filename}`;
  const result = await shell.exec(cmd);

  // Remove the temporary file
  unlinkSync(filename);

  if (result.code !== 0) {
    output.send(`Adding source failed: ${result.stderr}`);
    return { success: false, message: result.stderr };
  }

  result.stdout || result.stderr
    ? output.send(`Adding source complete: ${result.stdout || result.stderr}`)
    : output.send(`Adding source complete.`);

  return { success: true, message: result.stdout || result.stderr };
}
