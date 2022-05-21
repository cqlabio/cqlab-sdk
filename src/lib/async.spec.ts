import test from 'ava';

import { CQLab } from './CQLab';
import mockPatient1 from './mockBundles/mockPatient1.json'


test('getABC', async (t) => {
  // t.deepEqual(await asyncABC(), ['a', 'b', 'c']);

  // t.deepEqual(6, 1)
  
  const cqlab = new CQLab({
    hostUrl: 'http://localhost:3333',
    apiToken: 'none'
  })

  const libraryVersion = await cqlab.fetchLibraryVersionByName({
    labName: 'learn',
    libraryName: 'Arithmetic'
  })

  const result = libraryVersion.execute(mockPatient1)


  t.deepEqual(result['AdditionSimple'], 1)
  // t.deepEqual(6, 1)
  // expect(result).toBeTruthy()

});
