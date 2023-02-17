import { exec } from '../exec';
import { HttpsGardenerCloudSchemasComponentDescriptorOcmV3Alpha1 as ComponentDescriptorV3 } from '../ocm/ocmv3';

export async function* fetchComponents(name: string): AsyncGenerator<ComponentDescriptorV3, any, void> {
	const cmd = `ocm get components ${name} -ojson --scheme=v3alpha1`;
	const result = await exec(cmd, { silent: true });
	const items = JSON.parse(result.stdout).items;
	for (const i of items) {
		yield i;
	};
}