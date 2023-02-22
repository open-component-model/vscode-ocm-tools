import { commands } from "vscode";
import { addRemoteComponent } from "./commands/addRemoteComponent";
import { downloadComponent } from "./commands/downloadComponent";
import { downloadResource } from "./commands/downloadResource";
import { openDocument } from "./commands/openDocuments";
import { removeRemoteComponent } from "./commands/removeRemoteComponent";
import { refreshRemoteTreeView, refreshWorkspaceTreeView } from "./views/treeViews";

export enum CommandIDs {
	componentVersionOpen = "ocm.component-version.open",
	componentVersionDownload = "ocm.component-version.download",
	resourceOpen = "ocm.resource.open",
	resourceDownload = "ocm.resource.download",
	sourceOpen = "ocm.source.open",
	referenceOpen = "ocm.reference.open",
	remoteComponentAdd = "ocm.remote.add",
	remoteComponentRemove = "ocm.remote.remove",
	remoteTreeViewRefresh = "ocm.remote.refresh",
	workspaceTreeViewRefresh = "ocm.workspace.refresh"
}

export function registerCommands() {
	commands.registerCommand(CommandIDs.componentVersionOpen, openDocument);
	commands.registerCommand(CommandIDs.componentVersionDownload, downloadComponent);
	commands.registerCommand(CommandIDs.resourceOpen, openDocument);
	commands.registerCommand(CommandIDs.resourceDownload, downloadResource);
	commands.registerCommand(CommandIDs.sourceOpen, openDocument);
	commands.registerCommand(CommandIDs.referenceOpen, openDocument);
	commands.registerCommand(CommandIDs.remoteComponentAdd, addRemoteComponent);
	commands.registerCommand(CommandIDs.remoteComponentRemove, removeRemoteComponent);

	commands.registerCommand(CommandIDs.remoteTreeViewRefresh, refreshRemoteTreeView);
	commands.registerCommand(CommandIDs.workspaceTreeViewRefresh, refreshWorkspaceTreeView);
}