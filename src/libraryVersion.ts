import cqlExecution from 'cql-execution';
import { CQLab } from './cqlab-sdk'
import {  LATEST } from './constants'

// Why?
// import cqlfhir from 'cql-exec-fhir';
const cqlfhir = require('cql-exec-fhir');

export interface LibraryVersionOptions {
  config: CQLab
}

export interface LibraryVersionSearchByName {
  labName: string
  libraryName: string
  version?: string  
}

export class LibraryVersion {
  config: CQLab

  labId?: string;
  libraryId?: string;
  libraryVersionId?: string;

  version?: string;
  libraryName?: string;

  cql?: string;
  elm?: any;
  valueSetMap?: any;
  includedLibraries?: any;

  constructor (options: LibraryVersionOptions) {
    this.config = options.config
  }

  async fetchByName({
  labName,
  libraryName,
  version
  }: LibraryVersionSearchByName): Promise<void> {

    const res = await this.config.axiosInstance.get('libraries/search-one', {
      params: {
        labName: labName,
        libraryName: libraryName,
        version: version || LATEST
      }
    })

    this.labId = res.data.libraryVersion.labId
    this.libraryId = res.data.libraryVersion.libraryId
    this.libraryVersionId = res.data.libraryVersion.id
    
    this.libraryName =  res.data.libraryVersion.library.name
    this.version =  res.data.version
  }
  
  async fetchExecutionContext() {
    if (!this.libraryVersionId) {
      throw new Error('libraryVersionId is required to make this call')
    }

    const res = await this.config.axiosInstance.get(`library-versions/${this.libraryVersionId}/execution-context`)

    this.cql = res.data.cql;
    this.elm = res.data.elm;
    this.includedLibraries = res.data.includedLibraries;
    this.valueSetMap = res.data.valueSetMap;
  }

  execute (bundles: any[]) {
    if (!this.elm) {
      throw new Error('Must load ELM using fetchExecutionContext')
    }

    const includedElm = this.includedLibraries.map((included: any) => included.elm)

    const lib = new cqlExecution.Library(
      this.elm,
      new cqlExecution.Repository(includedElm)
    );

    const codeService = new cqlExecution.CodeService(this.valueSetMap);
    const executor = new cqlExecution.Executor(lib, codeService);    

    const patientSource = cqlfhir.PatientSource.FHIRv401();
    patientSource.loadBundles(bundles);
    
    const results = executor.exec(patientSource);
    
    return results.patientResults
  }

}