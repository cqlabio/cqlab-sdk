import * as https from 'https';

import axios, { AxiosInstance } from 'axios';

import { LibraryVersion, LibraryVersionSearchByName } from './libraryVersion';
import { TestData } from './testData';
import { DEFAULT_HOST_URL } from './types';
import { ValueSetVersion } from './valueSetVersion';

type CQLabOptions = {
  readonly apiToken?: string;
  readonly hostUrl?: string;
};

export class CQLab {
  readonly apiToken?: string;
  readonly hostUrl: string;
  readonly axiosInstance: AxiosInstance;

  constructor(options?: CQLabOptions) {
    if (options) {
      this.apiToken = options.apiToken;
    }

    this.hostUrl = options?.hostUrl || DEFAULT_HOST_URL;

    const headers = this.apiToken
      ? { 'cq-auth-token': this.apiToken }
      : undefined;

    this.axiosInstance = axios.create({
      baseURL: `${this.hostUrl}/v1`,
      headers: headers,
      // This should not be necessary since the SSL cert should be public and trusted?
      // https://stackoverflow.com/questions/51363855/how-to-configure-axios-to-use-ssl-certificate
      httpsAgent:
        this.hostUrl === DEFAULT_HOST_URL
          ? new https.Agent({
              rejectUnauthorized: false,
            })
          : undefined,
    });
  }

  async fetchLibraryVersionById(
    libraryVersionId: string
  ): Promise<LibraryVersion> {
    const libraryVersion = new LibraryVersion({ config: this });
    await libraryVersion.loadMetaById(libraryVersionId);
    await libraryVersion.loadExecutionContext();
    return libraryVersion;
  }

  async fetchLibraryVersionByName(
    params: LibraryVersionSearchByName
  ): Promise<LibraryVersion> {
    const libraryVersion = new LibraryVersion({ config: this });
    await libraryVersion.loadMetaByName({ ...params });
    await libraryVersion.loadExecutionContext();
    return libraryVersion;
  }

  async fetchValueSetVersionById(
    valueSetVersionId: string
  ): Promise<ValueSetVersion> {
    const valueSetVersion = new ValueSetVersion({ config: this });
    await valueSetVersion.loadMetaById(valueSetVersionId);
    await valueSetVersion.loadCodeContext();
    return valueSetVersion;
  }

  async fetchTestDataById(testDataId: string): Promise<TestData> {
    const valueSetVersion = new TestData({ config: this });
    await valueSetVersion.loadMetaById(testDataId);
    return valueSetVersion;
  }
}
