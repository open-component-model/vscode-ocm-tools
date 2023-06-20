import { ExtensionContext, window, workspace } from "vscode";

const enum GlobalStatePrefixes {}

export const enum GlobalStateKey {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  Components = "components",
  // eslint-disable-next-line @typescript-eslint/naming-convention
  FirstEverActivationStorageKey = "firstEverActivation",
  // eslint-disable-next-line @typescript-eslint/naming-convention
  OCMPath = "ocm-path",
  // eslint-disable-next-line @typescript-eslint/naming-convention
  DefaultRepositoryURL = "default-repository-url",
}

interface GlobalStateKeyMapping {
  [GlobalStateKey.Components]: string[];
  [GlobalStateKey.FirstEverActivationStorageKey]: boolean;
  [GlobalStateKey.OCMPath]: string;
  [GlobalStateKey.DefaultRepositoryURL]: string;
}

export class GlobalState {
  constructor(private context: ExtensionContext) {}

  get<T extends GlobalStateKeyMapping, E extends keyof T>(stateKey: E): T[E] | undefined {
    return this.context.globalState.get(stateKey as string);
  }

  set<T extends GlobalStateKeyMapping, E extends keyof T>(stateKey: E, newValue: T[E]): void {
    this.context.globalState.update(stateKey as string, newValue);
  }

  /**
   * Run while developing to see the entire global storage contents.
   */
  async showGlobalStateValue() {
    const document = await workspace.openTextDocument({
      language: "jsonc",
      // @ts-ignore
      content: JSON.stringify(this.context.globalState._value, null, "  "),
    });
    window.showTextDocument(document);
  }

  /**
   * Dev function (clear all global state properties).
   */
  clearGlobalState() {
    for (const key of this.context.globalState.keys()) {
      this.context.globalState.update(key, undefined);
    }
  }
}
