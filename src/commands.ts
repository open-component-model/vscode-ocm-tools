import { commands } from "vscode";
import { addRemoteComponent } from "./commands/addRemoteComponent";
import { downloadResource } from "./commands/downloadResource";
import { openDocument } from "./commands/openDocuments";
import { removeRemoteComponent } from "./commands/removeRemoteComponent";

export enum CommandIDs {
	componentVersionOpen = "ocm.component-version.open",
	resourceOpen = "ocm.resource.open",
	resourceDownload = "ocm.resource.download",
	sourceOpen = "ocm.source.open",
	referenceOpen = "ocm.reference.open",
	remoteComponentAdd = "ocm.remote.add",
	remoteComponentRemove = "ocm.remote.remove",
}

export function registerCommands() {
	commands.registerCommand(CommandIDs.componentVersionOpen, openDocument);
	commands.registerCommand(CommandIDs.resourceOpen, openDocument);
	commands.registerCommand(CommandIDs.resourceDownload, downloadResource);
	commands.registerCommand(CommandIDs.sourceOpen, openDocument);
	commands.registerCommand(CommandIDs.referenceOpen, openDocument);
	commands.registerCommand(CommandIDs.remoteComponentAdd, addRemoteComponent);
	commands.registerCommand(CommandIDs.remoteComponentRemove, removeRemoteComponent);
}