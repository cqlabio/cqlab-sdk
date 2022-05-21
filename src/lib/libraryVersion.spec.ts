import test from 'ava';
import MockAdapter from 'axios-mock-adapter';

import { CQLab } from './CQLab';
import { LibraryVersion } from './libraryVersion';
import { MockPatient1 } from './mockBundles';
import medXExecutionContext from './testFixtures/medXExecutionContext.json';
import medXLibraryVersion from './testFixtures/medXLibraryVersion.json';

const MOCK_BASE = 'http://mock-api';

test('getLibraryVersionById', async (t) => {
  const cqlab = new CQLab({
    hostUrl: MOCK_BASE,
  });

  const mock = new MockAdapter(cqlab.axiosInstance);

  const FAKE_ID = '1234';

  mock
    .onGet(`${MOCK_BASE}/v1/library-versions/${FAKE_ID}`)
    .reply(200, medXLibraryVersion);

  const libraryVersion = new LibraryVersion({ config: cqlab });

  await libraryVersion.loadMetaById(FAKE_ID);

  t.deepEqual(libraryVersion._libraryVersion, medXLibraryVersion);
});

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

  await libraryVersion.loadMetaByName({
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

  libraryVersion._id = medXLibraryVersion.id;

  await libraryVersion.loadExecutionContext();

  t.deepEqual(libraryVersion._executionContext, medXExecutionContext);
});

test('should execute correctly', async (t) => {
  const cqlab = new CQLab({
    hostUrl: MOCK_BASE,
  });

  const libraryVersion = new LibraryVersion({ config: cqlab });

  libraryVersion._libraryVersion = medXLibraryVersion;
  libraryVersion._executionContext = medXExecutionContext;

  const results = libraryVersion.execute(MockPatient1);

  t.deepEqual(results['Is Male'], true);
  t.deepEqual(results['Patient is Over 18 Years Old'], true);
});
