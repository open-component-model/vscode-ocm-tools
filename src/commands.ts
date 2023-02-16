import { commands } from "vscode";
import { addRemoteComponent } from "./commands/addRemoteComponent";
import { openDocument } from "./commands/openDocuments";
import { removeRemoteComponent } from "./commands/removeRemoteComponent";

export function registerCommands() {
	commands.registerCommand("ocm.component-version.open", openDocument);
	commands.registerCommand("ocm.resource.open", openDocument);
	commands.registerCommand("ocm.source.open", openDocument);
	commands.registerCommand("ocm.reference.open", openDocument);
	commands.registerCommand("ocm.remote.add", addRemoteComponent);
	commands.registerCommand("ocm.remote.remove", removeRemoteComponent);
}