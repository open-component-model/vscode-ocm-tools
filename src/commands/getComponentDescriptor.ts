import { exec } from '../exec';
import YAML from 'yaml';

export async function getComponentDescriptor(component: string, version: string): Promise<string> {
	const cmd = `ocm component get ${component}:${version} -ojson --scheme=v3alpha1`;
	const res = await exec(cmd, { silent: true });
	const data = JSON.parse(res.stdout).items[0];
	const header: string = `# WARNING: THIS FILE IS NOT EDITABLE!
# ---------------------------------------------------------
# source: ${component}
# version: ${version}
# ---------------------------------------------------------
`;
    return header + YAML.stringify(data);
}
