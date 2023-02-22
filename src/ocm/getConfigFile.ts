import { readFileSync } from "fs";
import { workspace } from "vscode";
import { resolveTilde } from "../utils/pathUtils";
import YAML from "yaml";

export function getConfigFile(): any {
    const configPath: string | undefined = workspace.getConfiguration("openComponentModel").get("configurationFile");
	if (!configPath) { return; }
	const configData = readFileSync(resolveTilde(configPath));
	return YAML.parse(configData.toString());
}