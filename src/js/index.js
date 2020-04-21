import { bitLength, eGcd, modInv, modPow, toZn } from 'bigint-mod-arith'
/* istanbul ignore next */
export { abs, bitLength, eGcd, gcd, lcm, max, min, modInv, modPow, toZn } from 'bigint-mod-arith' // already tested for coverage

/**
 * The test first tries if any of the first 250 small primes are a factor of the input number and then passes several
 * iterations of Miller-Rabin Probabilistic Primality Test (FIPS 186-4 C.3.1)
 *
 * @param {number | bigint} w An integer to be tested for primality
 * @param {number} [iterations = 16] The number of iterations for the primality test. The value shall be consistent with Table C.1, C.2 or C.3
 * @param {boolean} [disableWorkers = false] Disable the use of workers for the primality test
 *
 * @returns {Promise<boolean>} A promise that resolves to a boolean that is either true (a probably prime number) or false (definitely composite)
 */
export function isProbablyPrime (w, iterations = 16, disableWorkers = false) {
  if (typeof w === 'number') {
    w = BigInt(w)
  }
  /* eslint-disable no-lone-blocks */
  if (!process.browser) { // Node.js
    /* istanbul ignore else */
    if (!disableWorkers && _useWorkers) {
      const { Worker } = require('worker_threads')
      return new Promise((resolve, reject) => {
        const worker = new Worker(__filename)

        worker.on('message', (data) => {
          worker.terminate()
          resolve(data.isPrime)
        })

        worker.on('error', reject)

        worker.postMessage({
          rnd: w,
          iterations: iterations,
          id: 0
        })
      })
    } else {
      return new Promise((resolve) => {
        resolve(_isProbablyPrime(w, iterations))
      })
    }
  } else { // browser
    return new Promise((resolve, reject) => {
      const worker = new Worker(_isProbablyPrimeWorkerUrl())

      worker.onmessage = (event) => {
        worker.terminate()
        resolve(event.data.isPrime)
      }

      worker.onmessageerror = (event) => {
        reject(event)
      }

      worker.postMessage({
        rnd: w,
        iterations: iterations,
        id: 0
      })
    })
  }
  /* eslint-enable no-lone-blocks */
}

/**
 * A probably-prime (Miller-Rabin), cryptographically-secure, random-number generator.
 * The browser version uses web workers to parallelise prime look up. Therefore, it does not lock the UI
 * main process, and it can be much faster (if several cores or cpu are available).
 * The node version can also use worker_threads if they are available (enabled by default with Node 11 and
 * and can be enabled at runtime executing node --experimental-worker with node >=10.5.0).
 *
 * @param {number} bitLength The required bit length for the generated prime
 * @param {number} [iterations = 16] The number of iterations for the Miller-Rabin Probabilistic Primality Test
 *
 * @returns {Promise<bigint>} A promise that resolves to a bigint probable prime of bitLength bits.
 */
export function prime (bitLength, iterations = 16) {
  if (bitLength < 1) throw new RangeError('bitLength MUST be > 0')

  /* istanbul ignore if */
  if (!_useWorkers) { // If there is no support for workers
    let rnd = 0n
    do {
      rnd = fromBuffer(randBitsSync(bitLength, true))
    } while (!_isProbablyPrime(rnd, iterations))
    return new Promise((resolve) => { resolve(rnd) })
  }
  return new Promise((resolve) => {
    const workerList = []
    const _onmessage = (msg, newWorker) => {
      if (msg.isPrime) {
        // if a prime number has been found, stop all the workers, and return it
        for (let j = 0; j < workerList.length; j++) {
          workerList[j].terminate()
        }
        while (workerList.length) {
          workerList.pop()
        }
        resolve(msg.value)
      } else { // if a composite is found, make the worker test another random number
        const buf = randBitsSync(bitLength, true)
        const rnd = fromBuffer(buf)
        try {
          newWorker.postMessage({
            rnd: rnd,
            iterations: iterations,
            id: msg.id
          })
        } catch (error) {
          // The worker has already terminated. There is nothing to handle here
        }
      }
    }
    /* eslint-disable no-lone-blocks */
    if (process.browser) { // browser
      const workerURL = _isProbablyPrimeWorkerUrl()
      for (let i = 0; i < self.navigator.hardwareConcurrency - 1; i++) {
        const newWorker = new Worker(workerURL)
        newWorker.onmessage = (event) => _onmessage(event.data, newWorker)
        workerList.push(newWorker)
      }
    } else { // Node.js
      const { cpus } = require('os')
      const { Worker } = require('worker_threads')
      for (let i = 0; i < cpus().length - 1; i++) {
        const newWorker = new Worker(__filename)
        newWorker.on('message', (msg) => _onmessage(msg, newWorker))
        workerList.push(newWorker)
      }
    }
    /* eslint-enable no-lone-blocks */
    for (let i = 0; i < workerList.length; i++) {
      randBits(bitLength, true).then(function (buf) {
        const rnd = fromBuffer(buf)
        workerList[i].postMessage({
          rnd: rnd,
          iterations: iterations,
          id: i
        })
      })
    }
  })
}

/**
 * A probably-prime (Miller-Rabin), cryptographically-secure, random-number generator.
 * The sync version is NOT RECOMMENDED since it won't use workers and thus it'll be slower and may freeze thw window in browser's javascript. Please consider using prime() instead.
 *
 * @param {number} bitLength The required bit length for the generated prime
 * @param {number} [iterations = 16] The number of iterations for the Miller-Rabin Probabilistic Primality Test
 *
 * @returns {bigint} A bigint probable prime of bitLength bits.
 */
export function primeSync (bitLength, iterations = 16) {
  if (bitLength < 1) throw new RangeError('bitLength MUST be > 0')
  let rnd = 0n
  do {
    rnd = fromBuffer(randBitsSync(bitLength, true))
  } while (!_isProbablyPrime(rnd, iterations))
  return rnd
}

/**
 * Returns a cryptographically secure random integer between [min,max]. Both numbers must be >=0
 * @param {bigint} max Returned value will be <= max
 * @param {bigint} [min = BigInt(1)] Returned value will be >= min
 *
 * @returns {bigint} A cryptographically secure random bigint between [min,max]
 */
export function randBetween (max, min = 1n) {
  if (max <= 0n || min < 0n || max <= min) throw new RangeError('inputs should be max > 0, min >= 0; max > min')
  const interval = max - min
  const bitLen = bitLength(interval)
  let rnd
  do {
    const buf = randBitsSync(bitLen)
    rnd = fromBuffer(buf)
  } while (rnd > interval)
  return rnd + min
}

/**
 * Secure random bits for both node and browsers. Node version uses crypto.randomFill() and browser one self.crypto.getRandomValues()
 *
 * @param {number} bitLength The desired number of random bits
 * @param {boolean} [forceLength = false] If we want to force the output to have a specific bit length. It basically forces the msb to be 1
 *
 * @returns {Promise<Buffer | Uint8Array>} A Promise that resolves to a Buffer/UInt8Array (Node.js/Browser) filled with cryptographically secure random bits
 */
export function randBits (bitLength, forceLength = false) {
  if (bitLength < 1) throw new RangeError('bitLength MUST be > 0')

  const byteLength = Math.ceil(bitLength / 8)
  const bitLengthMod8 = bitLength % 8

  return new Promise((resolve) => {
    randBytes(byteLength, false).then(function (rndBytes) {
      if (bitLengthMod8) {
        // Fill with 0's the extra bits
        rndBytes[0] = rndBytes[0] & (2 ** bitLengthMod8 - 1)
      }
      if (forceLength) {
        const mask = bitLengthMod8 ? 2 ** (bitLengthMod8 - 1) : 128
        rndBytes[0] = rndBytes[0] | mask
      }
      resolve(rndBytes)
    })
  })
}

/**
 * Secure random bits for both node and browsers. Node version uses crypto.randomFill() and browser one self.crypto.getRandomValues()
 * @param {number} bitLength The desired number of random bits
 * @param {boolean} [forceLength = false] If we want to force the output to have a specific bit length. It basically forces the msb to be 1
 *
 * @returns {Buffer | Uint8Array} A Buffer/UInt8Array (Node.js/Browser) filled with cryptographically secure random bits
 */
export function randBitsSync (bitLength, forceLength = false) {
  if (bitLength < 1) throw new RangeError('bitLength MUST be > 0')

  const byteLength = Math.ceil(bitLength / 8)
  const rndBytes = randBytesSync(byteLength, false)
  const bitLengthMod8 = bitLength % 8
  if (bitLengthMod8) {
    // Fill with 0's the extra bits
    rndBytes[0] = rndBytes[0] & (2 ** bitLengthMod8 - 1)
  }
  if (forceLength) {
    const mask = bitLengthMod8 ? 2 ** (bitLengthMod8 - 1) : 128
    rndBytes[0] = rndBytes[0] | mask
  }
  return rndBytes
}

/**
 * Secure random bytes for both node and browsers. Node version uses crypto.randomBytes() and browser one self.crypto.getRandomValues()
 *
 * @param {number} byteLength The desired number of random bytes
 * @param {boolean} [forceLength = false] If we want to force the output to have a bit length of 8*byteLength. It basically forces the msb to be 1
 *
 * @returns {Promise<Buffer | Uint8Array>} A promise that resolves to a Buffer/UInt8Array (Node.js/Browser) filled with cryptographically secure random bytes
 */
export function randBytes (byteLength, forceLength = false) {
  if (byteLength < 1) throw new RangeError('byteLength MUST be > 0')

  return new Promise(function (resolve, reject) {
    /* eslint-disable no-lone-blocks */
    if (!process.browser) {
      const crypto = require('crypto')
      crypto.randomBytes(byteLength, function (err, buf) {
        /* istanbul ignore if */
        if (err) reject(err)
        // If fixed length is required we put the first bit to 1 -> to get the necessary bitLength
        if (forceLength) buf[0] = buf[0] | 128
        resolve(buf)
      })
    } else { // browser
      const buf = new Uint8Array(byteLength)
      self.crypto.getRandomValues(buf)
      // If fixed length is required we put the first bit to 1 -> to get the necessary bitLength
      if (forceLength) buf[0] = buf[0] | 128
      resolve(buf)
    }
    /* eslint-enable no-lone-blocks */
  })
}

/**
 * Secure random bytes for both node and browsers. Node version uses crypto.randomFill() and browser one self.crypto.getRandomValues()
 *
 * @param {number} byteLength The desired number of random bytes
 * @param {boolean} [forceLength = false] If we want to force the output to have a bit length of 8*byteLength. It basically forces the msb to be 1
 *
 * @returns {Buffer | Uint8Array} A Buffer/UInt8Array (Node.js/Browser) filled with cryptographically secure random bytes
 */
export function randBytesSync (byteLength, forceLength = false) {
  if (byteLength < 1) throw new RangeError('byteLength MUST be > 0')

  /* eslint-disable no-lone-blocks */
  if (!process.browser) { // node
    const crypto = require('crypto')
    const buf = crypto.randomBytes(byteLength)
    // If fixed length is required we put the first bit to 1 -> to get the necessary bitLength
    if (forceLength) buf[0] = buf[0] | 128
    return buf
  } else { // browser
    const buf = new Uint8Array(byteLength)
    self.crypto.getRandomValues(buf)
    // If fixed length is required we put the first bit to 1 -> to get the necessary bitLength
    if (forceLength) buf[0] = buf[0] | 128
    return buf
  }
  /* eslint-enable no-lone-blocks */
}

/* HELPER FUNCTIONS */

function fromBuffer (buf) {
  let ret = 0n
  for (const i of buf.values()) {
    const bi = BigInt(i)
    ret = (ret << BigInt(8)) + bi
  }
  return ret
}

function _isProbablyPrimeWorkerUrl () {
  // Let's us first add all the required functions
  let workerCode = `'use strict';const ${eGcd.name}=${eGcd.toString()};const ${modInv.name}=${modInv.toString()};const ${modPow.name}=${modPow.toString()};const ${toZn.name}=${toZn.toString()};const ${randBitsSync.name}=${randBitsSync.toString()};const ${randBytesSync.name}=${randBytesSync.toString()};const ${randBetween.name}=${randBetween.toString()};const ${isProbablyPrime.name}=${_isProbablyPrime.toString()};${bitLength.toString()}${fromBuffer.toString()}`

  const onmessage = async function (event) { // Let's start once we are called
    // event.data = {rnd: <bigint>, iterations: <number>}
    const isPrime = await isProbablyPrime(event.data.rnd, event.data.iterations)
    postMessage({
      isPrime: isPrime,
      value: event.data.rnd,
      id: event.data.id
    })
  }

  workerCode += `onmessage = ${onmessage.toString()};`

  return _workerUrl(workerCode)
}

function _workerUrl (workerCode) {
  workerCode = `(() => {${workerCode}})()` // encapsulate IIFE
  const _blob = new Blob([workerCode], { type: 'text/javascript' })
  return window.URL.createObjectURL(_blob)
}

function _isProbablyPrime (w, iterations = 16) {
  /*
  PREFILTERING. Even values but 2 are not primes, so don't test.
  1 is not a prime and the M-R algorithm needs w>1.
  */
  if (w === 2n) return true
  else if ((w & 1n) === 0n || w === 1n) return false

  /*
    Test if any of the first 250 small primes are a factor of w. 2 is not tested because it was already tested above.
    */
  const firstPrimes = [
    3n,
    5n,
    7n,
    11n,
    13n,
    17n,
    19n,
    23n,
    29n,
    31n,
    37n,
    41n,
    43n,
    47n,
    53n,
    59n,
    61n,
    67n,
    71n,
    73n,
    79n,
    83n,
    89n,
    97n,
    101n,
    103n,
    107n,
    109n,
    113n,
    127n,
    131n,
    137n,
    139n,
    149n,
    151n,
    157n,
    163n,
    167n,
    173n,
    179n,
    181n,
    191n,
    193n,
    197n,
    199n,
    211n,
    223n,
    227n,
    229n,
    233n,
    239n,
    241n,
    251n,
    257n,
    263n,
    269n,
    271n,
    277n,
    281n,
    283n,
    293n,
    307n,
    311n,
    313n,
    317n,
    331n,
    337n,
    347n,
    349n,
    353n,
    359n,
    367n,
    373n,
    379n,
    383n,
    389n,
    397n,
    401n,
    409n,
    419n,
    421n,
    431n,
    433n,
    439n,
    443n,
    449n,
    457n,
    461n,
    463n,
    467n,
    479n,
    487n,
    491n,
    499n,
    503n,
    509n,
    521n,
    523n,
    541n,
    547n,
    557n,
    563n,
    569n,
    571n,
    577n,
    587n,
    593n,
    599n,
    601n,
    607n,
    613n,
    617n,
    619n,
    631n,
    641n,
    643n,
    647n,
    653n,
    659n,
    661n,
    673n,
    677n,
    683n,
    691n,
    701n,
    709n,
    719n,
    727n,
    733n,
    739n,
    743n,
    751n,
    757n,
    761n,
    769n,
    773n,
    787n,
    797n,
    809n,
    811n,
    821n,
    823n,
    827n,
    829n,
    839n,
    853n,
    857n,
    859n,
    863n,
    877n,
    881n,
    883n,
    887n,
    907n,
    911n,
    919n,
    929n,
    937n,
    941n,
    947n,
    953n,
    967n,
    971n,
    977n,
    983n,
    991n,
    997n,
    1009n,
    1013n,
    1019n,
    1021n,
    1031n,
    1033n,
    1039n,
    1049n,
    1051n,
    1061n,
    1063n,
    1069n,
    1087n,
    1091n,
    1093n,
    1097n,
    1103n,
    1109n,
    1117n,
    1123n,
    1129n,
    1151n,
    1153n,
    1163n,
    1171n,
    1181n,
    1187n,
    1193n,
    1201n,
    1213n,
    1217n,
    1223n,
    1229n,
    1231n,
    1237n,
    1249n,
    1259n,
    1277n,
    1279n,
    1283n,
    1289n,
    1291n,
    1297n,
    1301n,
    1303n,
    1307n,
    1319n,
    1321n,
    1327n,
    1361n,
    1367n,
    1373n,
    1381n,
    1399n,
    1409n,
    1423n,
    1427n,
    1429n,
    1433n,
    1439n,
    1447n,
    1451n,
    1453n,
    1459n,
    1471n,
    1481n,
    1483n,
    1487n,
    1489n,
    1493n,
    1499n,
    1511n,
    1523n,
    1531n,
    1543n,
    1549n,
    1553n,
    1559n,
    1567n,
    1571n,
    1579n,
    1583n,
    1597n
  ]

  for (let i = 0; i < firstPrimes.length && (firstPrimes[i] <= w); i++) {
    const p = firstPrimes[i]
    if (w === p) return true
    else if (w % p === 0n) return false
  }

  /*
    1. Let a be the largest integer such that 2**a divides w−1.
    2. m = (w−1) / 2**a.
    3. wlen = len (w).
    4. For i = 1 to iterations do
        4.1 Obtain a string b of wlen bits from an RBG.
        Comment: Ensure that 1 < b < w−1.
        4.2 If ((b ≤ 1) or (b ≥ w−1)), then go to step 4.1.
        4.3 z = b**m mod w.
        4.4 If ((z = 1) or (z = w − 1)), then go to step 4.7.
        4.5 For j = 1 to a − 1 do.
        4.5.1 z = z**2 mod w.
        4.5.2 If (z = w−1), then go to step 4.7.
        4.5.3 If (z = 1), then go to step 4.6.
        4.6 Return COMPOSITE.
        4.7 Continue.
        Comment: Increment i for the do-loop in step 4.
    5. Return PROBABLY PRIME.
    */
  let a = 0n
  const d = w - 1n
  let aux = d
  while (aux % 2n === 0n) {
    aux /= 2n
    ++a
  }

  const m = d / (2n ** a)

  do {
    const b = randBetween(d, 2n)
    let z = modPow(b, m, w)
    if (z === 1n || z === d) continue
    let j = 1
    while (j < a) {
      z = modPow(z, 2n, w)
      if (z === d) break
      if (z === 1n) return false
      j++
    }
    if (z !== d) return false
  } while (--iterations)

  return true
}

let _useWorkers = false // The following is just to check whether we can use workers
/* eslint-disable no-lone-blocks */
if (!process.browser) { // Node.js
  try {
    require.resolve('worker_threads')
    _useWorkers = true
  } catch (e) {
    /* istanbul ignore next */
    console.log(`[bigint-crypto-utils] WARNING:
This node version doesn't support worker_threads. You should enable them in order to greatly speedup the generation of big prime numbers.
  · With Node >=11 it is enabled by default (consider upgrading).
  · With Node 10, starting with 10.5.0, you can enable worker_threads at runtime executing node --experimental-worker `)
    /* istanbul ignore next */
    _useWorkers = true
  }
} else { // Native JS
  if (self.Worker) _useWorkers = true
}
/* eslint-enable no-lone-blocks */

if (!process.browser && _useWorkers) { // node.js with support for workers
  const { parentPort, isMainThread } = require('worker_threads')
  /* istanbul ignore if */
  if (!isMainThread) { // worker
    parentPort.on('message', function (data) { // Let's start once we are called
      // data = {rnd: <bigint>, iterations: <number>}
      const isPrime = _isProbablyPrime(data.rnd, data.iterations)
      parentPort.postMessage({
        isPrime: isPrime,
        value: data.rnd,
        id: data.id
      })
    })
  }
}
