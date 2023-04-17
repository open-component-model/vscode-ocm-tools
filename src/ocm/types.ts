import { Meta, OciImageResource, Reference, ResourceType, SourceDefinition } from "./ocmv3";

export interface Component extends Meta {
  scheme: "v2" | "v3alpha1";
  path: string;
  resources?: (Resource | OciArtifactResource)[];
  sources?: SourceDefinition[];
  references?: Reference[];
}

type NoStringIndex<T> = { [K in keyof T as string extends K ? never : K]: T[K] };

export interface Resource extends Omit<NoStringIndex<ResourceType>, "version" | "type" | "access"> {
  version?: string;
  type?: string;
  input: LocalFilesystemResourceInput;
}

export interface OciArtifactResource extends Omit<NoStringIndex<OciImageResource>, "access"> {
  access: OciArtifactAccess;
}

export interface LocalFilesystemResourceInput {
  type: "file" | "dir";
  mediaType?: string;
  path: string;
  compress: boolean;
}

export interface OciArtifactAccess {
  type: "ociArtifact";
  imageReference: string;
}
