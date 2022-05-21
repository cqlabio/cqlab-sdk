import { CQLab } from './CQLab';
import { ServerTestData } from './types';

export interface TestDataOptions {
  config: CQLab;
  _id?: string;
}

export interface TestDataSearchByName {
  labName: string;
  libraryName: string;
  version?: string;
}

export class TestData {
  config: CQLab;

  _id?: string;
  _testData?: ServerTestData;

  constructor(options: TestDataOptions) {
    this.config = options.config;
    if (options._id) {
      this._id = options._id;
    }
  }

  async loadMetaById(testDataId: string): Promise<void> {
    const { data } = await this.config.axiosInstance.get<ServerTestData>(
      `test-data/${testDataId}`
    );

    this._id = data.id;
    this._testData = data;
  }

  getData(): fhir4.Bundle | null {
    if (!this._testData?.data) {
      return null;
    }
    return JSON.parse(this._testData.data) as fhir4.Bundle;
  }
}
