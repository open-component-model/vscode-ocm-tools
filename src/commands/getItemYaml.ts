import { shell } from '../shell';
import YAML from 'yaml';

export async function getItemYAML(type: string, path: string, name: string): Promise<string> {
	const cmd = `ocm ${type} get ${path} ${name} -ojson`;
	const res = await shell.exec(cmd);
	const data = JSON.parse(res.stdout).items[0];
	const header: string = `# WARNING: THIS FILE IS NOT EDITABLE!
# ---------------------------------------------------------
# component: ${data.context}
# ${type}: ${name}
# ---------------------------------------------------------
`;
	return header + YAML.stringify(data.element);
}