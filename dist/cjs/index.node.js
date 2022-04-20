'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var index_node = {};

Object.defineProperty(index_node, '__esModule', { value: true });

/**
 * Absolute value. abs(a)==a if a>=0. abs(a)==-a if a<0
 *
 * @param a
 *
 * @returns The absolute value of a
 */
function abs(a) {
    return (a >= 0) ? a : -a;
}

/**
 * Returns the bitlength of a number
 *
 * @param a
 * @returns The bit length
 */
function bitLength(a) {
    if (typeof a === 'number')
        a = BigInt(a);
    if (a === 1n) {
        return 1;
    }
    let bits = 1;
    do {
        bits++;
    } while ((a >>= 1n) > 1n);
    return bits;
}

/**
 * An iterative implementation of the extended euclidean algorithm or extended greatest common divisor algorithm.
 * Take positive integers a, b as input, and return a triple (g, x, y), such that ax + by = g = gcd(a, b).
 *
 * @param a
 * @param b
 *
 * @throws {RangeError}
 * This excepction is thrown if a or b are less than 0
 *
 * @returns A triple (g, x, y), such that ax + by = g = gcd(a, b).
 */
function eGcd(a, b) {
    if (typeof a === 'number')
        a = BigInt(a);
    if (typeof b === 'number')
        b = BigInt(b);
    if (a <= 0n || b <= 0n)
        throw new RangeError('a and b MUST be > 0'); // a and b MUST be positive
    let x = 0n;
    let y = 1n;
    let u = 1n;
    let v = 0n;
    while (a !== 0n) {
        const q = b / a;
        const r = b % a;
        const m = x - (u * q);
        const n = y - (v * q);
        b = a;
        a = r;
        x = u;
        y = v;
        u = m;
        v = n;
    }
    return {
        g: b,
        x: x,
        y: y
    };
}

/**
 * Greatest-common divisor of two integers based on the iterative binary algorithm.
 *
 * @param a
 * @param b
 *
 * @returns The greatest common divisor of a and b
 */
function gcd(a, b) {
    let aAbs = (typeof a === 'number') ? BigInt(abs(a)) : abs(a);
    let bAbs = (typeof b === 'number') ? BigInt(abs(b)) : abs(b);
    if (aAbs === 0n) {
        return bAbs;
    }
    else if (bAbs === 0n) {
        return aAbs;
    }
    let shift = 0n;
    while (((aAbs | bAbs) & 1n) === 0n) {
        aAbs >>= 1n;
        bAbs >>= 1n;
        shift++;
    }
    while ((aAbs & 1n) === 0n)
        aAbs >>= 1n;
    do {
        while ((bAbs & 1n) === 0n)
            bAbs >>= 1n;
        if (aAbs > bAbs) {
            const x = aAbs;
            aAbs = bAbs;
            bAbs = x;
        }
        bAbs -= aAbs;
    } while (bAbs !== 0n);
    // rescale
    return aAbs << shift;
}

/**
 * The least common multiple computed as abs(a*b)/gcd(a,b)
 * @param a
 * @param b
 *
 * @returns The least common multiple of a and b
 */
function lcm(a, b) {
    if (typeof a === 'number')
        a = BigInt(a);
    if (typeof b === 'number')
        b = BigInt(b);
    if (a === 0n && b === 0n)
        return BigInt(0);
    // return abs(a * b) as bigint / gcd(a, b)
    return abs((a / gcd(a, b)) * b);
}

/**
 * Maximum. max(a,b)==a if a>=b. max(a,b)==b if a<=b
 *
 * @param a
 * @param b
 *
 * @returns Maximum of numbers a and b
 */
function max(a, b) {
    return (a >= b) ? a : b;
}

/**
 * Minimum. min(a,b)==b if a>=b. min(a,b)==a if a<=b
 *
 * @param a
 * @param b
 *
 * @returns Minimum of numbers a and b
 */
function min(a, b) {
    return (a >= b) ? b : a;
}

/**
 * Finds the smallest positive element that is congruent to a in modulo n
 *
 * @remarks
 * a and b must be the same type, either number or bigint
 *
 * @param a - An integer
 * @param n - The modulo
 *
 * @throws {RangeError}
 * Excpeption thrown when n is not > 0
 *
 * @returns A bigint with the smallest positive representation of a modulo n
 */
function toZn(a, n) {
    if (typeof a === 'number')
        a = BigInt(a);
    if (typeof n === 'number')
        n = BigInt(n);
    if (n <= 0n) {
        throw new RangeError('n must be > 0');
    }
    const aZn = a % n;
    return (aZn < 0n) ? aZn + n : aZn;
}

/**
 * Modular inverse.
 *
 * @param a The number to find an inverse for
 * @param n The modulo
 *
 * @throws {RangeError}
 * Excpeption thorwn when a does not have inverse modulo n
 *
 * @returns The inverse modulo n
 */
function modInv(a, n) {
    const egcd = eGcd(toZn(a, n), n);
    if (egcd.g !== 1n) {
        throw new RangeError(`${a.toString()} does not have inverse modulo ${n.toString()}`); // modular inverse does not exist
    }
    else {
        return toZn(egcd.x, n);
    }
}

/**
 * Modular exponentiation b**e mod n. Currently using the right-to-left binary method
 *
 * @param b base
 * @param e exponent
 * @param n modulo
 *
 * @throws {RangeError}
 * Excpeption thrown when n is not > 0
 *
 * @returns b**e mod n
 */
function modPow(b, e, n) {
    if (typeof b === 'number')
        b = BigInt(b);
    if (typeof e === 'number')
        e = BigInt(e);
    if (typeof n === 'number')
        n = BigInt(n);
    if (n <= 0n) {
        throw new RangeError('n must be > 0');
    }
    else if (n === 1n) {
        return 0n;
    }
    b = toZn(b, n);
    if (e < 0n) {
        return modInv(modPow(b, abs(e), n), n);
    }
    let r = 1n;
    while (e > 0) {
        if ((e % 2n) === 1n) {
            r = r * b % n;
        }
        e = e / 2n;
        b = b ** 2n % n;
    }
    return r;
}

var abs_1 = index_node.abs = abs;
var bitLength_1 = index_node.bitLength = bitLength;
var eGcd_1 = index_node.eGcd = eGcd;
var gcd_1 = index_node.gcd = gcd;
var lcm_1 = index_node.lcm = lcm;
var max_1 = index_node.max = max;
var min_1 = index_node.min = min;
var modInv_1 = index_node.modInv = modInv;
var modPow_1 = index_node.modPow = modPow;
var toZn_1 = index_node.toZn = toZn;

function fromBuffer(buf) {
    let ret = 0n;
    for (const i of buf.values()) {
        const bi = BigInt(i);
        ret = (ret << 8n) + bi;
    }
    return ret;
}

/**
 * Secure random bytes for both node and browsers. Node version uses crypto.randomBytes() and browser one self.crypto.getRandomValues()
 *
 * @param byteLength - The desired number of random bytes
 * @param forceLength - If we want to force the output to have a bit length of 8*byteLength. It basically forces the msb to be 1
 *
 * @throws {RangeError}
 * byteLength MUST be > 0
 *
 * @returns A promise that resolves to a UInt8Array/Buffer (Browser/Node.js) filled with cryptographically secure random bytes
 */
function randBytes(byteLength, forceLength = false) {
    if (byteLength < 1)
        throw new RangeError('byteLength MUST be > 0');
    return new Promise(function (resolve, reject) {
        {
            const crypto = require('crypto'); // eslint-disable-line
            crypto.randomBytes(byteLength, function (err, buf) {
                /* istanbul ignore if */
                if (err !== null)
                    reject(err);
                // If fixed length is required we put the first bit to 1 -> to get the necessary bitLength
                if (forceLength)
                    buf[0] = buf[0] | 128;
                resolve(buf);
            });
        }
    });
}
/**
 * Secure random bytes for both node and browsers. Node version uses crypto.randomFill() and browser one self.crypto.getRandomValues()
 *
 * @param byteLength - The desired number of random bytes
 * @param forceLength - If we want to force the output to have a bit length of 8*byteLength. It basically forces the msb to be 1
 *
 * @throws {RangeError}
 * byteLength MUST be > 0
 *
 * @returns A UInt8Array/Buffer (Browser/Node.js) filled with cryptographically secure random bytes
 */
function randBytesSync(byteLength, forceLength = false) {
    if (byteLength < 1)
        throw new RangeError('byteLength MUST be > 0');
    /* eslint-disable no-lone-blocks */
    { // node
        const crypto = require('crypto'); // eslint-disable-line
        const buf = crypto.randomBytes(byteLength);
        // If fixed length is required we put the first bit to 1 -> to get the necessary bitLength
        if (forceLength)
            buf[0] = buf[0] | 128;
        return buf;
    }
    /* eslint-enable no-lone-blocks */
}

/**
 * Secure random bits for both node and browsers. Node version uses crypto.randomFill() and browser one self.crypto.getRandomValues()
 *
 * @param bitLength - The desired number of random bits
 * @param forceLength - If we want to force the output to have a specific bit length. It basically forces the msb to be 1
 *
 * @throws {RangeError}
 * bitLength MUST be > 0
 *
 * @returns A Promise that resolves to a UInt8Array/Buffer (Browser/Node.js) filled with cryptographically secure random bits
 */
function randBits(bitLength, forceLength = false) {
    if (bitLength < 1)
        throw new RangeError('bitLength MUST be > 0');
    const byteLength = Math.ceil(bitLength / 8);
    const bitLengthMod8 = bitLength % 8;
    return new Promise((resolve, reject) => {
        randBytes(byteLength, false).then(function (rndBytes) {
            if (bitLengthMod8 !== 0) {
                // Fill with 0's the extra bits
                rndBytes[0] = rndBytes[0] & (2 ** bitLengthMod8 - 1);
            }
            if (forceLength) {
                const mask = (bitLengthMod8 !== 0) ? 2 ** (bitLengthMod8 - 1) : 128;
                rndBytes[0] = rndBytes[0] | mask;
            }
            resolve(rndBytes);
        });
    });
}
/**
 * Secure random bits for both node and browsers. Node version uses crypto.randomFill() and browser one self.crypto.getRandomValues()
 * @param bitLength - The desired number of random bits
 * @param forceLength - If we want to force the output to have a specific bit length. It basically forces the msb to be 1
 *
 * @throws {RangeError}
 * bitLength MUST be > 0
 *
 * @returns A Uint8Array/Buffer (Browser/Node.js) filled with cryptographically secure random bits
 */
function randBitsSync(bitLength, forceLength = false) {
    if (bitLength < 1)
        throw new RangeError('bitLength MUST be > 0');
    const byteLength = Math.ceil(bitLength / 8);
    const rndBytes = randBytesSync(byteLength, false);
    const bitLengthMod8 = bitLength % 8;
    if (bitLengthMod8 !== 0) {
        // Fill with 0's the extra bits
        rndBytes[0] = rndBytes[0] & (2 ** bitLengthMod8 - 1);
    }
    if (forceLength) {
        const mask = (bitLengthMod8 !== 0) ? 2 ** (bitLengthMod8 - 1) : 128;
        rndBytes[0] = rndBytes[0] | mask;
    }
    return rndBytes;
}

/**
 * Returns a cryptographically secure random integer between [min,max].
 * @param max Returned value will be <= max
 * @param min Returned value will be >= min
 *
 * @throws {RangeError}
 * Arguments MUST be: max > min
 *
 * @returns A cryptographically secure random bigint between [min,max]
 */
function randBetween(max, min = 1n) {
    if (max <= min)
        throw new RangeError('Arguments MUST be: max > min');
    const interval = max - min;
    const bitLen = bitLength_1(interval);
    let rnd;
    do {
        const buf = randBitsSync(bitLen);
        rnd = fromBuffer(buf);
    } while (rnd > interval);
    return rnd + min;
}

let _useWorkers = false; // The following is just to check whether we can use workers
/* eslint-disable no-lone-blocks */
{ // Node.js
    try {
        require.resolve('worker_threads');
        _useWorkers = true;
    }
    catch (e) {
        /* istanbul ignore next */
        console.log(`[bigint-crypto-utils] WARNING:
This node version doesn't support worker_threads. You should enable them in order to greatly speedup the generation of big prime numbers.
  · With Node >=11 it is enabled by default (consider upgrading).
  · With Node 10, starting with 10.5.0, you can enable worker_threads at runtime executing node --experimental-worker `);
    }
}

/**
 * The test first tries if any of the first 250 small primes are a factor of the input number and then passes several
 * iterations of Miller-Rabin Probabilistic Primality Test (FIPS 186-4 C.3.1)
 *
 * @param w - A positive integer to be tested for primality
 * @param iterations - The number of iterations for the primality test. The value shall be consistent with Table C.1, C.2 or C.3
 * @param disableWorkers - Disable the use of workers for the primality test
 *
 * @throws {RangeError}
 * w MUST be >= 0
 *
 * @returns A promise that resolves to a boolean that is either true (a probably prime number) or false (definitely composite)
 */
function isProbablyPrime(w, iterations = 16, disableWorkers = false) {
    if (typeof w === 'number') {
        w = BigInt(w);
    }
    if (w < 0n)
        throw RangeError('w MUST be >= 0');
    { // Node.js
        /* istanbul ignore else */
        if (!disableWorkers && _useWorkers) {
            const { Worker } = require('worker_threads'); // eslint-disable-line
            return new Promise((resolve, reject) => {
                const worker = new Worker(__filename);
                worker.on('message', (data) => {
                    worker.terminate();
                    resolve(data.isPrime);
                });
                worker.on('error', reject);
                const msg = {
                    rnd: w,
                    iterations: iterations,
                    id: 0
                };
                worker.postMessage(msg);
            });
        }
        else {
            return new Promise((resolve) => {
                resolve(_isProbablyPrime(w, iterations));
            });
        }
    }
}
function _isProbablyPrime(w, iterations) {
    /*
    PREFILTERING. Even values but 2 are not primes, so don't test.
    1 is not a prime and the M-R algorithm needs w>1.
    */
    if (w === 2n)
        return true;
    else if ((w & 1n) === 0n || w === 1n)
        return false;
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
    ];
    for (let i = 0; i < firstPrimes.length && (firstPrimes[i] <= w); i++) {
        const p = firstPrimes[i];
        if (w === p)
            return true;
        else if (w % p === 0n)
            return false;
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
    let a = 0n;
    const d = w - 1n;
    let aux = d;
    while (aux % 2n === 0n) {
        aux /= 2n;
        ++a;
    }
    const m = d / (2n ** a);
    do {
        const b = randBetween(d, 2n);
        let z = modPow_1(b, m, w);
        if (z === 1n || z === d)
            continue;
        let j = 1;
        while (j < a) {
            z = modPow_1(z, 2n, w);
            if (z === d)
                break;
            if (z === 1n)
                return false;
            j++;
        }
        if (z !== d)
            return false;
    } while (--iterations !== 0);
    return true;
}
if (_useWorkers) { // node.js with support for workers
    const { parentPort, isMainThread } = require('worker_threads'); // eslint-disable-line
    const isWorker = !isMainThread;
    /* istanbul ignore if */
    if (isWorker) { // worker
        parentPort.on('message', function (data) {
            const isPrime = _isProbablyPrime(data.rnd, data.iterations);
            const msg = {
                isPrime: isPrime,
                value: data.rnd,
                id: data.id
            };
            parentPort.postMessage(msg);
        });
    }
}

/**
 * A probably-prime (Miller-Rabin), cryptographically-secure, random-number generator.
 * The browser version uses web workers to parallelise prime look up. Therefore, it does not lock the UI
 * main process, and it can be much faster (if several cores or cpu are available).
 * The node version can also use worker_threads if they are available (enabled by default with Node 11 and
 * and can be enabled at runtime executing node --experimental-worker with node >=10.5.0).
 *
 * @param bitLength - The required bit length for the generated prime
 * @param iterations - The number of iterations for the Miller-Rabin Probabilistic Primality Test
 *
 * @throws {RangeError}
 * bitLength MUST be > 0
 *
 * @returns A promise that resolves to a bigint probable prime of bitLength bits.
 */
function prime(bitLength, iterations = 16) {
    if (bitLength < 1)
        throw new RangeError('bitLength MUST be > 0');
    /* istanbul ignore if */
    if (!_useWorkers) { // If there is no support for workers
        let rnd = 0n;
        do {
            rnd = fromBuffer(randBitsSync(bitLength, true));
        } while (!_isProbablyPrime(rnd, iterations));
        return new Promise((resolve) => { resolve(rnd); });
    }
    return new Promise((resolve, reject) => {
        const workerList = [];
        const _onmessage = (msg, newWorker) => {
            if (msg.isPrime) {
                // if a prime number has been found, stop all the workers, and return it
                for (let j = 0; j < workerList.length; j++) {
                    workerList[j].terminate();
                }
                while (workerList.length > 0) {
                    workerList.pop();
                }
                resolve(msg.value);
            }
            else { // if a composite is found, make the worker test another random number
                const buf = randBitsSync(bitLength, true);
                const rnd = fromBuffer(buf);
                try {
                    const msgToWorker = {
                        rnd: rnd,
                        iterations: iterations,
                        id: msg.id
                    };
                    newWorker.postMessage(msgToWorker);
                }
                catch (error) {
                    // The worker has already terminated. There is nothing to handle here
                }
            }
        };
        { // Node.js
            const { cpus } = require('os'); // eslint-disable-line
            const { Worker } = require('worker_threads'); // eslint-disable-line
            for (let i = 0; i < cpus().length - 1; i++) {
                const newWorker = new Worker(__filename);
                newWorker.on('message', (msg) => _onmessage(msg, newWorker));
                workerList.push(newWorker);
            }
        }
        for (let i = 0; i < workerList.length; i++) {
            randBits(bitLength, true).then(function (buf) {
                const rnd = fromBuffer(buf);
                workerList[i].postMessage({
                    rnd: rnd,
                    iterations: iterations,
                    id: i
                });
            }).catch(reject);
        }
    });
}
/**
 * A probably-prime (Miller-Rabin), cryptographically-secure, random-number generator.
 * The sync version is NOT RECOMMENDED since it won't use workers and thus it'll be slower and may freeze thw window in browser's javascript. Please consider using prime() instead.
 *
 * @param bitLength - The required bit length for the generated prime
 * @param iterations - The number of iterations for the Miller-Rabin Probabilistic Primality Test
 *
 * @throws {RangeError}
 * bitLength MUST be > 0
 *
 * @returns A bigint probable prime of bitLength bits.
 */
function primeSync(bitLength, iterations = 16) {
    if (bitLength < 1)
        throw new RangeError('bitLength MUST be > 0');
    let rnd = 0n;
    do {
        rnd = fromBuffer(randBitsSync(bitLength, true));
    } while (!_isProbablyPrime(rnd, iterations));
    return rnd;
}

exports.abs = abs_1;
exports.bitLength = bitLength_1;
exports.eGcd = eGcd_1;
exports.gcd = gcd_1;
exports.isProbablyPrime = isProbablyPrime;
exports.lcm = lcm_1;
exports.max = max_1;
exports.min = min_1;
exports.modInv = modInv_1;
exports.modPow = modPow_1;
exports.prime = prime;
exports.primeSync = primeSync;
exports.randBetween = randBetween;
exports.randBits = randBits;
exports.randBitsSync = randBitsSync;
exports.randBytes = randBytes;
exports.randBytesSync = randBytesSync;
exports.toZn = toZn_1;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXgubm9kZS5qcyIsInNvdXJjZXMiOlsiLi4vLi4vbm9kZV9tb2R1bGVzL2JpZ2ludC1tb2QtYXJpdGgvZGlzdC9janMvaW5kZXgubm9kZS5janMiLCIuLi8uLi9zcmMvdHMvZnJvbUJ1ZmZlci50cyIsIi4uLy4uL3NyYy90cy9yYW5kQnl0ZXMudHMiLCIuLi8uLi9zcmMvdHMvcmFuZEJpdHMudHMiLCIuLi8uLi9zcmMvdHMvcmFuZEJldHdlZW4udHMiLCIuLi8uLi9zcmMvdHMvd29ya2VyVXRpbHMudHMiLCIuLi8uLi9zcmMvdHMvaXNQcm9iYWJseVByaW1lLnRzIiwiLi4vLi4vc3JjL3RzL3ByaW1lLnRzIl0sInNvdXJjZXNDb250ZW50IjpudWxsLCJuYW1lcyI6WyJiaXRMZW5ndGgiLCJtb2RQb3ciXSwibWFwcGluZ3MiOiI7Ozs7OztBQUVBLE1BQU0sQ0FBQyxjQUFjLENBQUMsVUFBTyxFQUFFLFlBQVksRUFBRSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDO0FBQzlEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTLEdBQUcsQ0FBQyxDQUFDLEVBQUU7QUFDaEIsSUFBSSxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7QUFDN0IsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUyxTQUFTLENBQUMsQ0FBQyxFQUFFO0FBQ3RCLElBQUksSUFBSSxPQUFPLENBQUMsS0FBSyxRQUFRO0FBQzdCLFFBQVEsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUN0QixJQUFJLElBQUksQ0FBQyxLQUFLLEVBQUUsRUFBRTtBQUNsQixRQUFRLE9BQU8sQ0FBQyxDQUFDO0FBQ2pCLEtBQUs7QUFDTCxJQUFJLElBQUksSUFBSSxHQUFHLENBQUMsQ0FBQztBQUNqQixJQUFJLEdBQUc7QUFDUCxRQUFRLElBQUksRUFBRSxDQUFDO0FBQ2YsS0FBSyxRQUFRLENBQUMsQ0FBQyxLQUFLLEVBQUUsSUFBSSxFQUFFLEVBQUU7QUFDOUIsSUFBSSxPQUFPLElBQUksQ0FBQztBQUNoQixDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFO0FBQ3BCLElBQUksSUFBSSxPQUFPLENBQUMsS0FBSyxRQUFRO0FBQzdCLFFBQVEsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUN0QixJQUFJLElBQUksT0FBTyxDQUFDLEtBQUssUUFBUTtBQUM3QixRQUFRLENBQUMsR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDdEIsSUFBSSxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJLEVBQUU7QUFDMUIsUUFBUSxNQUFNLElBQUksVUFBVSxDQUFDLHFCQUFxQixDQUFDLENBQUM7QUFDcEQsSUFBSSxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUM7QUFDZixJQUFJLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQztBQUNmLElBQUksSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDO0FBQ2YsSUFBSSxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUM7QUFDZixJQUFJLE9BQU8sQ0FBQyxLQUFLLEVBQUUsRUFBRTtBQUNyQixRQUFRLE1BQU0sQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDeEIsUUFBUSxNQUFNLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ3hCLFFBQVEsTUFBTSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztBQUM5QixRQUFRLE1BQU0sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7QUFDOUIsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ2QsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ2QsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ2QsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ2QsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ2QsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ2QsS0FBSztBQUNMLElBQUksT0FBTztBQUNYLFFBQVEsQ0FBQyxFQUFFLENBQUM7QUFDWixRQUFRLENBQUMsRUFBRSxDQUFDO0FBQ1osUUFBUSxDQUFDLEVBQUUsQ0FBQztBQUNaLEtBQUssQ0FBQztBQUNOLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFO0FBQ25CLElBQUksSUFBSSxJQUFJLEdBQUcsQ0FBQyxPQUFPLENBQUMsS0FBSyxRQUFRLElBQUksTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNqRSxJQUFJLElBQUksSUFBSSxHQUFHLENBQUMsT0FBTyxDQUFDLEtBQUssUUFBUSxJQUFJLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDakUsSUFBSSxJQUFJLElBQUksS0FBSyxFQUFFLEVBQUU7QUFDckIsUUFBUSxPQUFPLElBQUksQ0FBQztBQUNwQixLQUFLO0FBQ0wsU0FBUyxJQUFJLElBQUksS0FBSyxFQUFFLEVBQUU7QUFDMUIsUUFBUSxPQUFPLElBQUksQ0FBQztBQUNwQixLQUFLO0FBQ0wsSUFBSSxJQUFJLEtBQUssR0FBRyxFQUFFLENBQUM7QUFDbkIsSUFBSSxPQUFPLENBQUMsQ0FBQyxJQUFJLEdBQUcsSUFBSSxJQUFJLEVBQUUsTUFBTSxFQUFFLEVBQUU7QUFDeEMsUUFBUSxJQUFJLEtBQUssRUFBRSxDQUFDO0FBQ3BCLFFBQVEsSUFBSSxLQUFLLEVBQUUsQ0FBQztBQUNwQixRQUFRLEtBQUssRUFBRSxDQUFDO0FBQ2hCLEtBQUs7QUFDTCxJQUFJLE9BQU8sQ0FBQyxJQUFJLEdBQUcsRUFBRSxNQUFNLEVBQUU7QUFDN0IsUUFBUSxJQUFJLEtBQUssRUFBRSxDQUFDO0FBQ3BCLElBQUksR0FBRztBQUNQLFFBQVEsT0FBTyxDQUFDLElBQUksR0FBRyxFQUFFLE1BQU0sRUFBRTtBQUNqQyxZQUFZLElBQUksS0FBSyxFQUFFLENBQUM7QUFDeEIsUUFBUSxJQUFJLElBQUksR0FBRyxJQUFJLEVBQUU7QUFDekIsWUFBWSxNQUFNLENBQUMsR0FBRyxJQUFJLENBQUM7QUFDM0IsWUFBWSxJQUFJLEdBQUcsSUFBSSxDQUFDO0FBQ3hCLFlBQVksSUFBSSxHQUFHLENBQUMsQ0FBQztBQUNyQixTQUFTO0FBQ1QsUUFBUSxJQUFJLElBQUksSUFBSSxDQUFDO0FBQ3JCLEtBQUssUUFBUSxJQUFJLEtBQUssRUFBRSxFQUFFO0FBQzFCO0FBQ0EsSUFBSSxPQUFPLElBQUksSUFBSSxLQUFLLENBQUM7QUFDekIsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFO0FBQ25CLElBQUksSUFBSSxPQUFPLENBQUMsS0FBSyxRQUFRO0FBQzdCLFFBQVEsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUN0QixJQUFJLElBQUksT0FBTyxDQUFDLEtBQUssUUFBUTtBQUM3QixRQUFRLENBQUMsR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDdEIsSUFBSSxJQUFJLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxLQUFLLEVBQUU7QUFDNUIsUUFBUSxPQUFPLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUN6QjtBQUNBLElBQUksT0FBTyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztBQUNwQyxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRTtBQUNuQixJQUFJLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDNUIsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUU7QUFDbkIsSUFBSSxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQzVCLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFO0FBQ3BCLElBQUksSUFBSSxPQUFPLENBQUMsS0FBSyxRQUFRO0FBQzdCLFFBQVEsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUN0QixJQUFJLElBQUksT0FBTyxDQUFDLEtBQUssUUFBUTtBQUM3QixRQUFRLENBQUMsR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDdEIsSUFBSSxJQUFJLENBQUMsSUFBSSxFQUFFLEVBQUU7QUFDakIsUUFBUSxNQUFNLElBQUksVUFBVSxDQUFDLGVBQWUsQ0FBQyxDQUFDO0FBQzlDLEtBQUs7QUFDTCxJQUFJLE1BQU0sR0FBRyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDdEIsSUFBSSxPQUFPLENBQUMsR0FBRyxHQUFHLEVBQUUsSUFBSSxHQUFHLEdBQUcsQ0FBQyxHQUFHLEdBQUcsQ0FBQztBQUN0QyxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRTtBQUN0QixJQUFJLE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQ3JDLElBQUksSUFBSSxJQUFJLENBQUMsQ0FBQyxLQUFLLEVBQUUsRUFBRTtBQUN2QixRQUFRLE1BQU0sSUFBSSxVQUFVLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQyw4QkFBOEIsRUFBRSxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDN0YsS0FBSztBQUNMLFNBQVM7QUFDVCxRQUFRLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDL0IsS0FBSztBQUNMLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFO0FBQ3pCLElBQUksSUFBSSxPQUFPLENBQUMsS0FBSyxRQUFRO0FBQzdCLFFBQVEsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUN0QixJQUFJLElBQUksT0FBTyxDQUFDLEtBQUssUUFBUTtBQUM3QixRQUFRLENBQUMsR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDdEIsSUFBSSxJQUFJLE9BQU8sQ0FBQyxLQUFLLFFBQVE7QUFDN0IsUUFBUSxDQUFDLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3RCLElBQUksSUFBSSxDQUFDLElBQUksRUFBRSxFQUFFO0FBQ2pCLFFBQVEsTUFBTSxJQUFJLFVBQVUsQ0FBQyxlQUFlLENBQUMsQ0FBQztBQUM5QyxLQUFLO0FBQ0wsU0FBUyxJQUFJLENBQUMsS0FBSyxFQUFFLEVBQUU7QUFDdkIsUUFBUSxPQUFPLEVBQUUsQ0FBQztBQUNsQixLQUFLO0FBQ0wsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUNuQixJQUFJLElBQUksQ0FBQyxHQUFHLEVBQUUsRUFBRTtBQUNoQixRQUFRLE9BQU8sTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQy9DLEtBQUs7QUFDTCxJQUFJLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQztBQUNmLElBQUksT0FBTyxDQUFDLEdBQUcsQ0FBQyxFQUFFO0FBQ2xCLFFBQVEsSUFBSSxDQUFDLENBQUMsR0FBRyxFQUFFLE1BQU0sRUFBRSxFQUFFO0FBQzdCLFlBQVksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQzFCLFNBQVM7QUFDVCxRQUFRLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDO0FBQ25CLFFBQVEsQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLEdBQUcsQ0FBQyxDQUFDO0FBQ3hCLEtBQUs7QUFDTCxJQUFJLE9BQU8sQ0FBQyxDQUFDO0FBQ2IsQ0FBQztBQUNEO0FBQ1csSUFBQSxLQUFBLEdBQUEsVUFBQSxDQUFBLEdBQUEsR0FBRyxJQUFJO0FBQ0QsSUFBQSxXQUFBLEdBQUEsVUFBQSxDQUFBLFNBQUEsR0FBRyxVQUFVO0FBQ2xCLElBQUEsTUFBQSxHQUFBLFVBQUEsQ0FBQSxJQUFBLEdBQUcsS0FBSztBQUNULElBQUEsS0FBQSxHQUFBLFVBQUEsQ0FBQSxHQUFBLEdBQUcsSUFBSTtBQUNQLElBQUEsS0FBQSxHQUFBLFVBQUEsQ0FBQSxHQUFBLEdBQUcsSUFBSTtBQUNQLElBQUEsS0FBQSxHQUFBLFVBQUEsQ0FBQSxHQUFBLEdBQUcsSUFBSTtBQUNQLElBQUEsS0FBQSxHQUFBLFVBQUEsQ0FBQSxHQUFBLEdBQUcsSUFBSTtBQUNKLElBQUEsUUFBQSxHQUFBLFVBQUEsQ0FBQSxNQUFBLEdBQUcsT0FBTztBQUNWLElBQUEsUUFBQSxHQUFBLFVBQUEsQ0FBQSxNQUFBLEdBQUcsT0FBTztBQUNaLElBQUEsTUFBQSxHQUFBLFVBQUEsQ0FBQSxJQUFBLEdBQUc7O0FDN1BULFNBQVUsVUFBVSxDQUFFLEdBQXNCLEVBQUE7SUFDaEQsSUFBSSxHQUFHLEdBQUcsRUFBRSxDQUFBO0FBQ1osSUFBQSxLQUFLLE1BQU0sQ0FBQyxJQUFJLEdBQUcsQ0FBQyxNQUFNLEVBQUUsRUFBRTtBQUM1QixRQUFBLE1BQU0sRUFBRSxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQTtRQUNwQixHQUFHLEdBQUcsQ0FBQyxHQUFHLElBQUksRUFBRSxJQUFJLEVBQUUsQ0FBQTtBQUN2QixLQUFBO0FBQ0QsSUFBQSxPQUFPLEdBQUcsQ0FBQTtBQUNaOztBQ1BBOzs7Ozs7Ozs7O0FBVUc7U0FDYSxTQUFTLENBQUUsVUFBa0IsRUFBRSxXQUFXLEdBQUcsS0FBSyxFQUFBO0lBQ2hFLElBQUksVUFBVSxHQUFHLENBQUM7QUFBRSxRQUFBLE1BQU0sSUFBSSxVQUFVLENBQUMsd0JBQXdCLENBQUMsQ0FBQTtBQUVsRSxJQUFBLE9BQU8sSUFBSSxPQUFPLENBQUMsVUFBVSxPQUFPLEVBQUUsTUFBTSxFQUFBO1FBQ3pCO1lBQ2YsTUFBTSxNQUFNLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFBO1lBQ2hDLE1BQU0sQ0FBQyxXQUFXLENBQUMsVUFBVSxFQUFFLFVBQVUsR0FBVSxFQUFFLEdBQVcsRUFBQTs7Z0JBRTlELElBQUksR0FBRyxLQUFLLElBQUk7b0JBQUUsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFBOztBQUU3QixnQkFBQSxJQUFJLFdBQVc7b0JBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUE7Z0JBQ3RDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQTtBQUNkLGFBQUMsQ0FBQyxDQUFBO0FBQ0gsU0FNQTtBQUNILEtBQUMsQ0FBQyxDQUFBO0FBQ0osQ0FBQztBQUVEOzs7Ozs7Ozs7O0FBVUc7U0FDYSxhQUFhLENBQUUsVUFBa0IsRUFBRSxjQUF1QixLQUFLLEVBQUE7SUFDN0UsSUFBSSxVQUFVLEdBQUcsQ0FBQztBQUFFLFFBQUEsTUFBTSxJQUFJLFVBQVUsQ0FBQyx3QkFBd0IsQ0FBQyxDQUFBOztBQUdsRSxJQUFpQjtRQUNmLE1BQU0sTUFBTSxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQTtRQUNoQyxNQUFNLEdBQUcsR0FBRyxNQUFNLENBQUMsV0FBVyxDQUFDLFVBQVUsQ0FBQyxDQUFBOztBQUUxQyxRQUFBLElBQUksV0FBVztZQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFBO0FBQ3RDLFFBQUEsT0FBTyxHQUFHLENBQUE7QUFDWCxLQU1BOztBQUVIOztBQzdEQTs7Ozs7Ozs7OztBQVVHO1NBQ2EsUUFBUSxDQUFFLFNBQWlCLEVBQUUsY0FBdUIsS0FBSyxFQUFBO0lBQ3ZFLElBQUksU0FBUyxHQUFHLENBQUM7QUFBRSxRQUFBLE1BQU0sSUFBSSxVQUFVLENBQUMsdUJBQXVCLENBQUMsQ0FBQTtJQUVoRSxNQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsR0FBRyxDQUFDLENBQUMsQ0FBQTtBQUMzQyxJQUFBLE1BQU0sYUFBYSxHQUFHLFNBQVMsR0FBRyxDQUFDLENBQUE7SUFFbkMsT0FBTyxJQUFJLE9BQU8sQ0FBQyxDQUFDLE9BQU8sRUFBRSxNQUFNLEtBQUk7UUFDckMsU0FBUyxDQUFDLFVBQVUsRUFBRSxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBVSxRQUFRLEVBQUE7WUFDbEQsSUFBSSxhQUFhLEtBQUssQ0FBQyxFQUFFOztBQUV2QixnQkFBQSxRQUFRLENBQUMsQ0FBQyxDQUFDLEdBQUcsUUFBUSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxhQUFhLEdBQUcsQ0FBQyxDQUFDLENBQUE7QUFDckQsYUFBQTtBQUNELFlBQUEsSUFBSSxXQUFXLEVBQUU7Z0JBQ2YsTUFBTSxJQUFJLEdBQUcsQ0FBQyxhQUFhLEtBQUssQ0FBQyxJQUFJLENBQUMsS0FBSyxhQUFhLEdBQUcsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFBO2dCQUNuRSxRQUFRLENBQUMsQ0FBQyxDQUFDLEdBQUcsUUFBUSxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQTtBQUNqQyxhQUFBO1lBQ0QsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFBO0FBQ25CLFNBQUMsQ0FBQyxDQUFBO0FBQ0osS0FBQyxDQUFDLENBQUE7QUFDSixDQUFDO0FBRUQ7Ozs7Ozs7OztBQVNHO1NBQ2EsWUFBWSxDQUFFLFNBQWlCLEVBQUUsY0FBdUIsS0FBSyxFQUFBO0lBQzNFLElBQUksU0FBUyxHQUFHLENBQUM7QUFBRSxRQUFBLE1BQU0sSUFBSSxVQUFVLENBQUMsdUJBQXVCLENBQUMsQ0FBQTtJQUVoRSxNQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsR0FBRyxDQUFDLENBQUMsQ0FBQTtJQUMzQyxNQUFNLFFBQVEsR0FBRyxhQUFhLENBQUMsVUFBVSxFQUFFLEtBQUssQ0FBQyxDQUFBO0FBQ2pELElBQUEsTUFBTSxhQUFhLEdBQUcsU0FBUyxHQUFHLENBQUMsQ0FBQTtJQUNuQyxJQUFJLGFBQWEsS0FBSyxDQUFDLEVBQUU7O0FBRXZCLFFBQUEsUUFBUSxDQUFDLENBQUMsQ0FBQyxHQUFHLFFBQVEsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksYUFBYSxHQUFHLENBQUMsQ0FBQyxDQUFBO0FBQ3JELEtBQUE7QUFDRCxJQUFBLElBQUksV0FBVyxFQUFFO1FBQ2YsTUFBTSxJQUFJLEdBQUcsQ0FBQyxhQUFhLEtBQUssQ0FBQyxJQUFJLENBQUMsS0FBSyxhQUFhLEdBQUcsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFBO1FBQ25FLFFBQVEsQ0FBQyxDQUFDLENBQUMsR0FBRyxRQUFRLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFBO0FBQ2pDLEtBQUE7QUFDRCxJQUFBLE9BQU8sUUFBUSxDQUFBO0FBQ2pCOztBQ3ZEQTs7Ozs7Ozs7O0FBU0c7U0FDYSxXQUFXLENBQUUsR0FBVyxFQUFFLE1BQWMsRUFBRSxFQUFBO0lBQ3hELElBQUksR0FBRyxJQUFJLEdBQUc7QUFBRSxRQUFBLE1BQU0sSUFBSSxVQUFVLENBQUMsOEJBQThCLENBQUMsQ0FBQTtBQUNwRSxJQUFBLE1BQU0sUUFBUSxHQUFHLEdBQUcsR0FBRyxHQUFHLENBQUE7QUFDMUIsSUFBQSxNQUFNLE1BQU0sR0FBR0EsV0FBUyxDQUFDLFFBQVEsQ0FBQyxDQUFBO0FBQ2xDLElBQUEsSUFBSSxHQUFHLENBQUE7SUFDUCxHQUFHO0FBQ0QsUUFBQSxNQUFNLEdBQUcsR0FBRyxZQUFZLENBQUMsTUFBTSxDQUFDLENBQUE7QUFDaEMsUUFBQSxHQUFHLEdBQUcsVUFBVSxDQUFDLEdBQUcsQ0FBQyxDQUFBO0tBQ3RCLFFBQVEsR0FBRyxHQUFHLFFBQVEsRUFBQztJQUN4QixPQUFPLEdBQUcsR0FBRyxHQUFHLENBQUE7QUFDbEI7O0FDbEJBLElBQUksV0FBVyxHQUFHLEtBQUssQ0FBQTtBQUN2QjtBQUNpQjtJQUNmLElBQUk7QUFDRixRQUFBLE9BQU8sQ0FBQyxPQUFPLENBQUMsZ0JBQWdCLENBQUMsQ0FBQTtRQUNqQyxXQUFXLEdBQUcsSUFBSSxDQUFBO0FBQ25CLEtBQUE7QUFBQyxJQUFBLE9BQU8sQ0FBQyxFQUFFOztRQUVWLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQTs7O0FBR3VHLHNIQUFBLENBQUEsQ0FBQyxDQUFBO0FBQ3JILEtBQUE7QUFDRjs7QUNaRDs7Ozs7Ozs7Ozs7O0FBWUc7QUFDRyxTQUFVLGVBQWUsQ0FBRSxDQUFnQixFQUFFLFVBQXFCLEdBQUEsRUFBRSxFQUFFLGNBQUEsR0FBMEIsS0FBSyxFQUFBO0FBQ3pHLElBQUEsSUFBSSxPQUFPLENBQUMsS0FBSyxRQUFRLEVBQUU7QUFDekIsUUFBQSxDQUFDLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFBO0FBQ2QsS0FBQTtJQUNELElBQUksQ0FBQyxHQUFHLEVBQUU7QUFBRSxRQUFBLE1BQU0sVUFBVSxDQUFDLGdCQUFnQixDQUFDLENBQUE7QUFFOUMsSUFBaUI7O0FBRWYsUUFBQSxJQUFJLENBQUMsY0FBYyxJQUFJLFdBQVcsRUFBRTtZQUNsQyxNQUFNLEVBQUUsTUFBTSxFQUFFLEdBQUcsT0FBTyxDQUFDLGdCQUFnQixDQUFDLENBQUE7WUFDNUMsT0FBTyxJQUFJLE9BQU8sQ0FBQyxDQUFDLE9BQU8sRUFBRSxNQUFNLEtBQUk7QUFDckMsZ0JBQUEsTUFBTSxNQUFNLEdBQUcsSUFBSSxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUE7Z0JBRXJDLE1BQU0sQ0FBQyxFQUFFLENBQUMsU0FBUyxFQUFFLENBQUMsSUFBcUIsS0FBSTtvQkFDN0MsTUFBTSxDQUFDLFNBQVMsRUFBRSxDQUFBO0FBQ2xCLG9CQUFBLE9BQU8sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUE7QUFDdkIsaUJBQUMsQ0FBQyxDQUFBO0FBRUYsZ0JBQUEsTUFBTSxDQUFDLEVBQUUsQ0FBQyxPQUFPLEVBQUUsTUFBTSxDQUFDLENBQUE7QUFFMUIsZ0JBQUEsTUFBTSxHQUFHLEdBQW9CO0FBQzNCLG9CQUFBLEdBQUcsRUFBRSxDQUFXO0FBQ2hCLG9CQUFBLFVBQVUsRUFBRSxVQUFVO0FBQ3RCLG9CQUFBLEVBQUUsRUFBRSxDQUFDO2lCQUNOLENBQUE7QUFDRCxnQkFBQSxNQUFNLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxDQUFBO0FBQ3pCLGFBQUMsQ0FBQyxDQUFBO0FBQ0gsU0FBQTtBQUFNLGFBQUE7QUFDTCxZQUFBLE9BQU8sSUFBSSxPQUFPLENBQUMsQ0FBQyxPQUFPLEtBQUk7Z0JBQzdCLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFXLEVBQUUsVUFBVSxDQUFDLENBQUMsQ0FBQTtBQUNwRCxhQUFDLENBQUMsQ0FBQTtBQUNILFNBQUE7QUFDRixLQW9CQTtBQUNILENBQUM7QUFFZSxTQUFBLGdCQUFnQixDQUFFLENBQVMsRUFBRSxVQUFrQixFQUFBO0FBQzdEOzs7QUFHRTtJQUNGLElBQUksQ0FBQyxLQUFLLEVBQUU7QUFBRSxRQUFBLE9BQU8sSUFBSSxDQUFBO1NBQ3BCLElBQUksQ0FBQyxDQUFDLEdBQUcsRUFBRSxNQUFNLEVBQUUsSUFBSSxDQUFDLEtBQUssRUFBRTtBQUFFLFFBQUEsT0FBTyxLQUFLLENBQUE7QUFFbEQ7O0FBRUk7QUFDSixJQUFBLE1BQU0sV0FBVyxHQUFHO1FBQ2xCLEVBQUU7UUFDRixFQUFFO1FBQ0YsRUFBRTtRQUNGLEdBQUc7UUFDSCxHQUFHO1FBQ0gsR0FBRztRQUNILEdBQUc7UUFDSCxHQUFHO1FBQ0gsR0FBRztRQUNILEdBQUc7UUFDSCxHQUFHO1FBQ0gsR0FBRztRQUNILEdBQUc7UUFDSCxHQUFHO1FBQ0gsR0FBRztRQUNILEdBQUc7UUFDSCxHQUFHO1FBQ0gsR0FBRztRQUNILEdBQUc7UUFDSCxHQUFHO1FBQ0gsR0FBRztRQUNILEdBQUc7UUFDSCxHQUFHO1FBQ0gsR0FBRztRQUNILElBQUk7UUFDSixJQUFJO1FBQ0osSUFBSTtRQUNKLElBQUk7UUFDSixJQUFJO1FBQ0osSUFBSTtRQUNKLElBQUk7UUFDSixJQUFJO1FBQ0osSUFBSTtRQUNKLElBQUk7UUFDSixJQUFJO1FBQ0osSUFBSTtRQUNKLElBQUk7UUFDSixJQUFJO1FBQ0osSUFBSTtRQUNKLElBQUk7UUFDSixJQUFJO1FBQ0osSUFBSTtRQUNKLElBQUk7UUFDSixJQUFJO1FBQ0osSUFBSTtRQUNKLElBQUk7UUFDSixJQUFJO1FBQ0osSUFBSTtRQUNKLElBQUk7UUFDSixJQUFJO1FBQ0osSUFBSTtRQUNKLElBQUk7UUFDSixJQUFJO1FBQ0osSUFBSTtRQUNKLElBQUk7UUFDSixJQUFJO1FBQ0osSUFBSTtRQUNKLElBQUk7UUFDSixJQUFJO1FBQ0osSUFBSTtRQUNKLElBQUk7UUFDSixJQUFJO1FBQ0osSUFBSTtRQUNKLElBQUk7UUFDSixJQUFJO1FBQ0osSUFBSTtRQUNKLElBQUk7UUFDSixJQUFJO1FBQ0osSUFBSTtRQUNKLElBQUk7UUFDSixJQUFJO1FBQ0osSUFBSTtRQUNKLElBQUk7UUFDSixJQUFJO1FBQ0osSUFBSTtRQUNKLElBQUk7UUFDSixJQUFJO1FBQ0osSUFBSTtRQUNKLElBQUk7UUFDSixJQUFJO1FBQ0osSUFBSTtRQUNKLElBQUk7UUFDSixJQUFJO1FBQ0osSUFBSTtRQUNKLElBQUk7UUFDSixJQUFJO1FBQ0osSUFBSTtRQUNKLElBQUk7UUFDSixJQUFJO1FBQ0osSUFBSTtRQUNKLElBQUk7UUFDSixJQUFJO1FBQ0osSUFBSTtRQUNKLElBQUk7UUFDSixJQUFJO1FBQ0osSUFBSTtRQUNKLElBQUk7UUFDSixJQUFJO1FBQ0osSUFBSTtRQUNKLElBQUk7UUFDSixJQUFJO1FBQ0osSUFBSTtRQUNKLElBQUk7UUFDSixJQUFJO1FBQ0osSUFBSTtRQUNKLElBQUk7UUFDSixJQUFJO1FBQ0osSUFBSTtRQUNKLElBQUk7UUFDSixJQUFJO1FBQ0osSUFBSTtRQUNKLElBQUk7UUFDSixJQUFJO1FBQ0osSUFBSTtRQUNKLElBQUk7UUFDSixJQUFJO1FBQ0osSUFBSTtRQUNKLElBQUk7UUFDSixJQUFJO1FBQ0osSUFBSTtRQUNKLElBQUk7UUFDSixJQUFJO1FBQ0osSUFBSTtRQUNKLElBQUk7UUFDSixJQUFJO1FBQ0osSUFBSTtRQUNKLElBQUk7UUFDSixJQUFJO1FBQ0osSUFBSTtRQUNKLElBQUk7UUFDSixJQUFJO1FBQ0osSUFBSTtRQUNKLElBQUk7UUFDSixJQUFJO1FBQ0osSUFBSTtRQUNKLElBQUk7UUFDSixJQUFJO1FBQ0osSUFBSTtRQUNKLElBQUk7UUFDSixJQUFJO1FBQ0osSUFBSTtRQUNKLElBQUk7UUFDSixJQUFJO1FBQ0osSUFBSTtRQUNKLElBQUk7UUFDSixJQUFJO1FBQ0osSUFBSTtRQUNKLElBQUk7UUFDSixJQUFJO1FBQ0osSUFBSTtRQUNKLElBQUk7UUFDSixJQUFJO1FBQ0osSUFBSTtRQUNKLElBQUk7UUFDSixJQUFJO1FBQ0osSUFBSTtRQUNKLElBQUk7UUFDSixJQUFJO1FBQ0osSUFBSTtRQUNKLElBQUk7UUFDSixJQUFJO1FBQ0osSUFBSTtRQUNKLElBQUk7UUFDSixJQUFJO1FBQ0osSUFBSTtRQUNKLElBQUk7UUFDSixJQUFJO1FBQ0osS0FBSztRQUNMLEtBQUs7UUFDTCxLQUFLO1FBQ0wsS0FBSztRQUNMLEtBQUs7UUFDTCxLQUFLO1FBQ0wsS0FBSztRQUNMLEtBQUs7UUFDTCxLQUFLO1FBQ0wsS0FBSztRQUNMLEtBQUs7UUFDTCxLQUFLO1FBQ0wsS0FBSztRQUNMLEtBQUs7UUFDTCxLQUFLO1FBQ0wsS0FBSztRQUNMLEtBQUs7UUFDTCxLQUFLO1FBQ0wsS0FBSztRQUNMLEtBQUs7UUFDTCxLQUFLO1FBQ0wsS0FBSztRQUNMLEtBQUs7UUFDTCxLQUFLO1FBQ0wsS0FBSztRQUNMLEtBQUs7UUFDTCxLQUFLO1FBQ0wsS0FBSztRQUNMLEtBQUs7UUFDTCxLQUFLO1FBQ0wsS0FBSztRQUNMLEtBQUs7UUFDTCxLQUFLO1FBQ0wsS0FBSztRQUNMLEtBQUs7UUFDTCxLQUFLO1FBQ0wsS0FBSztRQUNMLEtBQUs7UUFDTCxLQUFLO1FBQ0wsS0FBSztRQUNMLEtBQUs7UUFDTCxLQUFLO1FBQ0wsS0FBSztRQUNMLEtBQUs7UUFDTCxLQUFLO1FBQ0wsS0FBSztRQUNMLEtBQUs7UUFDTCxLQUFLO1FBQ0wsS0FBSztRQUNMLEtBQUs7UUFDTCxLQUFLO1FBQ0wsS0FBSztRQUNMLEtBQUs7UUFDTCxLQUFLO1FBQ0wsS0FBSztRQUNMLEtBQUs7UUFDTCxLQUFLO1FBQ0wsS0FBSztRQUNMLEtBQUs7UUFDTCxLQUFLO1FBQ0wsS0FBSztRQUNMLEtBQUs7UUFDTCxLQUFLO1FBQ0wsS0FBSztRQUNMLEtBQUs7UUFDTCxLQUFLO1FBQ0wsS0FBSztRQUNMLEtBQUs7UUFDTCxLQUFLO1FBQ0wsS0FBSztRQUNMLEtBQUs7UUFDTCxLQUFLO1FBQ0wsS0FBSztRQUNMLEtBQUs7UUFDTCxLQUFLO1FBQ0wsS0FBSztRQUNMLEtBQUs7UUFDTCxLQUFLO1FBQ0wsS0FBSztRQUNMLEtBQUs7UUFDTCxLQUFLO1FBQ0wsS0FBSztRQUNMLEtBQUs7S0FDTixDQUFBO0lBRUQsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxH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
