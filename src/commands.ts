import { commands } from "vscode";
import { addRemoteComponent } from "./commands/addRemoteComponent";
import { createSigningKeys, createSigningKeysView } from "./commands/createSigningKeys";
import { deleteSigningKeys } from "./commands/deleteSigningKeys";
import { downloadComponent } from "./commands/downloadComponent";
import { downloadResource } from "./commands/downloadResource";
import { openDocument } from "./commands/openDocuments";
import { removeRemoteComponent } from "./commands/removeRemoteComponent";
import { refreshRemoteTreeView, refreshWorkspaceTreeView } from "./views/treeViews";
import { signComponent } from "./commands/signComponent";
import { verifyComponent } from "./commands/verifyComponent";

export enum CommandIDs {
	componentVersionOpen = "ocm.component-version.open",
	componentVersionDownload = "ocm.component-version.download",
	componentVersionSign = "ocm.component-version.sign",
	componentVersionVerify = "ocm.component-version.verify",
	resourceOpen = "ocm.resource.open",
	resourceDownload = "ocm.resource.download",
	sourceOpen = "ocm.source.open",
	referenceOpen = "ocm.reference.open",
	remoteComponentAdd = "ocm.remote.add",
	remoteComponentRemove = "ocm.remote.remove",
	remoteTreeViewRefresh = "ocm.remote.refresh",
	workspaceTreeViewRefresh = "ocm.workspace.refresh",
	sigingKeysCreate = "ocm.keys.create",
	signingsKeysCreateView = "ocm.keys.createView",
	signingKeysDelete = "ocm.keys.delete",
}

export function registerCommands() {
	commands.registerCommand(CommandIDs.componentVersionOpen, openDocument);
	commands.registerCommand(CommandIDs.componentVersionDownload, downloadComponent);
	commands.registerCommand(CommandIDs.componentVersionSign, signComponent);
	commands.registerCommand(CommandIDs.componentVersionVerify, verifyComponent);

	commands.registerCommand(CommandIDs.resourceOpen, openDocument);
	commands.registerCommand(CommandIDs.resourceDownload, downloadResource);
	commands.registerCommand(CommandIDs.sourceOpen, openDocument);
	commands.registerCommand(CommandIDs.referenceOpen, openDocument);
	commands.registerCommand(CommandIDs.remoteComponentAdd, addRemoteComponent);
	commands.registerCommand(CommandIDs.remoteComponentRemove, removeRemoteComponent);

	commands.registerCommand(CommandIDs.remoteTreeViewRefresh, refreshRemoteTreeView);
	commands.registerCommand(CommandIDs.workspaceTreeViewRefresh, refreshWorkspaceTreeView);
	commands.registerCommand(CommandIDs.sigingKeysCreate, createSigningKeys);
	commands.registerCommand(CommandIDs.signingsKeysCreateView, createSigningKeysView);
	commands.registerCommand(CommandIDs.signingKeysDelete, deleteSigningKeys);
}
