'use strict';

const vscode = acquireVsCodeApi();

/**
 *
 * @type { {
 * repository: string;
 * componentName: string;
 * }}
 */
const webviewTempState = {
	repository: '',
	componentName: '',
};

// Generic cluster input ids
const repositoryId = 'repository';
const componentId = 'component';

// Inputs
const $repository = /** @type HTMLInputElement */ (document.getElementById(repositoryId));
const $component = /** @type HTMLInputElement */ (document.getElementById(componentId));
const $submitButton = /** @type HTMLButtonElement */ (document.getElementById('add-component'));

$submitButton.addEventListener('click', () => {
	postVSCodeMessage({
		type: 'addComponent',
		value: {
			// @ts-ignore
			repositoryURL: getInputValue(repositoryId),
			componentName: getInputValue(componentId),
		},
	});
});

// ────────────────────────────────────────────────────────────
/**
 * @param message {import('../../src/webviews/addComponent').MessageFromWebview}
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
	/** @type {import('../../src/webviews/addComponent').MessageToWebview} */
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