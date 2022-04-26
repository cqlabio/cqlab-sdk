// Import here Polyfills if needed. Recommended core-js (npm i -D core-js)
  // import "core-js/fn/array.find"
  // ...
// export default class DummyClass {

// }
import axios, {AxiosInstance } from 'axios'
import { DEFAULT_HOST_URL } from './constants'
import { LibraryVersionSearchByName, LibraryVersion } from './libraryVersion'

interface CQLabOptions {
  apiToken: string
  hostUrl ?: string
}

export class CQLab {
  apiToken: string
  hostUrl: string
  axiosInstance: AxiosInstance

  constructor (options: CQLabOptions) {
    this.apiToken = options.apiToken
    this.hostUrl = options.hostUrl || DEFAULT_HOST_URL

    this.axiosInstance = axios.create({
      baseURL: `${this.hostUrl}/v1`,
      headers: {
        'cq-auth-token': this.apiToken
      }
    });
  }

  // LibraryVersion (libraryOptions: Omit<LibraryVersionOptionsByName, "config"> ): LibraryVersion {
  //   return new LibraryVersion({
  //     config: this,
  //     ...libraryOptions,
  //   })
  // }

  async fetchLibraryVersionByName(params: LibraryVersionSearchByName): Promise<LibraryVersion> {
    const libraryVersion = new LibraryVersion({ config: this })
    await libraryVersion.fetchByName({...params})
    await libraryVersion.fetchExecutionContext()
    return libraryVersion
  }

}

// import CQLab from 'cqlab' 

// const token = 'your-api-token-xxxxxxxxx'
// const cqlab = new CQLab(token)

// const library = cqlab.LibraryVersion({
//   lab: '${lab.name}',
//   library: '${libaryVersion.library.name}',
//   version: '${libaryVersion.version}',
// })

// await library.fetchElmDefintions()

// const results = library.evaluatePatients([CQLab.examples.patient1])
// const firstPatientResult = results[0]

// console.log(firstPatientResult["${statementName}"])