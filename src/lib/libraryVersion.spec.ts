import test from 'ava';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

import { CQLab } from './CQLab';
import { LibraryVersion } from './libraryVersion';
// import {DEFAULT_HOST_URL } from './constants'
import { MockPatient1 } from './mockBundles';
import medXExecutionContext from './testFixtures/medXExecutionContext.json';
import medXLibraryVersion from './testFixtures/medXLibraryVersion.json';

// This sets the mock adapter on the default instance

const MOCK_BASE = 'http://mock-api';

test('getLibraryVersionByName', async (t) => {
  const cqlab = new CQLab({
    hostUrl: MOCK_BASE,
  });

  const mock = new MockAdapter(cqlab.axiosInstance);

  mock
    .onGet(`${MOCK_BASE}/v1/library-versions/search-one`, {
      params: {
        labName: 'learn',
        libraryName: 'MedX',
        version: 'Draft',
      },
    })
    .reply(200, medXLibraryVersion);

  const libraryVersion = new LibraryVersion({ config: cqlab });

  await libraryVersion.fetchByName({
    labName: 'learn',
    libraryName: 'MedX',
    version: 'Draft',
  });

  t.deepEqual(libraryVersion._libraryVersion, medXLibraryVersion);
});

test('fetchExecutionContext', async (t) => {
  const cqlab = new CQLab({
    hostUrl: MOCK_BASE,
  });

  const mock = new MockAdapter(cqlab.axiosInstance);

  mock
    .onGet(
      `${MOCK_BASE}/v1/library-versions/${medXLibraryVersion.id}/execution-context`
    )
    .reply(200, medXExecutionContext);

  const libraryVersion = new LibraryVersion({ config: cqlab });

  libraryVersion._libraryVersion = medXLibraryVersion;

  await libraryVersion.fetchExecutionContext();

  const results = libraryVersion.execute(MockPatient1);

  t.deepEqual(results['Is Male'], true);
  t.deepEqual(results['Patient is Over 18 Years Old'], true);
});
