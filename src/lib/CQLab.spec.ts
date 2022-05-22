import test from 'ava';
// import axios from 'axios';
// import MockAdapter from 'axios-mock-adapter';

import { CQLab } from './CQLab';
// import { MockPatient1 } from './mockBundles';
// import medXLibraryVersion from './testFixtures/medXLibraryVersion.json';
import { DEFAULT_HOST_URL } from './types';

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
});

// test('api sever', async (t) => {
//   const cqlab = new CQLab({

//   })

//   try {
//     const libraryVersion = await cqlab.fetchLibraryVersionByName({
//       labName: 'cq_learn',
//       libraryName: 'Arithmetic'
//     })

//     const result = libraryVersion.execute(MockPatient1)

//     t.deepEqual(result['AdditionSimple'], 1)

//   } catch (err) {
//     console.error(JSON.stringify(err))
//     t.falsy(err)
//   }

// });
