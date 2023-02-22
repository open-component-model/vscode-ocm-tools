'use strict';

const vscode = acquireVsCodeApi();

/**
 *
 * @type { {
 * name: string;
 * path: string;
* }}
 */
const webviewTempState = {
	name: '',
	path: '',
};

const nameId = 'name';
const pathId = 'path';

// Inputs
const $name = /** @type HTMLInputElement */ (document.getElementById(nameId));
const $path = /** @type HTMLInputElement */ (document.getElementById(pathId));
const $createKeysButton = /** @type HTMLButtonElement */ (document.getElementById('create-keys'));

$createKeysButton.addEventListener('click', () => {
	postVSCodeMessage({
		type: 'createSigningKeys',
		value: {
			// @ts-ignore
			name: getInputValue(nameId),
			path: getInputValue(pathId),
		},
	});
});

// ────────────────────────────────────────────────────────────
/**
 * @param message {import('../../src/webviews/createSigningKeys').MessageFromWebview}
 */
function postVSCodeMessage(message) {
	vscode.postMessage(message);
}

/**
 * @param {string} text
 */
function showNotification(text, isModal = false) {
	postVSCodeMessage({
		type: 'showNotification',
		value: {
			text,
			isModal,
		},
	});
}

/**
 * Get text input value (by id).
 * @param {string} inputId
 * @returns {string} input value or empty string
 */
function getInputValue(inputId) {
	return /** @type null | HTMLInputElement */ (document.getElementById(inputId))?.value || '';
}

window.addEventListener('message', event => {
	/** @type {import('../../src/webviews/createSigningKeys').MessageToWebview} */
	const message = event.data;

	switch (message.type) {
		case 'updateWebviewContent': {
			break;
		}
	}
});

postVSCodeMessage({
	type: 'webviewLoaded',
	value: true,
});
