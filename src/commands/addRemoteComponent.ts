import { getExtensionContext } from '../extensionContext';
import { AddComponentPanel } from '../webviews/addComponent';

export async function addRemoteComponent() {
	AddComponentPanel.createOrShow(getExtensionContext());
}