# OCM tools for Visual Studio Code

[![REUSE status](https://api.reuse.software/badge/github.com/open-component-model/vscode-ocm-tools)](https://api.reuse.software/info/github.com/open-component-model/vscode-ocm-tools)

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
