import cqlfhir from 'cql-exec-fhir';
import cqlExecution from 'cql-execution';

import { CQLab } from './CQLab'
import {  LATEST } from './constants'

// Why?
// const cqlfhir = require('cql-exec-fhir');

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

    const {data} = await this.config.axiosInstance.get<any>('libraries/search-one', {
      params: {
        labName: labName,
        libraryName: libraryName,
        version: version || LATEST
      }
    })

    // const res = await this.config.gotInstance.get('libraries/search-one', {
    //   searchParams: {
    //         labName: labName,
    //         libraryName: libraryName,
    //         version: version || LATEST
    //       }
    // })

    // console.log('er;', res)

    this.labId = data.libraryVersion.labId
    this.libraryId = data.libraryVersion.libraryId
    this.libraryVersionId = data.libraryVersion.id
    
    this.libraryName =  data.libraryVersion.library.name
    this.version =  data.version
  }
  
  async fetchExecutionContext() {
    if (!this.libraryVersionId) {
      throw new Error('libraryVersionId is required to make this call')
    }

    const res = await this.config.axiosInstance.get<any>(`library-versions/${this.libraryVersionId}/execution-context`)
    // const res = await this.config.gotInstance.get(`library-versions/${this.libraryVersionId}/execution-context`)

    // console.log(res)

    this.cql = res.data.cql;
    this.elm = res.data.elm;
    this.includedLibraries = res.data.includedLibraries;
    this.valueSetMap = res.data.valueSetMap;
  }

  executeMany (bundles: fhir4.Bundle[]) {
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

  execute (bundle: fhir4.Bundle): any {
    const patientResults = this.executeMany([bundle])
    const patientValues = Object.values(patientResults)
    return patientValues.length === 1 ? patientValues[0] : null
  }
}