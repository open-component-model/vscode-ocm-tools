import { DirectoryResource, FileResource, OciImageResource } from "../webviews/createComponent";
import { output } from "../output";
import { shell, ShellResult } from "../shell";
import { workspace } from "vscode";

export interface AddResourceResult {
  success: boolean;
  message: string;
}

export async function addResource(
  resource: FileResource | DirectoryResource | OciImageResource
): Promise<AddResourceResult> {
  if (!workspace.workspaceFolders) {
    return { success: false, message: "No workspace folder found." };
  }

  const workspacePath = workspace.workspaceFolders[0].uri.toString().replace("file://", "");
  const componentPath = `${workspacePath}/component-archive`;

  let result: ShellResult;
  switch (resource.inputType) {
    case "file": {
      const uri = resource.path;

      let cmd = `ocm add resource ${componentPath} --type ${resource.type} --name ${resource.name} --inputType ${resource.inputType} --inputPath ${uri} --mediaType ${resource.mediaType}`;
      if (resource.compress) {
        cmd += ` --inputCompress`;
      }
      output.send(`Adding resource ${resource.name} to component-archive...`);
      result = await shell.exec(cmd);
      break;
    }
    case "directory": {
      const uri = resource.path;

      let cmd = `ocm add resource ${componentPath} --type ${resource.type} --name ${resource.name} --inputType dir --inputPath ${uri}`;
      if (resource.compress) {
        cmd += ` --inputCompress`;
      }
      output.send(`Adding resource ${resource.name} to component-archive...`);
      result = await shell.exec(cmd);
      break;
    }
    case "ociImage": {
      const cmd = `ocm add resource ${componentPath} --type ociImage --name ${resource.name} --version ${resource.version} --accessType ociArtifact --reference ${resource.imageReference}`;

      output.send(`Adding resource ${resource.name} to component-archive...`);
      result = await shell.exec(cmd);
      break;
    }
  }

  if (result.code !== 0) {
    output.send(`Adding resource failed: ${result.stderr}`);
    return { success: false, message: result.stderr };
  }

  result.stdout || result.stderr
    ? output.send(`Adding resource complete: ${result.stdout || result.stderr}`)
    : output.send(`Adding resource complete!`);

  return { success: true, message: result.stdout || result.stderr };
}
