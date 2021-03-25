[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
{{GITHUB_ACTIONS_BADGES}}

# {{PKG_NAME}}

Arbitrary precision modular arithmetic, cryptographically secure random numbers and strong probable prime generation/testing.

It relies on the native JS implementation of ([BigInt](https://tc39.es/ecma262/#sec-bigint-objects)). It can be used by any [Web Browser or webview supporting BigInt](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt#Browser_compatibility) and with Node.js (>=10.4.0). The bundles can be imported directly by the browser or in Angular projects, React apps, Node.js, etc.

Secure random numbers are generated using the native crypto implementation of the browsers ([Web Cryptography API](https://w3c.github.io/webcrypto/)) or [Node.js Crypto](https://nodejs.org/dist/latest/docs/api/crypto.html)). Strong probable prime generation and testing use Miller-Rabin primality tests and are automatically sped up using parallel workers both in browsers and Node.js.

> The operations supported on BigInts are not constant time. BigInt can be therefore **[unsuitable for use in cryptography](https://www.chosenplaintext.ca/articles/beginners-guide-constant-time-cryptography.html).** Many platforms provide native support for cryptography, such as [Web Cryptography API](https://w3c.github.io/webcrypto/) or [Node.js Crypto](https://nodejs.org/dist/latest/docs/api/crypto.html).

## Usage

`{{PKG_NAME}}` can be imported to your project with `npm`:

```console
npm install {{PKG_NAME}}
```

Then either require (Node.js CJS):

```javascript
const {{PKG_CAMELCASE}} = require('{{PKG_NAME}}')
```

or import (JavaScript ES module):

```javascript
import * as {{PKG_CAMELCASE}} from '{{PKG_NAME}}'
```

The appropriate version for browser or node is automatically exported.

`{{PKG_NAME}}` **CANNOT BE POLYFILLED** to suport older JS version (\< ES2020). If you are using webpack/babel to create your production bundles, you should target only the most modern browsers. For instance, for **React** apps created with [`create-react-app`](https://create-react-app.dev/), you should edit your `package.json` and modify the `browserList` so that it only targets the latest browsers (play with the number of versions that do not need polyfilling):

```json
"browserslist": {
  "production": [
    "last 1 chrome version",
    "last 1 firefox version",
    "last 1 safari version"
  ],
  "development": [
    "last 1 chrome version",
    "last 1 firefox version",
    "last 1 safari version"
  ]
}
```

Also, notice that [BigInt implementation is ES2020](https://tc39.es/ecma262/#sec-bigint-objects). In order to use it with TypeScript you need to set `target` to `ES2020` in your project's `tsconfig.json`.

If you are using Angular, since this library uses node typings, you should also add them to the `angularCompilerOptions` in your `tsconfig.json`:

```json
  "angularCompilerOptions": {
    "types": ["node", ...]
    ...
  }
```

You can also download the {{IIFE_BUNDLE}}, the {{ESM_BUNDLE}} or the {{UMD_BUNDLE}} and manually add it to your project, or, if you have already imported `{{PKG_NAME}}` to your project, just get the bundles from `node_modules/{{PKG_NAME}}/dist/bundles/`.

An example of usage could be:

```typescript
/* A BigInt with value 666 can be declared calling the bigint constructor as
BigInt('666') or with the shorter 666n.
Notice that you can also pass a number to the constructor, e.g. BigInt(666).
However, it is not recommended since values over 2**53 - 1 won't be safe but
no warning will be raised.
*/
const a = BigInt('5')
const b = BigInt('2')
const n = 19n

console.log(bigintCryptoUtils.modPow(a, b, n)) // prints 6

console.log(bigintCryptoUtils.modInv(2n, 5n)) // prints 3

console.log(bigintCryptoUtils.modInv(BigInt('3'), BigInt('5'))) // prints 2

console.log(bigintCryptoUtils.randBetween(2n ** 256n)) // Prints a cryptographically secure random number between 1 and 2**256 bits.

async function primeTesting (): void {
  // Output of a probable prime of 2048 bits
  console.log(await bigintCryptoUtils.prime(2048))

  // Testing if a number is a probable prime (Miller-Rabin)
  const number = 27n
  const isPrime = await bigintCryptoUtils.isProbablyPrime(number)
  if (isPrime === true) {
    console.log(`${number} is prime`)
  } else {
    console.log(`${number} is composite`)
  }
}

primeTesting()

```

## API reference documentation

[Check the API](./docs/API.md)
