import { CQLab } from "../src/cqlab-sdk"
const testData = require('../src/exampleBundles/exampleOne.json') 
/**
 * Dummy test
 */
describe("Dummy test", () => {
  it("works if true is truthy", () => {
    expect(true).toBeTruthy()
  })

  it("DummyClass is instantiable", async () => {

    const cqlab = new CQLab({
      hostUrl: 'http://localhost:3333',
      apiToken: 'none'
    })

    const libraryVersion = await cqlab.fetchLibraryVersionByName({
      labName: 'learn',
      libraryName: 'FHIRQuery'
    })

    const results = libraryVersion.execute([testData])

    expect(results).toBeTruthy()

    // expect(new DummyClass()).toBeInstanceOf(DummyClass)
  })
})
