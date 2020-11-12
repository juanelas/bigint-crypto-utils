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

   `bigint-crypto-utils` **CANNOT BE POLYFILLED** to suport older browsers. If you are using webpack/babel to create your production bundles, you should target only the most modern browsers. For instance, for **React** apps created with [`create-react-app`](https://create-react-app.dev/), you should edit your `package.json` and modify the `browserList` so that it only targets the latest browsers (play with the number of versions that do not need polyfilling):

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

   Also, notice that [BigInt implementation is ES2020](https://tc39.es/ecma262/#sec-bigint-objects). In order to use it with TypeScript you will probably need to set `lib`, `target` and/or `module` to `es2020` in your project's `tsconfig.json`.

   If you are using Angular, since this library uses node typings, you should also add them to the `angularCompilerOptions` in your `tsconfig.json`:

   ```json
     "angularCompilerOptions": {
       "types": ["node"]
       ...
     }
   ```

- JavaScript native browser ES module

   ```html
   <script type="module">
      import * as bigintCryptoUtils from 'index.browser.bundle.mod.js'  // Use your actual path to the broser mod bundle that is in the lib directory
      ... // your code here
    </script>
   ```

- JavaScript native browser IIFE

   ```html
   <head>
     ...
     <script src="index.browser.bundle.iife.js"></script> <!-- Use your actual path to the browser iife bundle that is in the lib directory -->
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

### Functions

<dl>
<dt><a href="#abs">abs(a)</a> ⇒ <code>bigint</code></dt>
<dd><p>Absolute value. abs(a)==a if a&gt;=0. abs(a)==-a if a&lt;0</p>
</dd>
<dt><a href="#bitLength">bitLength(a)</a> ⇒ <code>number</code></dt>
<dd><p>Returns the bitlength of a number</p>
</dd>
<dt><a href="#eGcd">eGcd(a, b)</a> ⇒ <code><a href="#egcdReturn">egcdReturn</a></code></dt>
<dd><p>An iterative implementation of the extended euclidean algorithm or extended greatest common divisor algorithm.
Take positive integers a, b as input, and return a triple (g, x, y), such that ax + by = g = gcd(a, b).</p>
</dd>
<dt><a href="#gcd">gcd(a, b)</a> ⇒ <code>bigint</code></dt>
<dd><p>Greatest-common divisor of two integers based on the iterative binary algorithm.</p>
</dd>
<dt><a href="#isProbablyPrime">isProbablyPrime(w, [iterations], [disableWorkers])</a> ⇒ <code>Promise.&lt;boolean&gt;</code></dt>
<dd><p>The test first tries if any of the first 250 small primes are a factor of the input number and then passes several
iterations of Miller-Rabin Probabilistic Primality Test (FIPS 186-4 C.3.1)</p>
</dd>
<dt><a href="#lcm">lcm(a, b)</a> ⇒ <code>bigint</code></dt>
<dd><p>The least common multiple computed as abs(a*b)/gcd(a,b)</p>
</dd>
<dt><a href="#max">max(a, b)</a> ⇒ <code>bigint</code></dt>
<dd><p>Maximum. max(a,b)==a if a&gt;=b. max(a,b)==b if a&lt;=b</p>
</dd>
<dt><a href="#min">min(a, b)</a> ⇒ <code>bigint</code></dt>
<dd><p>Minimum. min(a,b)==b if a&gt;=b. min(a,b)==a if a&lt;=b</p>
</dd>
<dt><a href="#modInv">modInv(a, n)</a> ⇒ <code>bigint</code></dt>
<dd><p>Modular inverse.</p>
</dd>
<dt><a href="#modPow">modPow(b, e, n)</a> ⇒ <code>bigint</code></dt>
<dd><p>Modular exponentiation b**e mod n. Currently using the right-to-left binary method</p>
</dd>
<dt><a href="#prime">prime(bitLength, [iterations])</a> ⇒ <code>Promise.&lt;bigint&gt;</code></dt>
<dd><p>A probably-prime (Miller-Rabin), cryptographically-secure, random-number generator.
The browser version uses web workers to parallelise prime look up. Therefore, it does not lock the UI
main process, and it can be much faster (if several cores or cpu are available).
The node version can also use worker_threads if they are available (enabled by default with Node 11 and
and can be enabled at runtime executing node --experimental-worker with node &gt;=10.5.0).</p>
</dd>
<dt><a href="#primeSync">primeSync(bitLength, [iterations])</a> ⇒ <code>bigint</code></dt>
<dd><p>A probably-prime (Miller-Rabin), cryptographically-secure, random-number generator.
The sync version is NOT RECOMMENDED since it won&#39;t use workers and thus it&#39;ll be slower and may freeze thw window in browser&#39;s javascript. Please consider using prime() instead.</p>
</dd>
<dt><a href="#randBetween">randBetween(max, [min])</a> ⇒ <code>bigint</code></dt>
<dd><p>Returns a cryptographically secure random integer between [min,max]. Both numbers must be &gt;=0</p>
</dd>
<dt><a href="#randBits">randBits(bitLength, [forceLength])</a> ⇒ <code>Promise.&lt;(Buffer|Uint8Array)&gt;</code></dt>
<dd><p>Secure random bits for both node and browsers. Node version uses crypto.randomFill() and browser one self.crypto.getRandomValues()</p>
</dd>
<dt><a href="#randBitsSync">randBitsSync(bitLength, [forceLength])</a> ⇒ <code>Buffer</code> | <code>Uint8Array</code></dt>
<dd><p>Secure random bits for both node and browsers. Node version uses crypto.randomFill() and browser one self.crypto.getRandomValues()</p>
</dd>
<dt><a href="#randBytes">randBytes(byteLength, [forceLength])</a> ⇒ <code>Promise.&lt;(Buffer|Uint8Array)&gt;</code></dt>
<dd><p>Secure random bytes for both node and browsers. Node version uses crypto.randomBytes() and browser one self.crypto.getRandomValues()</p>
</dd>
<dt><a href="#randBytesSync">randBytesSync(byteLength, [forceLength])</a> ⇒ <code>Buffer</code> | <code>Uint8Array</code></dt>
<dd><p>Secure random bytes for both node and browsers. Node version uses crypto.randomFill() and browser one self.crypto.getRandomValues()</p>
</dd>
<dt><a href="#toZn">toZn(a, n)</a> ⇒ <code>bigint</code></dt>
<dd><p>Finds the smallest positive element that is congruent to a in modulo n</p>
</dd>
</dl>

### Typedefs

<dl>
<dt><a href="#egcdReturn">egcdReturn</a> : <code>Object</code></dt>
<dd><p>A triple (g, x, y), such that ax + by = g = gcd(a, b).</p>
</dd>
</dl>

<a name="abs"></a>

### abs(a) ⇒ <code>bigint</code>
Absolute value. abs(a)==a if a>=0. abs(a)==-a if a<0

**Kind**: global function  
**Returns**: <code>bigint</code> - the absolute value of a  

| Param | Type |
| --- | --- |
| a | <code>number</code> \| <code>bigint</code> | 

<a name="bitLength"></a>

### bitLength(a) ⇒ <code>number</code>
Returns the bitlength of a number

**Kind**: global function  
**Returns**: <code>number</code> - - the bit length  

| Param | Type |
| --- | --- |
| a | <code>number</code> \| <code>bigint</code> | 

<a name="eGcd"></a>

### eGcd(a, b) ⇒ [<code>egcdReturn</code>](#egcdReturn)
An iterative implementation of the extended euclidean algorithm or extended greatest common divisor algorithm.
Take positive integers a, b as input, and return a triple (g, x, y), such that ax + by = g = gcd(a, b).

**Kind**: global function  
**Returns**: [<code>egcdReturn</code>](#egcdReturn) - A triple (g, x, y), such that ax + by = g = gcd(a, b).  
**Throws**:

- <code>RangeError</code> a and b MUST be > 0


| Param | Type |
| --- | --- |
| a | <code>number</code> \| <code>bigint</code> | 
| b | <code>number</code> \| <code>bigint</code> | 

<a name="egcdReturn"></a>

### egcdReturn : <code>Object</code>
A triple (g, x, y), such that ax + by = g = gcd(a, b).

**Kind**: global typedef  
**Properties**

| Name | Type |
| --- | --- |
| g | <code>bigint</code> | 
| x | <code>bigint</code> | 
| y | <code>bigint</code> | 

<a name="gcd"></a>

### gcd(a, b) ⇒ <code>bigint</code>
Greatest-common divisor of two integers based on the iterative binary algorithm.

**Kind**: global function  
**Returns**: <code>bigint</code> - The greatest common divisor of a and b  

| Param | Type |
| --- | --- |
| a | <code>number</code> \| <code>bigint</code> | 
| b | <code>number</code> \| <code>bigint</code> | 

<a name="isProbablyPrime"></a>

### isProbablyPrime(w, [iterations], [disableWorkers]) ⇒ <code>Promise.&lt;boolean&gt;</code>
The test first tries if any of the first 250 small primes are a factor of the input number and then passes several
iterations of Miller-Rabin Probabilistic Primality Test (FIPS 186-4 C.3.1)

**Kind**: global function  
**Returns**: <code>Promise.&lt;boolean&gt;</code> - A promise that resolves to a boolean that is either true (a probably prime number) or false (definitely composite)  
**Throws**:

- <code>RangeError</code> w MUST be >= 0


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| w | <code>number</code> \| <code>bigint</code> |  | A positive integer to be tested for primality |
| [iterations] | <code>number</code> | <code>16</code> | The number of iterations for the primality test. The value shall be consistent with Table C.1, C.2 or C.3 |
| [disableWorkers] | <code>boolean</code> | <code>false</code> | Disable the use of workers for the primality test |

<a name="lcm"></a>

### lcm(a, b) ⇒ <code>bigint</code>
The least common multiple computed as abs(a*b)/gcd(a,b)

**Kind**: global function  
**Returns**: <code>bigint</code> - The least common multiple of a and b  

| Param | Type |
| --- | --- |
| a | <code>number</code> \| <code>bigint</code> | 
| b | <code>number</code> \| <code>bigint</code> | 

<a name="max"></a>

### max(a, b) ⇒ <code>bigint</code>
Maximum. max(a,b)==a if a>=b. max(a,b)==b if a<=b

**Kind**: global function  
**Returns**: <code>bigint</code> - maximum of numbers a and b  

| Param | Type |
| --- | --- |
| a | <code>number</code> \| <code>bigint</code> | 
| b | <code>number</code> \| <code>bigint</code> | 

<a name="min"></a>

### min(a, b) ⇒ <code>bigint</code>
Minimum. min(a,b)==b if a>=b. min(a,b)==a if a<=b

**Kind**: global function  
**Returns**: <code>bigint</code> - minimum of numbers a and b  

| Param | Type |
| --- | --- |
| a | <code>number</code> \| <code>bigint</code> | 
| b | <code>number</code> \| <code>bigint</code> | 

<a name="modInv"></a>

### modInv(a, n) ⇒ <code>bigint</code>
Modular inverse.

**Kind**: global function  
**Returns**: <code>bigint</code> - the inverse modulo n  
**Throws**:

- <code>RangeError</code> a does not have inverse modulo n


| Param | Type | Description |
| --- | --- | --- |
| a | <code>number</code> \| <code>bigint</code> | The number to find an inverse for |
| n | <code>number</code> \| <code>bigint</code> | The modulo |

<a name="modPow"></a>

### modPow(b, e, n) ⇒ <code>bigint</code>
Modular exponentiation b**e mod n. Currently using the right-to-left binary method

**Kind**: global function  
**Returns**: <code>bigint</code> - b**e mod n  

| Param | Type | Description |
| --- | --- | --- |
| b | <code>number</code> \| <code>bigint</code> | base |
| e | <code>number</code> \| <code>bigint</code> | exponent |
| n | <code>number</code> \| <code>bigint</code> | modulo |

<a name="prime"></a>

### prime(bitLength, [iterations]) ⇒ <code>Promise.&lt;bigint&gt;</code>
A probably-prime (Miller-Rabin), cryptographically-secure, random-number generator.
The browser version uses web workers to parallelise prime look up. Therefore, it does not lock the UI
main process, and it can be much faster (if several cores or cpu are available).
The node version can also use worker_threads if they are available (enabled by default with Node 11 and
and can be enabled at runtime executing node --experimental-worker with node >=10.5.0).

**Kind**: global function  
**Returns**: <code>Promise.&lt;bigint&gt;</code> - A promise that resolves to a bigint probable prime of bitLength bits.  
**Throws**:

- <code>RangeError</code> bitLength MUST be > 0


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
**Throws**:

- <code>RangeError</code> bitLength MUST be > 0


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| bitLength | <code>number</code> |  | The required bit length for the generated prime |
| [iterations] | <code>number</code> | <code>16</code> | The number of iterations for the Miller-Rabin Probabilistic Primality Test |

<a name="randBetween"></a>

### randBetween(max, [min]) ⇒ <code>bigint</code>
Returns a cryptographically secure random integer between [min,max]. Both numbers must be >=0

**Kind**: global function  
**Returns**: <code>bigint</code> - A cryptographically secure random bigint between [min,max]  
**Throws**:

- <code>RangeError</code> Arguments MUST be: max > 0 && min >=0 && max > min


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| max | <code>bigint</code> |  | Returned value will be <= max |
| [min] | <code>bigint</code> | <code>BigInt(1)</code> | Returned value will be >= min |

<a name="randBits"></a>

### randBits(bitLength, [forceLength]) ⇒ <code>Promise.&lt;(Buffer\|Uint8Array)&gt;</code>
Secure random bits for both node and browsers. Node version uses crypto.randomFill() and browser one self.crypto.getRandomValues()

**Kind**: global function  
**Returns**: <code>Promise.&lt;(Buffer\|Uint8Array)&gt;</code> - A Promise that resolves to a Buffer/UInt8Array (Node.js/Browser) filled with cryptographically secure random bits  
**Throws**:

- <code>RangeError</code> bitLength MUST be > 0


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| bitLength | <code>number</code> |  | The desired number of random bits |
| [forceLength] | <code>boolean</code> | <code>false</code> | If we want to force the output to have a specific bit length. It basically forces the msb to be 1 |

<a name="randBitsSync"></a>

### randBitsSync(bitLength, [forceLength]) ⇒ <code>Buffer</code> \| <code>Uint8Array</code>
Secure random bits for both node and browsers. Node version uses crypto.randomFill() and browser one self.crypto.getRandomValues()

**Kind**: global function  
**Returns**: <code>Buffer</code> \| <code>Uint8Array</code> - A Buffer/UInt8Array (Node.js/Browser) filled with cryptographically secure random bits  
**Throws**:

- <code>RangeError</code> bitLength MUST be > 0


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| bitLength | <code>number</code> |  | The desired number of random bits |
| [forceLength] | <code>boolean</code> | <code>false</code> | If we want to force the output to have a specific bit length. It basically forces the msb to be 1 |

<a name="randBytes"></a>

### randBytes(byteLength, [forceLength]) ⇒ <code>Promise.&lt;(Buffer\|Uint8Array)&gt;</code>
Secure random bytes for both node and browsers. Node version uses crypto.randomBytes() and browser one self.crypto.getRandomValues()

**Kind**: global function  
**Returns**: <code>Promise.&lt;(Buffer\|Uint8Array)&gt;</code> - A promise that resolves to a Buffer/UInt8Array (Node.js/Browser) filled with cryptographically secure random bytes  
**Throws**:

- <code>RangeError</code> byteLength MUST be > 0


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| byteLength | <code>number</code> |  | The desired number of random bytes |
| [forceLength] | <code>boolean</code> | <code>false</code> | If we want to force the output to have a bit length of 8*byteLength. It basically forces the msb to be 1 |

<a name="randBytesSync"></a>

### randBytesSync(byteLength, [forceLength]) ⇒ <code>Buffer</code> \| <code>Uint8Array</code>
Secure random bytes for both node and browsers. Node version uses crypto.randomFill() and browser one self.crypto.getRandomValues()

**Kind**: global function  
**Returns**: <code>Buffer</code> \| <code>Uint8Array</code> - A Buffer/UInt8Array (Node.js/Browser) filled with cryptographically secure random bytes  
**Throws**:

- <code>RangeError</code> byteLength MUST be > 0


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| byteLength | <code>number</code> |  | The desired number of random bytes |
| [forceLength] | <code>boolean</code> | <code>false</code> | If we want to force the output to have a bit length of 8*byteLength. It basically forces the msb to be 1 |

<a name="toZn"></a>

### toZn(a, n) ⇒ <code>bigint</code>
Finds the smallest positive element that is congruent to a in modulo n

**Kind**: global function  
**Returns**: <code>bigint</code> - The smallest positive representation of a in modulo n  

| Param | Type | Description |
| --- | --- | --- |
| a | <code>number</code> \| <code>bigint</code> | An integer |
| n | <code>number</code> \| <code>bigint</code> | The modulo |

