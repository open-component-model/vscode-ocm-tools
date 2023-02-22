export enum OCMConfigTypes {
    configType = "generic.config.ocm.software/v1",
    signingConfigType = "keys.config.ocm.software",
}

export type Key = {
  [name: string]: {path: string}
};

export type KeyEntry = {
  type: OCMConfigTypes.signingConfigType
  privateKeys: Key
  publicKeys: Key
};