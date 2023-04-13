"use strict";

const vscode = acquireVsCodeApi();

let resourceCount = 0;
let referenceCount = 0;
let sourceCount = 0;

// Generic component input ids
const componentName = "componentName";
const version = "version";
const provider = "provider";
const scheme = "scheme";

const $addResourceButton = /** @type HTMLButtonElement */ (document.getElementById("add-resource"));
const $addReferenceButton = /** @type HTMLButtonElement */ (
  document.getElementById("add-reference")
);
const $addSourceButton = /** @type HTMLButtonElement */ (document.getElementById("add-source"));
const $submitBtn = /** @type HTMLButtonElement */ (document.getElementById("create-component"));

$addResourceButton.addEventListener("click", () => {
  addResourceForm(resourceCount);

  document.getElementById(`resourceInputType-${resourceCount}`)?.addEventListener("change", (e) => {
    // @ts-ignore
    const resourceType = e.target?.value;
    // @ts-ignore
    const resourceNumber = e.target?.parentNode.parentNode.dataset.resourceCounter;

    if (document.getElementById(`resource-fields-${resourceNumber}`)) {
      document.getElementById(`resource-fields-${resourceNumber}`)?.remove();
    }

    switch (resourceType) {
      case "file": {
        addFileResourceForm(resourceNumber);
        break;
      }
      case "directory": {
        addDirectoryResourceForm(resourceNumber);
        break;
      }
      case "ociImage": {
        addOciImageResourceForm(resourceNumber);
        break;
      }
    }
  });

  resourceCount++;
});

$addSourceButton.addEventListener("click", () => {
  addSourceForm(sourceCount);
  sourceCount++;
});

$addReferenceButton.addEventListener("click", () => {
  addReferenceForm(referenceCount);
  referenceCount++;
});

$submitBtn.addEventListener("click", () => {
  const inputs = /** @type NodeListOf<HTMLInputElement> */ (
    document.querySelectorAll("#generic-form input[type=text]")
  );
  if (inputs.length !== 0) {
    let invalidFields = 0;
    inputs.forEach((input) => {
      if (!input.value.trim()) {
        invalidFields++;
        if (input.classList.contains("invalid")) {
          return;
        }
        input.classList.add("invalid");
        input.insertAdjacentHTML(
          "afterend",
          `<span class="validation-error">This field is required.</span>`
        );
        updateInvalidField(input);
      }
    });
    if (invalidFields > 0) {
      return;
    }
  }

  /** @type {import('../../src/webviews/createComponent').CreateComponentMessage} */
  const component = {
    type: "createComponent",
    value: {
      // @ts-ignore
      componentName: getInputValue(componentName),
      version: getInputValue(version),
      provider: getInputValue(provider),
      scheme: getInputValue(scheme),
    },
  };

  if (resourceCount > 0) {
    component.value["resources"] = [];
    for (let i = 0; i < resourceCount; i++) {
      if (!document.getElementById(`resource-form-${i}`)) {
        continue;
      }

      switch (getInputValue(`resourceInputType-${i}`)) {
        case "file": {
          component.value["resources"].push({
            // @ts-ignore
            inputType: getInputValue(`resourceInputType-${i}`),
            name: getInputValue(`resourceName-${i}`),
            type: getInputValue(`resourceType-${i}`),
            mediaType: getInputValue(`resourceMediaType-${i}`),
            path: getInputValue(`resourcePath-${i}`),
            // @ts-ignore
            compress: getInputValue(`compressResource-${i}`),
          });
          break;
        }
        case "directory": {
          component.value["resources"].push({
            // @ts-ignore
            inputType: getInputValue(`resourceInputType-${i}`),
            name: getInputValue(`resourceName-${i}`),
            path: getInputValue(`resourcePath-${i}`),
            // @ts-ignore
            compress: getInputValue(`compressResource-${i}`),
          });
          break;
        }
        case "ociImage": {
          component.value["resources"].push({
            // @ts-ignore
            inputType: getInputValue(`resourceInputType-${i}`),
            name: getInputValue(`resourceName-${i}`),
            version: getInputValue(`resourceVersion-${i}`),
            imageReference: getInputValue(`resourceImageReference-${i}`),
          });
        }
      }
    }
  }

  if (referenceCount > 0) {
    component.value["references"] = [];
    for (let i = 0; i < referenceCount; i++) {
      if (!document.getElementById(`reference-form-${i}`)) {
        continue;
      }

      component.value["references"].push({
        name: getInputValue(`referenceName-${i}`),
        componentName: getInputValue(`referenceComponentName-${i}`),
        componentVersion: getInputValue(`referenceComponentVersion-${i}`),
      });
    }
  }

  if (sourceCount > 0) {
    component.value["sources"] = [];
    for (let i = 0; i < sourceCount; i++) {
      if (!document.getElementById(`source-form-${i}`)) {
        continue;
      }

      switch (getInputValue(`sourceAccessType-${i}`)) {
        case "gitHub": {
          component.value["sources"].push({
            name: getInputValue(`sourceName-${i}`),
            version: getInputValue(`sourceVersion-${i}`),
            // @ts-ignore
            accessType: getInputValue(`sourceAccessType-${i}`),
            repoUrl: getInputValue(`sourceRepoUrl-${i}`),
            commit: getInputValue(`sourceCommit-${i}`),
          });
        }
      }
    }
  }

  postVSCodeMessage(component);
});

/**
 *
 * @param {number} i
 */
function addResourceForm(i) {
  var div = document.createElement("div");
  div.setAttribute("id", `resource-form-${i}`);
  div.setAttribute("data-resource-counter", `${i}`);
  div.classList.add("addon-form");
  div.innerHTML = `
  <h3>Add Resource</h3>
  <div>
    <label class="header-label" for="resourceInputType-${i}">Resource Input Type</label><select name="resourceInputType-${i}" id="resourceInputType-${i}">
      <option disabled selected value> -- select an option -- </option>
			<option value="file">file</option>
      <option value="directory">directory</option>
      <option value="ociImage">ociImage</option>
		</select>
  </div>
 `;

  $addResourceButton.insertAdjacentElement("beforebegin", div);
}

/**
 *
 * @param {number} i
 */
function addFileResourceForm(i) {
  const html = `
  <div id="resource-fields-${i}">
    <div>
      <label class="header-label" for="resourceName-${i}">Resource Name</label><input type="text" name="resourceName-${i}" id="resourceName-${i}" />
    </div>
    <div>
      <label class="header-label" for="resourceType-${i}">Resource Type</label><input type="text" name="resourceType-${i}" id="resourceType-${i}" />
    </div>
    <div>
      <label class="header-label" for="resourceMediaType-${i}">Resource Media Type</label><input type="text" name="resourceMediaType-${i}" id="resourceMediaType-${i}" />
    </div>
    <div>
      <label class="header-label" for="resourcePath-${i}">Resource Path</label>
      <div>
        <button type="button" id="filepicker-${i}" class="filepicker-button">Select...</button>
        <span><input type="text" disabled id="resourcePath-${i}" name="resourcePath-${i}"/></span>
      </div>
    </div>
    <div>
      <label class="header-label" for="compressResource-${i}">Compress?</label><input type="checkbox" name="compressResource-${i}" id="compressResource-${i}">
    </div>
  </div>
  `;

  document.getElementById(`resource-form-${i}`)?.insertAdjacentHTML("beforeend", html);
  document.getElementById(`filepicker-${i}`)?.addEventListener("click", (e) => {
    const options = {
      canSelectMany: false,
      canSelectFiles: true,
      canSelectFolders: false,
      openLabel: "Select",
    };

    showOpenDialog(options, i);
  });
}

/**
 *
 * @param {number} i
 */
function addDirectoryResourceForm(i) {
  const html = `
  <div id="resource-fields-${i}">
    <div>
      <label class="header-label" for="resourceName-${i}">Resource Name</label><input type="text" name="resourceName-${i}" id="resourceName-${i}" />
    </div>
    <div>
      <label class="header-label" for="resourcePath-${i}">Resource Path</label>
      <div>
        <button type="button" id="filepicker-${1}" class="filepicker-button">Select...</button>
        <span><input type="text" disabled id="resourcePath-${i}" name="resourcePath-${i}"/></span>
      </div>
    </div>
    <div>
      <label class="header-label" for="compressResource-${i}">Compress?</label><input type="checkbox" name="compressResource-${i}" id="compressResource-${i}">
    </div>
  </div>
  `;

  document.getElementById(`resource-form-${i}`)?.insertAdjacentHTML("beforeend", html);
  document.getElementById(`filepicker-${1}`)?.addEventListener("click", (e) => {
    const options = {
      canSelectMany: false,
      canSelectFiles: false,
      canSelectFolders: true,
      openLabel: "Select",
    };

    showOpenDialog(options, i);
  });
}

/**
 * @param {number} i
 */
function addOciImageResourceForm(i) {
  const html = `
  <div id="resource-fields-${i}">
    <div>
      <label class="header-label" for="resourceName-${i}">Resource Name</label><input type="text" name="resourceName-${i}" id="resourceName-${i}" />
    </div>
    <div>
      <label class="header-label" for="resourceVersion-${i}">Version</label><input type="text" name="resourceVersion-${i}" id="resourceVersion-${i}" />
    </div>
    <div>
      <label class="header-label" for="resourceImageReference-${i}">Image Reference</label><input type="text" name="resourceImageReference-${i}" id="resourceImageReference-${i}" />
    </div>
  </div>
  `;

  document.getElementById(`resource-form-${i}`)?.insertAdjacentHTML("beforeend", html);
}

/**
 *
 * @param {number} i
 */
function addSourceForm(i) {
  var div = document.createElement("div");
  div.setAttribute("id", `source-form-${i}`);
  div.setAttribute("data-source-counter", `${i}`);
  div.classList.add("addon-form");
  div.innerHTML = `
  <h3>Add Source</h3>
  <div>
    <label class="header-label" for="sourceAccessType-${i}">Source Type</label><select name="sourceAccessType-${i}" id="sourceAccessType-${i}">
      <option disabled selected value> -- select an option -- </option>
      <option value="gitHub">GitHub</option>
		</select>
  </div>
  `;

  $addSourceButton.insertAdjacentElement("beforebegin", div);
  document.getElementById(`sourceAccessType-${i}`)?.addEventListener("change", (e) => {
    const sourceType = /** @type HTMLSelectElement */ (e.target).value;
    switch (sourceType) {
      case "gitHub": {
        addGitHubSourceForm(i);
        break;
      }
    }
  });
}

/**
 *
 * @param {number} i
 */
function addGitHubSourceForm(i) {
  const html = `
  <div>
    <label class="header-label" for="sourceName-${i}">Source Name</label><input type="text" name="sourceName-${i}" id="sourceName-${i}" />
  </div>
  <div>
    <label class="header-label" for="sourceVersion-${i}">Source Version</label><input type="text" name="sourceVersion-${i}" id="sourceVersion-${i}" />
  </div>
  <div>
    <label class="header-label" for="sourceRepoUrl-${i}">Repo URL</label><input type="text" name="sourceRepoUrl-${i}" id="sourceRepoUrl-${i}" />
  </div>
  <div>
    <label class="header-label" for="sourceCommit-${i}">Commit</label><input type="text" name="sourceCommit-${i}" id="sourceCommit-${i}" />
  </div>
  `;

  document.getElementById(`source-form-${i}`)?.insertAdjacentHTML("beforeend", html);
}

/**
 *
 * @param {number} i
 */
function addReferenceForm(i) {
  var div = document.createElement("div");
  div.setAttribute("id", `reference-form-${i}`);
  div.setAttribute("data-reference-counter", `${i}`);
  div.classList.add("addon-form");
  div.innerHTML = `
  <h3>Add Reference</h3>
  <div>
    <label class="header-label" for="referenceName-${i}">Reference Name</label><input type="text" name="referenceName-${i}" id="referenceName-${i}" />
  </div>
  <div>
    <label class="header-label" for="referenceComponentName-${i}">Component Name</label><input type="text" name="referenceComponentName-${i}" id="referenceComponentName-${i}" />
  </div>
  <div>
    <label class="header-label" for="referenceComponentVersion-${i}">Component Version</label><input type="text" name="referenceComponentVersion-${i}" id="referenceComponentVersion-${i}" />
  </div>
  `;

  $addReferenceButton.insertAdjacentElement("beforebegin", div);
}

/**
 *
 * @param {Element} field
 */
function updateInvalidField(field) {
  field?.addEventListener("input", (e) => {
    if (field?.classList.contains("invalid")) {
      field.classList.remove("invalid");
      field.nextElementSibling?.remove();
    }
  });
}

/**
 * Get text input value (by id).
 * @param {string} inputId
 * @returns {string | boolean} input value or empty string
 */
function getInputValue(inputId) {
  return /** @type null | HTMLInputElement */ (document.getElementById(inputId))?.value || "";
}

// ────────────────────────────────────────────────────────────
// ─── WEBVIEW MESSAGE HANDLING ───────────────────────────────
// ────────────────────────────────────────────────────────────

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
 * @param {import('vscode').OpenDialogOptions} options
 * @param {number} resourceId
 */
function showOpenDialog(options, resourceId) {
  postVSCodeMessage({
    type: "showOpenDialog",
    value: {
      options: options,
      forResourceId: resourceId,
    },
  });
}

window.addEventListener("message", (event) => {
  /** @type {import('../../src/webviews/createComponent').MessageToWebview} */
  const message = event.data;

  switch (message.type) {
    case "updateWebviewContent": {
      break;
    }
    case "openDialogResponse": {
      const { fileUri, forResourceId } = message.value;
      document.getElementById(`resourcePath-${forResourceId}`)?.setAttribute("value", fileUri);
      break;
    }
  }
});

postVSCodeMessage({
  type: "webviewLoaded",
  value: true,
});
