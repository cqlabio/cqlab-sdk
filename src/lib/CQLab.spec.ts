import test from 'ava';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

import { CQLab } from './CQLab';
import { DEFAULT_HOST_URL } from './constants';
import { MockPatient1 } from './mockBundles';
import medXLibraryVersion from './testFixtures/medXLibraryVersion.json';

// This sets the mock adapter on the default instance
const mock = new MockAdapter(axios);

mock
  .onGet('/v1/library-versions/search-one', {
    params: {
      labName: 'learn',
      libraryName: 'MedX',
      version: 'Draft',
    },
  })
  .reply(200, medXLibraryVersion);

test('hostUrl should default on empty init', (t) => {
  const cqlab = new CQLab();

  t.deepEqual(cqlab.hostUrl, DEFAULT_HOST_URL);
  t.falsy(cqlab.apiToken);
});

test('apiToken should be added to header init', (t) => {
  const cqlab = new CQLab({
    apiToken: 'my-token',
  });

  t.deepEqual(cqlab.apiToken, 'my-token');
  // t.deepEqual(cqlab.axiosInstance. defaults.headers['cq-auth-token'], 'my-token')
  // t.falsy(cqlab.apiToken)
});

// test('getLibraryVersion', async (t) => {
//   // t.deepEqual(await asyncABC(), ['a', 'b', 'c']);

//   // t.deepEqual(6, 1)

//   const cqlab = new CQLab({
//     hostUrl: 'http://localhost:3333',
//     apiToken: 'none'
//   })

//   const libraryVersion = await cqlab.fetchLibraryVersionByName({
//     labName: 'learn',
//     libraryName: 'Arithmetic'
//   })

//   const result = libraryVersion.execute(MockPatient1)

//   t.deepEqual(result['AdditionSimple'], 1)
//   // t.deepEqual(6, 1)
//   // expect(result).toBeTruthy()

// });
