import { writeFileSync } from "fs";
import { workspace } from "vscode";
import { resolveTilde } from "../utils/pathUtils";
import YAML from "yaml";

export function writeConfigFile(data: any): void {
    const configPath: string | undefined = workspace.getConfiguration("openComponentModel").get("configurationFile");
	if (!configPath) { return; }
	writeFileSync(resolveTilde(configPath), YAML.stringify(data));
}