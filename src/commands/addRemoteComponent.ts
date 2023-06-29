import { getExtensionContext } from "../extensionContext";
import { RegistryNode } from "../views/nodes/registryNode";
import { AddComponentPanel } from "../webviews/addComponent";

export async function addRemoteComponent() {
  AddComponentPanel.createOrShow(getExtensionContext());
}

export async function addRemoteComponentFromRegistry(node: RegistryNode) {
  AddComponentPanel.createOrShow(getExtensionContext(), node.name);
}
