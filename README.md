# CQLab Typescript SDK

The CQLab SDK is the official TypeScript SDK for [cqlab.io](https://cqlab.io).

CQLab is a platform for building, testing, and publishing clinical artifacts built according to [HL7 FHIR](https://fhir.org/) standards.

This SDK provides a convenience wrapper around the CQLab REST API to query artifacts such as [CQL](https://cql.hl7.org/) Files, [Value Sets](https://www.hl7.org/fhir/valueset.html), and FHIR Test Data. It also provides support for executing CQL against FHIR patient bundles using [cql-execution](https://github.com/cqframework/cql-execution).

## QuickStart: Starter Template for TypeScript Execution

To quickly try out the SDK, clone this environment with TypeScript and ES6 already prepared: [cqlab-sdk-usage-example](https://github.com/cqlabio/cqlab-sdk-usage-example)

### Code Generation

The CQLab UI generates SDK code for CQL, ValueSets and TestData. Learn more using a detailed walkthrough available in the [docs](https://cqlab.io).

## Installation

```sh
npm install @cqlab/sdk
```

## CQL Library Fetch and Execution

Execute CQL in just 3 lines of code. We'll use the example from the walkthrough to illustrate.

```js
import { CQLab, MockPatient1 } from '@cqlab/sdk';

const cqlab = new CQLab();

/** Make sure to wrap await call in an async function */
const libraryVersion = await cqlab.fetchLibraryVersionByName({
  labName: 'cq_examples',
  libraryName: 'CheckMedX',
  version: '0.0.1',
});

/** Execute your CQL. */
const result = libraryVersion.execute(MockPatient1);
console.log(result['Is Male']);
```

1. Instantiate the CQLab instance

```js
const cqlab = new CQLab();
```

Be sure to provide an apiToken if this is a private resource.

```js
const cqlab = new CQLab({ apiToken: 'my-token-1234' });
```

2. Next we fetch a specific version of a CQL Library for execution.

```js
const libraryVersion = await cqlab.fetchLibraryVersionByName({
  labName: 'cq_examples',
  libraryName: 'CheckMedX',
  version: '0.0.1',
});
```

Alternatively we can fetch the libraryVersion by id

```js
const libraryVersion = await cqlab.fetchByLibraryVersionId(
  '28d822ec-96d2-44a0-b5cd-c5312afb549a'
);
```

Or use promise syntax:

```js
cqlab
  .fetchLibraryVersionByName({
    labName: 'cq_examples',
    libraryName: 'CheckMedX',
    version: '0.0.1',
  })
  .then((libraryVersion) => {
    console.log(libraryVersion);
  });
```

3. We execute using a provided MockPatient bundle. Replace with your own FHIR data. Access each CQL statement execution result in the dictionary.

```js
const result = libraryVersion.execute(MockPatient1))
console.log(result['Is Male']);
```

## Value Set Fetch

Fetch value set versions using the ID.

```js
import { CQLab } from '@cqlab/sdk';
const cqlab = new CQLab();

/** Fetch your Value Set Version By ID */
const valueSetVersion = await cqlab.fetchValueSetVersionById(
  '64331f0c-c00b-4ba0-a02c-f5e4cbad053f'
);

/** Access the codes */
const codes = valueSetVersion.getCodes();
console.log(codes);
```

## Test Data Fetch

```js
import { CQLab } from '@cqlab/sdk';
const cqlab = new CQLab();

/** Fetch your Test Data By ID */
const testData = await cqlab.fetchTestDataById(
  'ee69fddd-0142-46c4-936b-e4b447d83018'
);

/** Access the data */
const data = testData.getData();

console.log(data);
```

### This repo was cloned from starter pack:

Typescript-starter: https://github.com/bitjson/typescript-starter
