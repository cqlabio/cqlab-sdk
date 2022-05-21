import cqlfhir from 'cql-exec-fhir';
import cqlExecution from 'cql-execution';

import { CQLab } from './CQLab';
import {
  ServerLibraryVersion,
  ServerLibraryVersionExecutionContext,
} from './types';

export interface LibraryVersionOptions {
  config: CQLab;
  _id?: string;
}

export interface LibraryVersionSearchByName {
  labName: string;
  libraryName: string;
  version?: string;
}

export class LibraryVersion {
  config: CQLab;

  _id?: string;
  _libraryVersion?: ServerLibraryVersion;
  _executionContext?: ServerLibraryVersionExecutionContext;

  constructor(options: LibraryVersionOptions) {
    this.config = options.config;

    if (options._id) {
      this._id = options._id;
    }
  }

  async loadMetaById(libraryVersionId: string): Promise<void> {
    const { data } = await this.config.axiosInstance.get<ServerLibraryVersion>(
      `library-versions/${libraryVersionId}`
    );

    this._libraryVersion = data;
  }

  async loadMetaByName({
    labName,
    libraryName,
    version,
  }: LibraryVersionSearchByName): Promise<void> {
    const { data } = await this.config.axiosInstance.get<ServerLibraryVersion>(
      'library-versions/search-one',
      {
        params: {
          labName: labName,
          libraryName: libraryName,
          version: version || undefined,
        },
      }
    );

    this._id = data.id;
    this._libraryVersion = data;
  }

  async loadExecutionContext() {
    if (!this._id) {
      throw new Error('_id is required to fetch context');
    }

    const { data } =
      await this.config.axiosInstance.get<ServerLibraryVersionExecutionContext>(
        `library-versions/${this._id}/execution-context`
      );

    this._executionContext = data;
  }

  executeMany(bundles: fhir4.Bundle[]): Record<string, Record<string, any>> {
    if (!this._executionContext) {
      throw new Error('Must load ExecutionContext using fetchExecutionContext');
    }

    const includedElm = this._executionContext.includedLibraries.map(
      (included) => included.elm
    );

    const lib = new cqlExecution.Library(
      this._executionContext.elm,
      new cqlExecution.Repository(includedElm)
    );

    const codeService = new cqlExecution.CodeService(
      this._executionContext.valueSetMap
    );
    const executor = new cqlExecution.Executor(lib, codeService);

    const patientSource = cqlfhir.PatientSource.FHIRv401();
    patientSource.loadBundles(bundles);

    const results = executor.exec(patientSource);
    return results.patientResults;
  }

  execute(bundle: fhir4.Bundle): Record<string, any> {
    const patientResults = this.executeMany([bundle]);
    const patientValues = Object.values(patientResults);
    const resultValue = patientValues.length === 1 ? patientValues[0] : null;
    if (!resultValue) {
      throw new Error(
        'Execution should contain always one value. Something is wrong.'
      );
    }
    return resultValue;
  }
}
