import { exec } from '../exec';
import YAML from 'yaml';

export async function getItemYAML(type: string, path: string, name: string): Promise<string> {
	const cmd = `ocm ${type} get ${path} ${name} -ojson`;
	const res = await exec(cmd, { silent: true });
	const data = JSON.parse(res.stdout).items[0];
	const header: string = `# WARNING: THIS FILE IS NOT EDITABLE!
# ---------------------------------------------------------
# component: ${data.context}
# ${type}: ${name}
# ---------------------------------------------------------
`;
	return header + YAML.stringify(data.element);
}