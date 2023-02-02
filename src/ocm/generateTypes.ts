import * as yaml from 'js-yaml'
import { writeFileSync } from 'fs'
import { compile } from 'json-schema-to-typescript'

const VERSION = "v0.1.0-rc.1"
const v2schema = `https://raw.githubusercontent.com/open-component-model/ocm/${VERSION}/resources/component-descriptor-v2-schema.yaml`
const v3schema = `https://raw.githubusercontent.com/open-component-model/ocm/${VERSION}/resources/component-descriptor-ocm-v3-schema.yaml`
const outputPath = "./src/ocm"

async function generate(name: string, url: string, out: string) {
  const req = await fetch(url)
  const data = await req.text()
  const json = await yaml.load(data)
  const result = await compile(json, name)
  await writeFileSync(`${outputPath}/${out}`, result)
}

generate("ComponentDescriptorV2",v2schema, "ocmv2.d.ts")
generate("ComponentDescriptorV3",v3schema, "ocmv3.d.ts")

