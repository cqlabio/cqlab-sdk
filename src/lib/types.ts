export const DEFAULT_HOST_URL = 'https://api.cqlab.io';
// export const LATEST = 'latest'

export interface ServerLibrary {
  id: string;
  name: string;
  isPublic: boolean;
  labId: string;
}

export interface ServerLibraryVersion {
  id: string;
  createdAt: string;
  version: string;
  dataModel: string;
  libraryId: string;
  isPublished: boolean;
  library: ServerLibrary;
}

export interface ServerValueSet {
  id: string;
  name: string;
  isPublic: boolean;
  labId: string;
  valueSetType: string;
}

export interface ServerValueSetVersion {
  id: string;
  createdAt: string;
  version: string;
  valueSetId: string;
  valueSet: ServerValueSet;
  isPublished: boolean;
}

export interface ServerCode {
  id: string;
  createdAt: string;
  code: string;
  version: string;
  display: string;
  codeSystemId: string;
  codeSystem: {
    id: string;
    name: string;
    url: string;
  };
}

export interface FhirCode {
  system: string;
  code: string;
  version?: string;
  display?: string;
}

export interface ValueSetCodeMap {
  [oid: string]: {
    [version: string]: FhirCode[];
  };
}

export interface ServerLibraryVersionExecutionContext {
  cql: string;
  elm: any;
  includedLibraries: {
    cql: string;
    elm: any;
  }[];
  valueSetMap: ValueSetCodeMap;
}

export interface ServerTestData {
  id: string;
  createdAt: string;
  name: string;
  testDataModel: string;
  data: string;
  isPublic: boolean;
  labId: string;
}
