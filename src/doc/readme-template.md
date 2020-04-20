[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
{{GITHUB_ACTIONS_BADGES}}

# {{PKG_NAME}}

Arbitrary precision modular arithmetic, cryptographically secure random numbers and strong probable prime generation/testing.

It relies on the native JS implementation of ([BigInt](https://tc39.es/ecma262/#sec-bigint-objects)). It can be used by any [Web Browser or webview supporting BigInt](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt#Browser_compatibility) and with Node.js (>=10.4.0). The bundles can be imported directly by the browser or in Angular projects, React apps, Node.js, etc.

Secure random numbers are generated using the native crypto implementation of the browsers ([Web Cryptography API](https://w3c.github.io/webcrypto/)) or [Node.js Crypto](https://nodejs.org/dist/latest/docs/api/crypto.html)). Strong probable prime generation and testing use Miller-Rabin primality tests and are automatically sped up using parallel workers both in browsers and Node.js. 

> The operations supported on BigInts are not constant time. BigInt can be therefore **[unsuitable for use in cryptography](https://www.chosenplaintext.ca/articles/beginners-guide-constant-time-cryptography.html).** Many platforms provide native support for cryptography, such as [Web Cryptography API](https://w3c.github.io/webcrypto/) or [Node.js Crypto](https://nodejs.org/dist/latest/docs/api/crypto.html).

## Installation

{{PKG_NAME}} is distributed for [web browsers and/or webviews supporting BigInt](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt#Browser_compatibility) as an ES6 module or an IIFE file; and for Node.js (>=10.4.0), as a CJS module.

{{PKG_NAME}} can be imported to your project with `npm`:

```bash
npm install {{PKG_NAME}}
```

NPM installation defaults to the ES6 module for browsers and the CJS one for Node.js. For web browsers, you can also directly download the {{IIFE_BUNDLE}} or the {{ESM_BUNDLE}} from the repository.

## Usage examples

Import your module as :

 - Node.js
   ```javascript
   const bigintCryptoUtils = require('bigint-crypto-utils')
   ... // your code here
   ```
 - JavaScript native or TypeScript project (including React and Angular JS)
   ```javascript
   import * as bigintCryptoUtils from 'bigint-crypto-utils'
   ... // your code here
   ```
   BigInt is [ES-2020](https://tc39.es/ecma262/#sec-bigint-objects). In order to use it with TypeScript you should set `lib` (and probably also `target` and `module`) to `esnext` in `tsconfig.json`.
   `{{PKG_NAME}}` **CANNOT BE POLYFILLED** to suport older browsers. If you are using webpack/babel to create your production bundles, you should target only the most modern browsers. For instance, for **React** apps created with [`create-react-app`](https://create-react-app.dev/), you should edit your `package.json` and modify the `browserList` so that it only targets the latest browsers (supporting the latest features):
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
   Also, notice that BigInt is [ES-2020](https://tc39.es/ecma262/#sec-bigint-objects). In order to use it with TypeScript you should set `lib` (and probably also `target` and `module`) to `esnext` in `tsconfig.json`.

 - JavaScript native browser ES module
   ```html
   <script type="module">
      import * as bigintCryptoUtils from 'lib/index.browser.bundle.mod.js'  // Use you actual path to the broser mod bundle
      ... // your code here
    </script>
   ```
 - JavaScript native browser IIFE
   ```html
   <head>
     ...
     <script src="../../lib/index.browser.bundle.js"></script> <!-- Use you actual path to the browser bundle -->
   </head>
   <body>
     ...
     <script>
       ... // your code here
     </script>
   </body>
   ```

An example of usage could be:

```javascript
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

async function primeTesting () {
  // Output of a probable prime of 2048 bits
  console.log(await bigintCryptoUtils.prime(2048))

  // Testing if a number is a probable prime (Miller-Rabin)
  const number = 27n
  const isPrime = await bigintCryptoUtils.isProbablyPrime(number)
  if (isPrime) {
    console.log(`${number} is prime`)
  } else {
    console.log(`${number} is composite`)
  }
}

primeTesting()

```

You can find examples in the [examples folder of the repository](https://github.com/juanelas/bigint-crypto-utils/tree/master/examples).


## API reference documentation

{{>main}}
