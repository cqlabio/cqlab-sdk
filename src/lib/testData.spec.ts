import test from 'ava';
import MockAdapter from 'axios-mock-adapter';

import { CQLab } from './CQLab';
import { TestData } from './testData';
import SickTestData from './testFixtures/sickTestData.json';

const MOCK_BASE = 'http://mock-api';

test('loadTestDataById', async (t) => {
  const cqlab = new CQLab({
    hostUrl: MOCK_BASE,
  });

  const mock = new MockAdapter(cqlab.axiosInstance);

  const FAKE_ID = '1234';

  mock.onGet(`${MOCK_BASE}/v1/test-data/${FAKE_ID}`).reply(200, SickTestData);

  const testData = new TestData({ config: cqlab });

  await testData.loadMetaById(FAKE_ID);

  t.deepEqual(testData._testData, SickTestData);
});

test('testData getData', async (t) => {
  const cqlab = new CQLab({
    hostUrl: MOCK_BASE,
  });

  const testData = new TestData({ config: cqlab });
  testData._testData = SickTestData;

  const data = testData.getData();

  t.deepEqual(data?.resourceType, 'Bundle');
});
