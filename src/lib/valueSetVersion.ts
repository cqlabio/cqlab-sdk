import { CQLab } from './CQLab';
import { FhirCode, ServerCode, ServerValueSetVersion } from './types';

export interface ValueSetVersionOptions {
  config: CQLab;
  _id?: string;
}

export class ValueSetVersion {
  config: CQLab;

  _id?: string;
  _valueSetVersion?: ServerValueSetVersion;
  _codes?: ServerCode[];

  constructor(options: ValueSetVersionOptions) {
    this.config = options.config;
    if (options._id) {
      this._id = options._id;
    }
  }

  async loadMetaById(valueSetVersionId: string): Promise<void> {
    const { data } = await this.config.axiosInstance.get<ServerValueSetVersion>(
      `value-set-versions/${valueSetVersionId}`
    );

    this._id = data.id;
    this._valueSetVersion = data;
  }

  async loadCodeContext() {
    if (!this._id) {
      throw new Error('valueSetVersion is required to make this call');
    }

    const { data } = await this.config.axiosInstance.get<ServerCode[]>(
      `value-set-versions/${this._id}/codes`
    );

    this._codes = data;
  }

  getCodes(): FhirCode[] {
    if (!this._codes) {
      return [];
    }
    return this._codes.map((serverCode) => ({
      code: serverCode.code,
      display: serverCode.display,
      system: serverCode.codeSystem.url,
      // version?: serverCode.
    }));
  }
}
