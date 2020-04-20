[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
![Node CI](https://github.com/juanelas/bigint-crypto-utils/workflows/Node%20CI/badge.svg)
[![Coverage Status](https://coveralls.io/repos/github/juanelas/bigint-crypto-utils/badge.svg?branch=master)](https://coveralls.io/github/juanelas/bigint-crypto-utils?branch=master)

# bigint-crypto-utils

Arbitrary precision modular arithmetic, cryptographically secure random numbers and strong probable prime generation/testing.

It relies on the native JS implementation of ([BigInt](https://tc39.es/ecma262/#sec-bigint-objects)). It can be used by any [Web Browser or webview supporting BigInt](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt#Browser_compatibility) and with Node.js (>=10.4.0). The bundles can be imported directly by the browser or in Angular projects, React apps, Node.js, etc.

Secure random numbers are generated using the native crypto implementation of the browsers ([Web Cryptography API](https://w3c.github.io/webcrypto/)) or [Node.js Crypto](https://nodejs.org/dist/latest/docs/api/crypto.html)). Strong probable prime generation and testing use Miller-Rabin primality tests and are automatically sped up using parallel workers both in browsers and Node.js. 

> The operations supported on BigInts are not constant time. BigInt can be therefore **[unsuitable for use in cryptography](https://www.chosenplaintext.ca/articles/beginners-guide-constant-time-cryptography.html).** Many platforms provide native support for cryptography, such as [Web Cryptography API](https://w3c.github.io/webcrypto/) or [Node.js Crypto](https://nodejs.org/dist/latest/docs/api/crypto.html).

## Installation

bigint-crypto-utils is distributed for [web browsers and/or webviews supporting BigInt](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt#Browser_compatibility) as an ES6 module or an IIFE file; and for Node.js (>=10.4.0), as a CJS module.

bigint-crypto-utils can be imported to your project with `npm`:

```bash
npm install bigint-crypto-utils
```

NPM installation defaults to the ES6 module for browsers and the CJS one for Node.js. For web browsers, you can also directly download the [IIFE bundle](https://raw.githubusercontent.com/juanelas/bigint-crypto-utils/master/lib/index.browser.bundle.iife.js) or the [ESM bundle](https://raw.githubusercontent.com/juanelas/bigint-crypto-utils/master/lib/index.browser.bundle.mod.js) from the repository.

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
   `bigint-crypto-utils` **CANNOT BE POLYFILLED** to suport older browsers. If you are using webpack/babel to create your production bundles, you should target only the most modern browsers. For instance, for **React** apps created with [`create-react-app`](https://create-react-app.dev/), you should edit your `package.json` and modify the `browserList` so that it only targets the latest browsers (supporting the latest features):
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

<a name="isProbablyPrime"></a>

### isProbablyPrime(w, [iterations], [disableWorkers]) ⇒ <code>Promise.&lt;boolean&gt;</code>
The test first tries if any of the first 250 small primes are a factor of the input number and then passes several
iterations of Miller-Rabin Probabilistic Primality Test (FIPS 186-4 C.3.1)

**Kind**: global function  
**Returns**: <code>Promise.&lt;boolean&gt;</code> - A promise that resolves to a boolean that is either true (a probably prime number) or false (definitely composite)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| w | <code>number</code> \| <code>bigint</code> |  | An integer to be tested for primality |
| [iterations] | <code>number</code> | <code>16</code> | The number of iterations for the primality test. The value shall be consistent with Table C.1, C.2 or C.3 |
| [disableWorkers] | <code>boolean</code> | <code>false</code> | Disable the use of workers for the primality test |

<a name="prime"></a>

### prime(bitLength, [iterations]) ⇒ <code>Promise.&lt;bigint&gt;</code>
A probably-prime (Miller-Rabin), cryptographically-secure, random-number generator.
The browser version uses web workers to parallelise prime look up. Therefore, it does not lock the UI
main process, and it can be much faster (if several cores or cpu are available).
The node version can also use worker_threads if they are available (enabled by default with Node 11 and
and can be enabled at runtime executing node --experimental-worker with node >=10.5.0).

**Kind**: global function  
**Returns**: <code>Promise.&lt;bigint&gt;</code> - A promise that resolves to a bigint probable prime of bitLength bits.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| bitLength | <code>number</code> |  | The required bit length for the generated prime |
| [iterations] | <code>number</code> | <code>16</code> | The number of iterations for the Miller-Rabin Probabilistic Primality Test |

<a name="primeSync"></a>

### primeSync(bitLength, [iterations]) ⇒ <code>bigint</code>
A probably-prime (Miller-Rabin), cryptographically-secure, random-number generator.
The sync version is NOT RECOMMENDED since it won't use workers and thus it'll be slower and may freeze thw window in browser's javascript. Please consider using prime() instead.

**Kind**: global function  
**Returns**: <code>bigint</code> - A bigint probable prime of bitLength bits.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| bitLength | <code>number</code> |  | The required bit length for the generated prime |
| [iterations] | <code>number</code> | <code>16</code> | The number of iterations for the Miller-Rabin Probabilistic Primality Test |

<a name="randBetween"></a>

### randBetween(max, [min]) ⇒ <code>bigint</code>
Returns a cryptographically secure random integer between [min,max]. Both numbers must be >=0

**Kind**: global function  
**Returns**: <code>bigint</code> - A cryptographically secure random bigint between [min,max]  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| max | <code>bigint</code> |  | Returned value will be <= max |
| [min] | <code>bigint</code> | <code>BigInt(1)</code> | Returned value will be >= min |

<a name="randBits"></a>

### randBits(bitLength, [forceLength]) ⇒ <code>Promise.&lt;(Buffer\|Uint8Array)&gt;</code>
Secure random bits for both node and browsers. Node version uses crypto.randomFill() and browser one self.crypto.getRandomValues()

**Kind**: global function  
**Returns**: <code>Promise.&lt;(Buffer\|Uint8Array)&gt;</code> - A Promise that resolves to a Buffer/UInt8Array (Node.js/Browser) filled with cryptographically secure random bits  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| bitLength | <code>number</code> |  | The desired number of random bits |
| [forceLength] | <code>boolean</code> | <code>false</code> | If we want to force the output to have a specific bit length. It basically forces the msb to be 1 |

<a name="randBitsSync"></a>

### randBitsSync(bitLength, [forceLength]) ⇒ <code>Buffer</code> \| <code>Uint8Array</code>
Secure random bits for both node and browsers. Node version uses crypto.randomFill() and browser one self.crypto.getRandomValues()

**Kind**: global function  
**Returns**: <code>Buffer</code> \| <code>Uint8Array</code> - A Buffer/UInt8Array (Node.js/Browser) filled with cryptographically secure random bits  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| bitLength | <code>number</code> |  | The desired number of random bits |
| [forceLength] | <code>boolean</code> | <code>false</code> | If we want to force the output to have a specific bit length. It basically forces the msb to be 1 |

<a name="randBytes"></a>

### randBytes(byteLength, [forceLength]) ⇒ <code>Promise.&lt;(Buffer\|Uint8Array)&gt;</code>
Secure random bytes for both node and browsers. Node version uses crypto.randomBytes() and browser one self.crypto.getRandomValues()

**Kind**: global function  
**Returns**: <code>Promise.&lt;(Buffer\|Uint8Array)&gt;</code> - A promise that resolves to a Buffer/UInt8Array (Node.js/Browser) filled with cryptographically secure random bytes  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| byteLength | <code>number</code> |  | The desired number of random bytes |
| [forceLength] | <code>boolean</code> | <code>false</code> | If we want to force the output to have a bit length of 8*byteLength. It basically forces the msb to be 1 |

<a name="randBytesSync"></a>

### randBytesSync(byteLength, [forceLength]) ⇒ <code>Buffer</code> \| <code>Uint8Array</code>
Secure random bytes for both node and browsers. Node version uses crypto.randomFill() and browser one self.crypto.getRandomValues()

**Kind**: global function  
**Returns**: <code>Buffer</code> \| <code>Uint8Array</code> - A Buffer/UInt8Array (Node.js/Browser) filled with cryptographically secure random bytes  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| byteLength | <code>number</code> |  | The desired number of random bytes |
| [forceLength] | <code>boolean</code> | <code>false</code> | If we want to force the output to have a bit length of 8*byteLength. It basically forces the msb to be 1 |

