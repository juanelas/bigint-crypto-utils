[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

# bigint-crypto-utils

Utils for working with cryptography using native JS ([ES-2020](https://tc39.es/ecma262/#sec-bigint-objects)) implementation of BigInt. It includes some extra functions to work with modular arithmetic along with secure random numbers and a fast strong probable prime generator/tester (parallelized multi-threaded Miller-Rabin primality tests if workers are supported). It can be used by any [Web Browser or webview supporting BigInt](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt#Browser_compatibility) and with Node.js (>=10.4.0).

> The operations supported on BigInts are not constant time. BigInt can be therefore **[unsuitable for use in cryptography](https://www.chosenplaintext.ca/articles/beginners-guide-constant-time-cryptography.html).** Many platforms provide native support for cryptography, such as [Web Cryptography API](https://w3c.github.io/webcrypto/) or [Node.js Crypto](https://nodejs.org/dist/latest/docs/api/crypto.html).

## Installation

bigint-crypto-utils is distributed for [web browsers and/or webviews supporting BigInt](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt#Browser_compatibility) as an ES6 module or an IIFE file; and for Node.js (>=10.4.0), as a CJS module.

bigint-crypto-utils can be imported to your project with `npm`:

```bash
npm install bigint-crypto-utils
```

NPM installation defaults to the ES6 module for browsers and the CJS one for Node.js.

For web browsers, you can also directly download the [IIFE bundle](https://raw.githubusercontent.com/juanelas/bigint-crypto-utils/master/lib/index.browser.bundle.iife.js) or the [ES6 bundle module](https://raw.githubusercontent.com/juanelas/bigint-crypto-utils/master/lib/index.browser.bundle.mod.js) from GitHub.

## Usage examples

Import your module as :

 - Node.js
   ```javascript
   const bigintCryptoUtils = require('bigint-crypto-utils')
   ... // your code here
   ```
 - JavaScript native or TypeScript project
   ```javascript
   import * as bigintCryptoUtils from 'bigint-crypto-utils'
   ... // your code here
   ```
   > BigInt is [ES-2020](https://tc39.es/ecma262/#sec-bigint-objects). In order to use it with TypeScript you should set `lib` (and probably also `target` and `module`) to `esnext` in `tsconfig.json`.
 - JavaScript native browser ES6 mod
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
<dt><a href="#toZn">toZn(a, n)</a> ⇒ <code>bigint</code></dt>
<dd><p>Finds the smallest positive element that is congruent to a in modulo n</p>
</dd>
<dt><a href="#isProbablyPrime">isProbablyPrime(w, [iterations])</a> ⇒ <code>Promise.&lt;boolean&gt;</code></dt>
<dd><p>The test first tries if any of the first 250 small primes are a factor of the input number and then passes several
iterations of Miller-Rabin Probabilistic Primality Test (FIPS 186-4 C.3.1)</p>
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
<dd><p>Returns a cryptographically secure random integer between [min,max]</p>
</dd>
<dt><a href="#randBits">randBits(bitLength, [forceLength])</a> ⇒ <code>Promise.&lt;(Buffer|Uint8Array)&gt;</code></dt>
<dd><p>Secure random bits for both node and browsers. Node version uses crypto.randomFill() and browser one self.crypto.getRandomValues()</p>
<p>Since version 3.0.0 this is an async function and a new randBitsSync function has been added. If you are migrating from version 2 call randBitsSync instead.</p>
</dd>
<dt><a href="#randBitsSync">randBitsSync(bitLength, [forceLength])</a> ⇒ <code>Buffer</code> | <code>Uint8Array</code></dt>
<dd><p>Secure random bits for both node and browsers. Node version uses crypto.randomFill() and browser one self.crypto.getRandomValues()</p>
</dd>
<dt><a href="#randBytes">randBytes(byteLength, [forceLength])</a> ⇒ <code>Promise.&lt;(Buffer|Uint8Array)&gt;</code></dt>
<dd><p>Secure random bytes for both node and browsers. Node version uses crypto.randomFill() and browser one self.crypto.getRandomValues()</p>
</dd>
<dt><a href="#randBytesSync">randBytesSync(byteLength, [forceLength])</a> ⇒ <code>Buffer</code> | <code>Uint8Array</code></dt>
<dd><p>Secure random bytes for both node and browsers. Node version uses crypto.randomFill() and browser one self.crypto.getRandomValues()</p>
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

| Param | Type |
| --- | --- |
| a | <code>number</code> \| <code>bigint</code> | 
| b | <code>number</code> \| <code>bigint</code> | 

<a name="gcd"></a>

### gcd(a, b) ⇒ <code>bigint</code>
Greatest-common divisor of two integers based on the iterative binary algorithm.

**Kind**: global function  
**Returns**: <code>bigint</code> - The greatest common divisor of a and b  

| Param | Type |
| --- | --- |
| a | <code>number</code> \| <code>bigint</code> | 
| b | <code>number</code> \| <code>bigint</code> | 

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
**Returns**: <code>bigint</code> - the inverse modulo n or NaN if it does not exist  

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

<a name="toZn"></a>

### toZn(a, n) ⇒ <code>bigint</code>
Finds the smallest positive element that is congruent to a in modulo n

**Kind**: global function  
**Returns**: <code>bigint</code> - The smallest positive representation of a in modulo n  

| Param | Type | Description |
| --- | --- | --- |
| a | <code>number</code> \| <code>bigint</code> | An integer |
| n | <code>number</code> \| <code>bigint</code> | The modulo |

<a name="isProbablyPrime"></a>

### isProbablyPrime(w, [iterations]) ⇒ <code>Promise.&lt;boolean&gt;</code>
The test first tries if any of the first 250 small primes are a factor of the input number and then passes several
iterations of Miller-Rabin Probabilistic Primality Test (FIPS 186-4 C.3.1)

**Kind**: global function  
**Returns**: <code>Promise.&lt;boolean&gt;</code> - A promise that resolves to a boolean that is either true (a probably prime number) or false (definitely composite)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| w | <code>number</code> \| <code>bigint</code> |  | An integer to be tested for primality |
| [iterations] | <code>number</code> | <code>16</code> | The number of iterations for the primality test. The value shall be consistent with Table C.1, C.2 or C.3 |

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
Returns a cryptographically secure random integer between [min,max]

**Kind**: global function  
**Returns**: <code>bigint</code> - A cryptographically secure random bigint between [min,max]  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| max | <code>bigint</code> |  | Returned value will be <= max |
| [min] | <code>bigint</code> | <code>BigInt(1)</code> | Returned value will be >= min |

<a name="randBits"></a>

### randBits(bitLength, [forceLength]) ⇒ <code>Promise.&lt;(Buffer\|Uint8Array)&gt;</code>
Secure random bits for both node and browsers. Node version uses crypto.randomFill() and browser one self.crypto.getRandomValues()

Since version 3.0.0 this is an async function and a new randBitsSync function has been added. If you are migrating from version 2 call randBitsSync instead.

**Kind**: global function  
**Returns**: <code>Promise.&lt;(Buffer\|Uint8Array)&gt;</code> - A Promise that resolves to a Buffer/UInt8Array (Node.js/Browser) filled with cryptographically secure random bits  
**Since**: 3.0.0  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| bitLength | <code>number</code> |  | The desired number of random bits |
| [forceLength] | <code>boolean</code> | <code>false</code> | If we want to force the output to have a specific bit length. It basically forces the msb to be 1 |

<a name="randBitsSync"></a>

### randBitsSync(bitLength, [forceLength]) ⇒ <code>Buffer</code> \| <code>Uint8Array</code>
Secure random bits for both node and browsers. Node version uses crypto.randomFill() and browser one self.crypto.getRandomValues()

**Kind**: global function  
**Returns**: <code>Buffer</code> \| <code>Uint8Array</code> - A Buffer/UInt8Array (Node.js/Browser) filled with cryptographically secure random bits  
**Since**: 3.0.0  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| bitLength | <code>number</code> |  | The desired number of random bits |
| [forceLength] | <code>boolean</code> | <code>false</code> | If we want to force the output to have a specific bit length. It basically forces the msb to be 1 |

<a name="randBytes"></a>

### randBytes(byteLength, [forceLength]) ⇒ <code>Promise.&lt;(Buffer\|Uint8Array)&gt;</code>
Secure random bytes for both node and browsers. Node version uses crypto.randomFill() and browser one self.crypto.getRandomValues()

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

