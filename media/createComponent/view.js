"use strict";

const vscode = acquireVsCodeApi();

/**
 *
 * @type { {
 * componentName: string;
 * version: string;
 * provider: string;
 * scheme: string;
 * }}
 */
const webviewTempState = {
  componentName: "",
  version: "",
  provider: "",
  scheme: "",
};

// Generic cluster input ids
const componentName = "componentName";
const version = "version";
const provider = "provider";
const scheme = "scheme";

// Inputs
const $component = /** @type HTMLInputElement */ (document.getElementById(componentName));
const $version = /** @type HTMLInputElement */ (document.getElementById(version));
const $provider = /** @type HTMLInputElement */ (document.getElementById(provider));
const $scheme = /** @type HTMLInputElement */ (document.getElementById(scheme));
const $submitButton = /** @type HTMLButtonElement */ (document.getElementById("create-component"));

$submitButton.addEventListener("click", () => {
  postVSCodeMessage({
    type: "createComponent",
    value: {
      // @ts-ignore
      componentName: getInputValue(componentName),
      version: getInputValue(version),
      provider: getInputValue(provider),
      scheme: getInputValue(scheme),
    },
  });
});

// ────────────────────────────────────────────────────────────
/**
 * @param message {import('../../src/webviews/createComponent').MessageFromWebview}
 */
function postVSCodeMessage(message) {
  vscode.postMessage(message);
}

/**
 * @param {string} text
 */
function showNotification(text, isModal = false) {
  postVSCodeMessage({
    type: "showNotification",
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
  return /** @type null | HTMLInputElement */ (document.getElementById(inputId))?.value || "";
}

window.addEventListener("message", (event) => {
  /** @type {import('../../src/webviews/createComponent').MessageToWebview} */
  const message = event.data;

  switch (message.type) {
    case "updateWebviewContent": {
      break;
    }
  }
});

postVSCodeMessage({
  type: "webviewLoaded",
  value: true,
});
