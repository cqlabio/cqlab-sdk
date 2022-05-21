import test from 'ava';
import MockAdapter from 'axios-mock-adapter';

import { CQLab } from './CQLab';
import heartValueSetVersion from './testFixtures/heartValueSetVersion.json';
import heartValueSetVersionCodes from './testFixtures/heartValueSetVersionCodes.json';
import { ValueSetVersion } from './valueSetVersion';

const MOCK_BASE = 'http://mock-api';

test('getValueSetVersionById', async (t) => {
  const cqlab = new CQLab({
    hostUrl: MOCK_BASE,
  });

  const mock = new MockAdapter(cqlab.axiosInstance);

  const FAKE_ID = '1234';

  mock
    .onGet(`${MOCK_BASE}/v1/value-set-versions/${FAKE_ID}`)
    .reply(200, heartValueSetVersion);

  const valueSetVersion = new ValueSetVersion({ config: cqlab });

  await valueSetVersion.loadMetaById(FAKE_ID);

  t.deepEqual(valueSetVersion._valueSetVersion, heartValueSetVersion);
});

test('fetchValueSetCodes', async (t) => {
  const cqlab = new CQLab({
    hostUrl: MOCK_BASE,
  });

  const mock = new MockAdapter(cqlab.axiosInstance);

  mock
    .onGet(
      `${MOCK_BASE}/v1/value-set-versions/${heartValueSetVersion.id}/codes`
    )
    .reply(200, heartValueSetVersionCodes);

  const valueSetVersion = new ValueSetVersion({ config: cqlab });

  valueSetVersion._id = heartValueSetVersion.id;

  await valueSetVersion.loadCodeContext();

  const codes = valueSetVersion.getCodes();

  t.deepEqual(codes.length, 33);
});
