// export const hello = 'jejej'

// import * as https from 'https';
import axios, {AxiosInstance } from 'axios'

// import got, { Got } from 'got';
import { DEFAULT_HOST_URL } from './constants'
import { LibraryVersion, LibraryVersionSearchByName } from './libraryVersion'
import mockPatient1 from  './mockBundles/mockPatient1.json'

type CQLabOptions = {
  readonly apiToken: string
  readonly hostUrl ?: string
};

export const MockPatient1 = mockPatient1 //as fhir4.Bundle

export class CQLab {
  readonly apiToken?: string
  readonly hostUrl: string
  readonly axiosInstance: AxiosInstance
  // gotInstance: Got

  constructor (options?: CQLabOptions) {

    if (options) {
      this.apiToken = options.apiToken
    }
    
    this.hostUrl = options?.hostUrl || DEFAULT_HOST_URL

    const headers =  this.apiToken 
      ? {'cq-auth-token': this.apiToken} 
      : undefined

    // this.gotInstance = got.extend({
    //   prefixUrl: `${this.hostUrl}/v1`,
    //   headers: headers
    // });

    this.axiosInstance = axios.create({
      baseURL: `${this.hostUrl}/v1`,
      headers: headers,
      // httpsAgent: new https.Agent({  
      //   rejectUnauthorized: false
      // })
    });
  }

  async fetchLibraryVersionByName(params: LibraryVersionSearchByName): Promise<LibraryVersion> {
    const libraryVersion = new LibraryVersion({ config: this })
    await libraryVersion.fetchByName({...params})
    await libraryVersion.fetchExecutionContext()
    return libraryVersion
  }

}