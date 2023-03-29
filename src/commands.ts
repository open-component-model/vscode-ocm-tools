import { commands } from "vscode";
import { addRemoteComponent } from "./commands/addRemoteComponent";
import { createComponent, createComponentView } from "./commands/createComponent";
import { createSigningKeys, createSigningKeysView } from "./commands/createSigningKeys";
import { deleteSigningKeys } from "./commands/deleteSigningKeys";
import { downloadComponent } from "./commands/downloadComponent";
import { downloadResource } from "./commands/downloadResource";
import { openDocument } from "./commands/openDocuments";
import { removeRemoteComponent } from "./commands/removeRemoteComponent";
import { refreshRemoteTreeView, refreshWorkspaceTreeView } from "./views/treeViews";
import { signComponent } from "./commands/signComponent";
import { transferComponent } from "./commands/transferComponent";
import { verifyComponent } from "./commands/verifyComponent";
import { transferComponentByValue } from "./commands/transferComponentByValue";
import { showNewUserGuide } from "./commands/showNewUserGuide";

export enum CommandIDs {
  componenetVersionCreate = "ocm.component-version.create",
  componenetVersionCreateView = "ocm.component-version.createView",
  componentVersionOpen = "ocm.component-version.open",
  componentVersionDownload = "ocm.component-version.download",
  componentVersionSign = "ocm.component-version.sign",
  componentVersionVerify = "ocm.component-version.verify",
  componentVersionTransfer = "ocm.component-version.transfer",
  componentVersionTransferByValue = "ocm.component-version.transfer-by-value",

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

  newUserGuide = "ocm.guides.newUser",
}

export function registerCommands() {
  commands.registerCommand(CommandIDs.componenetVersionCreate, createComponent);
  commands.registerCommand(CommandIDs.componenetVersionCreateView, createComponentView);
  commands.registerCommand(CommandIDs.componentVersionOpen, openDocument);
  commands.registerCommand(CommandIDs.componentVersionDownload, downloadComponent);
  commands.registerCommand(CommandIDs.componentVersionSign, signComponent);
  commands.registerCommand(CommandIDs.componentVersionVerify, verifyComponent);
  commands.registerCommand(CommandIDs.componentVersionTransfer, transferComponent);
  commands.registerCommand(CommandIDs.componentVersionTransferByValue, transferComponentByValue);

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

  commands.registerCommand(CommandIDs.newUserGuide, showNewUserGuide);
}
