# OCM tools for Visual Studio Code

[![REUSE status](https://api.reuse.software/badge/github.com/open-component-model/vscode-ocm-tools)](https://api.reuse.software/info/github.com/open-component-model/vscode-ocm-tools)

### Install the extension from source

To preview the extension without running the debugger you can install the extension from a `vsix` file.

The process is as follows:
- clone this github repo and navigate into it
- install npm, e.g. using `brew install npm`
- install the module "ts-loader": `npm install -D ts-loader`
- install the `vsce` compiler: `npm install -g @vscode/vsce`
- run the compiler against this project: `vsce package`
- in vscode navigate to the "Extensions" tab and select "Install from VSIX..." from the menu
- in the file dialog navigate to the folder where you compiled the extension and select `vscode-ocm-tools-X.X.X.vsix`

### Generate Typescript types for OCM

Typescript types can be automatically generated using the OCM schema.

To generate the types run the following command:

`npm run gen:types:ocm`

The script used to generate the types can be found here: `src/ocm/generateTypes.ts`.

This script will fetch the v2 and v3 schema documents for the specified version from the `open-component-model/ocm` repository. It will then generate types based on the schema objects.

## Licensing

Copyright 2022 SAP SE or an SAP affiliate company and Open Component Model contributors.
Please see our [LICENSE](LICENSE) for copyright and license information.
Detailed information including third-party components and their licensing/copyright information is available [via the REUSE tool](https://api.reuse.software/info/github.com/open-component-model/<repo-name>).
