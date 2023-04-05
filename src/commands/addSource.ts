import { workspace } from "vscode";
import { output } from "../output";
import { shell, ShellResult } from "../shell";
import { GitHubSource } from "../webviews/createComponent";

export interface AddSourceResult {
  success: boolean;
  message: string;
}

export async function addSource(source: GitHubSource): Promise<AddSourceResult> {
  if (!workspace.workspaceFolders) {
    return { success: false, message: "No workspace folder found." };
  }

  const workspacePath = workspace.workspaceFolders[0].uri.toString().replace("file://", "");
  const componentPath = `${workspacePath}/component-archive`;

  let result: ShellResult;
  switch (source.accessType) {
    case "gitHub": {
      const cmd = `ocm add source ${componentPath} --type git --name ${source.name} --version ${source.version} --accessType ${source.accessType} --accessRepository ${source.repoUrl} --commit ${source.commit}`;

      output.send(`Adding source ${source.name} to component-archive...`);
      result = await shell.exec(cmd);
    }
  }

  if (result.code !== 0) {
    output.send(`Adding source failed: ${result.stderr}`);
    return { success: false, message: result.stderr };
  }

  result.stdout || result.stderr
    ? output.send(`Adding source complete: ${result.stdout || result.stderr}`)
    : output.send(`Adding source complete.`);

  return { success: true, message: result.stdout || result.stderr };
}
