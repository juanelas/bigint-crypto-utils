'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var bigintModArith = require('bigint-mod-arith');

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
 * Returns a cryptographically secure random integer between [min,max]. Both numbers must be >=0
 * @param max Returned value will be <= max
 * @param min Returned value will be >= min
 *
 * @throws {RangeError}
 * Arguments MUST be: max > 0 && min >=0 && max > min
 *
 * @returns A cryptographically secure random bigint between [min,max]
 */
function randBetween(max, min = 1n) {
    if (max <= 0n || min < 0n || max <= min)
        throw new RangeError('Arguments MUST be: max > 0 && min >=0 && max > min');
    const interval = max - min;
    const bitLen = bigintModArith.bitLength(interval);
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
        let z = bigintModArith.modPow(b, m, w);
        if (z === 1n || z === d)
            continue;
        let j = 1;
        while (j < a) {
            z = bigintModArith.modPow(z, 2n, w);
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

Object.defineProperty(exports, 'abs', {
    enumerable: true,
    get: function () {
        return bigintModArith.abs;
    }
});
Object.defineProperty(exports, 'bitLength', {
    enumerable: true,
    get: function () {
        return bigintModArith.bitLength;
    }
});
Object.defineProperty(exports, 'eGcd', {
    enumerable: true,
    get: function () {
        return bigintModArith.eGcd;
    }
});
Object.defineProperty(exports, 'gcd', {
    enumerable: true,
    get: function () {
        return bigintModArith.gcd;
    }
});
Object.defineProperty(exports, 'lcm', {
    enumerable: true,
    get: function () {
        return bigintModArith.lcm;
    }
});
Object.defineProperty(exports, 'max', {
    enumerable: true,
    get: function () {
        return bigintModArith.max;
    }
});
Object.defineProperty(exports, 'min', {
    enumerable: true,
    get: function () {
        return bigintModArith.min;
    }
});
Object.defineProperty(exports, 'modInv', {
    enumerable: true,
    get: function () {
        return bigintModArith.modInv;
    }
});
Object.defineProperty(exports, 'modPow', {
    enumerable: true,
    get: function () {
        return bigintModArith.modPow;
    }
});
Object.defineProperty(exports, 'toZn', {
    enumerable: true,
    get: function () {
        return bigintModArith.toZn;
    }
});
exports.isProbablyPrime = isProbablyPrime;
exports.prime = prime;
exports.primeSync = primeSync;
exports.randBetween = randBetween;
exports.randBits = randBits;
exports.randBitsSync = randBitsSync;
exports.randBytes = randBytes;
exports.randBytesSync = randBytesSync;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXgubm9kZS5qcyIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3RzL2Zyb21CdWZmZXIudHMiLCIuLi8uLi9zcmMvdHMvcmFuZEJ5dGVzLnRzIiwiLi4vLi4vc3JjL3RzL3JhbmRCaXRzLnRzIiwiLi4vLi4vc3JjL3RzL3JhbmRCZXR3ZWVuLnRzIiwiLi4vLi4vc3JjL3RzL3dvcmtlclV0aWxzLnRzIiwiLi4vLi4vc3JjL3RzL2lzUHJvYmFibHlQcmltZS50cyIsIi4uLy4uL3NyYy90cy9wcmltZS50cyJdLCJzb3VyY2VzQ29udGVudCI6bnVsbCwibmFtZXMiOlsiYml0TGVuZ3RoIiwibW9kUG93Il0sIm1hcHBpbmdzIjoiOzs7Ozs7U0FBZ0IsVUFBVSxDQUFFLEdBQXNCO0lBQ2hELElBQUksR0FBRyxHQUFHLEVBQUUsQ0FBQTtJQUNaLEtBQUssTUFBTSxDQUFDLElBQUksR0FBRyxDQUFDLE1BQU0sRUFBRSxFQUFFO1FBQzVCLE1BQU0sRUFBRSxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQTtRQUNwQixHQUFHLEdBQUcsQ0FBQyxHQUFHLElBQUksRUFBRSxJQUFJLEVBQUUsQ0FBQTtLQUN2QjtJQUNELE9BQU8sR0FBRyxDQUFBO0FBQ1o7O0FDUEE7Ozs7Ozs7Ozs7O1NBV2dCLFNBQVMsQ0FBRSxVQUFrQixFQUFFLFdBQVcsR0FBRyxLQUFLO0lBQ2hFLElBQUksVUFBVSxHQUFHLENBQUM7UUFBRSxNQUFNLElBQUksVUFBVSxDQUFDLHdCQUF3QixDQUFDLENBQUE7SUFFbEUsT0FBTyxJQUFJLE9BQU8sQ0FBQyxVQUFVLE9BQU8sRUFBRSxNQUFNO1FBQ3pCO1lBQ2YsTUFBTSxNQUFNLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFBO1lBQ2hDLE1BQU0sQ0FBQyxXQUFXLENBQUMsVUFBVSxFQUFFLFVBQVUsR0FBVSxFQUFFLEdBQVc7O2dCQUU5RCxJQUFJLEdBQUcsS0FBSyxJQUFJO29CQUFFLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQTs7Z0JBRTdCLElB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RztRQUNILEdBQUc7UUFDSCxHQUFHO1FBQ0gsR0FBRztRQUNILEdBQUc7UUFDSCxHQUFHO1FBQ0gsR0FBRztRQUNILEdBQUc7UUFDSCxHQUFHO1FBQ0gsR0FBRztRQUNILEdBQUc7UUFDSCxHQUFHO1FBQ0gsR0FBRztRQUNILEdBQUc7UUFDSCxHQUFHO1FBQ0gsR0FBRztRQUNILEdBQUc7UUFDSCxHQUFHO1FBQ0gsR0FBRztRQUNILEdBQUc7UUFDSCxHQUFHO1FBQ0gsSUFBSTtRQUNKLElBQUk7UUFDSixJQUFJO1FBQ0osSUFBSTtRQUNKLElBQUk7UUFDSixJQUFJO1FBQ0osSUFBSTtRQUNKLElBQUk7UUFDSixJQUFJO1FBQ0osSUFBSTtRQUNKLElBQUk7UUFDSixJQUFJO1FBQ0osSUFBSTtRQUNKLElBQUk7UUFDSixJQUFJO1FBQ0osSUFBSTtRQUNKLElBQUk7UUFDSixJQUFJO1FBQ0osSUFBSTtRQUNKLElBQUk7UUFDSixJQUFJO1FBQ0osSUFBSTtRQUNKLElBQUk7UUFDSixJQUFJO1FBQ0osSUFBSTtRQUNKLElBQUk7UUFDSixJQUFJO1FBQ0osSUFBSTtRQUNKLElBQUk7UUFDSixJQUFJO1FBQ0osSUFBSTtRQUNKLElBQUk7UUFDSixJQUFJO1FBQ0osSUFBSTtRQUNKLElBQUk7UUFDSixJQUFJO1FBQ0osSUFBSTtRQUNKLElBQUk7UUFDSixJQUFJO1FBQ0osSUFBSTtRQUNKLElBQUk7UUFDSixJQUFJO1FBQ0osSUFBSTtRQUNKLElBQUk7UUFDSixJQUFJO1FBQ0osSUFBSTtRQUNKLElBQUk7UUFDSixJQUFJO1FBQ0osSUFBSTtRQUNKLElBQUk7UUFDSixJQUFJO1FBQ0osSUFBSTtRQUNKLElBQUk7UUFDSixJQUFJO1FBQ0osSUFBSTtRQUNKLElBQUk7UUFDSixJQUFJO1FBQ0osSUFBSTtRQUNKLElBQUk7UUFDSixJQUFJO1FBQ0osSUFBSTtRQUNKLElBQUk7UUFDSixJQUFJO1FBQ0osSUFBSTtRQUNKLElBQUk7UUFDSixJQUFJO1FBQ0osSUFBSTtRQUNKLElBQUk7UUFDSixJQUFJO1FBQ0osSUFBSTtRQUNKLElBQUk7UUFDSixJQUFJO1FBQ0osSUFBSTtRQUNKLElBQUk7UUFDSixJQUFJO1FBQ0osSUFBSTtRQUNKLElBQUk7UUFDSixJQUFJO1FBQ0osSUFBSTtRQUNKLElBQUk7UUFDSixJQUFJO1FBQ0osSUFBSTtRQUNKLElBQUk7UUFDSixJQUFJO1FBQ0osSUFBSTtRQUNKLElBQUk7UUFDSixJQUFJO1FBQ0osSUFBSTtRQUNKLElBQUk7UUFDSixJQUFJO1FBQ0osSUFBSTtRQUNKLElBQUk7UUFDSixJQUFJO1FBQ0osSUFBSTtRQUNKLElBQUk7UUFDSixJQUFJO1FBQ0osSUFBSTtRQUNKLElBQUk7UUFDSixJQUFJO1FBQ0osSUFBSTtRQUNKLElBQUk7UUFDSixJQUFJO1FBQ0osSUFBSTtRQUNKLElBQUk7UUFDSixJQUFJO1FBQ0osSUFBSTtRQUNKLElBQUk7UUFDSixJQUFJO1FBQ0osSUFBSTtRQUNKLElBQUk7UUFDSixJQUFJO1FBQ0osSUFBSTtRQUNKLElBQUk7UUFDSixJQUFJO1FBQ0osSUFBSTtRQUNKLElBQUk7UUFDSixJQUFJO1FBQ0osSUFBSTtRQUNKLElBQUk7UUFDSixJQUFJO1FBQ0osSUFBSTtRQUNKLElBQUk7UUFDSixJQUFJO1FBQ0osSUFBSTtRQUNKLElBQUk7UUFDSixJQUFJO1FBQ0osSUFBSTtRQUNKLElBQUk7UUFDSixJQUFJO1FBQ0osSUFBSTtRQUNKLElBQUk7UUFDSixJQUFJO1FBQ0osSUFBSTtRQUNKLElBQUk7UUFDSixJQUFJO1FBQ0osSUFBSTtRQUNKLElBQUk7UUFDSixJQUFJO1FBQ0osSUFBSTtRQUNKLElBQUk7UUFDSixJQUFJO1FBQ0osSUFBSTtRQUNKLElBQUk7UUFDSixLQUFLO1FBQ0wsS0FBSztRQUNMLEtBQUs7UUFDTCxLQUFLO1FBQ0wsS0FBSztRQUNMLEtBQUs7UUFDTCxLQUFLO1FBQ0wsS0FBSztRQUNMLEtBQUs7UUFDTCxLQUFLO1FBQ0wsS0FBSztRQUNMLEtBQUs7UUFDTCxLQUFLO1FBQ0wsS0FBSztRQUNMLEtBQUs7UUFDTCxLQUFLO1FBQ0wsS0FBSztRQUNMLEtBQUs7UUFDTCxLQUFLO1FBQ0wsS0FBSztRQUNMLEtBQUs7UUFDTCxLQUFLO1FBQ0wsS0FBSztRQUNMLEtBQUs7UUFDTCxLQUFLO1FBQ0wsS0FBSztRQUNMLEtBQUs7UUFDTCxLQUFLO1FBQ0wsS0FBSztRQUNMLEtBQUs7UUFDTCxLQUFLO1FBQ0wsS0FBSztRQUNMLEtBQUs7UUFDTCxLQUFLO1FBQ0wsS0FBSztRQUNMLEtBQUs7UUFDTCxLQUFLO1FBQ0wsS0FBSztRQUNMLEtBQUs7UUFDTCxLQUFLO1FBQ0wsS0FBSztRQUNMLEtBQUs7UUFDTCxLQUFLO1FBQ0wsS0FBSztRQUNMLEtBQUs7UUFDTCxLQUFLO1FBQ0wsS0FBSztRQUNMLEtBQUs7UUFDTCxLQUFLO1FBQ0wsS0FBSztRQUNMLEtBQUs7UUFDTCxLQUFLO1FBQ0wsS0FBSztRQUNMLEtBQUs7UUFDTCxLQUFLO1FBQ0wsS0FBSztRQUNMLEtBQUs7UUFDTCxLQUFLO1FBQ0wsS0FBSztRQUNMLEtBQUs7UUFDTCxLQUFLO1FBQ0wsS0FBSztRQUNMLEtBQUs7UUFDTCxLQUFLO1FBQ0wsS0FBSztRQUNMLEtBQUs7UUFDTCxLQUFLO1FBQ0wsS0FBSztRQUNMLEtBQUs7UUFDTCxLQUFLO1FBQ0wsS0FBSztRQUNMLEtBQUs7UUFDTCxLQUFLO1FBQ0wsS0FBSztRQUNMLEtBQUs7UUFDTCxLQUFLO1FBQ0wsS0FBSztRQUNMLEtBQUs7UUFDTCxLQUFLO1FBQ0wsS0FBSztRQUNMLEtBQUs7UUFDTCxLQUFLO1FBQ0wsS0FBSztLQUNOLENBQUE7SUFFRCxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsV0FBVyxDQUFDLE1BQU0sS0FBSyxXQUFXLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUU7UUFDcEUsTUFBTSxDQUFDLEdBQUcsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFBO1FBQ3hCLElBQUksQ0FBQyxLQUFLLENBQUM7WUFBRSxPQUFPLElBQUksQ0FBQTthQUNuQixJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRTtZQUFFLE9BQU8sS0FBSyxDQUFBO0tBQ3BDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQXFCRCxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUE7SUFDVixNQUFNLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFBO0lBQ2hCLElBQUksR0FBRyxHQUFHLENBQUMsQ0FBQTtJQUNYLE9BQU8sR0FBRyxHQUFHLEVBQUUsS0FBSyxFQUFFLEVBQUU7UUFDdEIsR0FBRyxJQUFJLEVBQUUsQ0FBQTtRQUNULEVBQUUsQ0FBQyxDQUFBO0tBQ0o7SUFFRCxNQUFNLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFBO0lBRXZCLEdBQUc7UUFDRCxNQUFNLENBQUMsR0FBRyxXQUFXLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFBO1FBQzVCLElBQUksQ0FBQyxHQUFHQyxxQkFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUE7UUFDdkIsSUFBSSxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDO1lBQUUsU0FBUTtRQUNqQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUE7UUFDVCxPQUFPLENBQUMsR0FBRyxDQUFDLEVBQUU7WUFDWixDQUFDLEdBQUdBLHFCQUFNLENBQUMsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQTtZQUNwQixJQUFJLENBQUMsS0FBSyxDQUFDO2dCQUFFLE1BQUs7WUFDbEIsSUFBSSxDQUFDLEtBQUssRUFBRTtnQkFBRSxPQUFPLEtBQUssQ0FBQTtZQUMxQixDQUFDLEVBQUUsQ0FBQTtTQUNKO1FBQ0QsSUFBSSxDQUFDLEtBQUssQ0FBQztZQUFFLE9BQU8sS0FBSyxDQUFBO0tBQzFCLFFBQVEsRUFBRSxVQUFVLEtBQUssQ0FBQyxFQUFDO0lBRTVCLE9BQU8sSUFBSSxDQUFBO0FBQ2IsQ0FBQztBQVdELElBQW1CLFdBQVcsRUFBRTtJQUM5QixNQUFNLEVBQUUsVUFBVSxFQUFFLFlBQVksRUFBRSxHQUFHLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFBO0lBQzlELE1BQU0sUUFBUSxHQUFHLENBQUUsWUFBd0IsQ0FBQTs7SUFFM0MsSUFBSSxRQUFRLEVBQUU7UUFDWixVQUFVLENBQUMsRUFBRSxDQUFDLFNBQVMsRUFBRSxVQUFVLElBQXFCO1lBQ3RELE1BQU0sT0FBTyxHQUFHLGdCQUFnQixDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFBO1lBQzNELE1BQU0sR0FBRyxHQUFvQjtnQkFDM0IsT0FBTyxFQUFFLE9BQU87Z0JBQ2hCLEtBQUssRUFBRSxJQUFJLENBQUMsR0FBRztnQkFDZixFQUFFLEVBQUUsSUFBSSxDQUFDLEVBQUU7YUFDWixDQUFBO1lBQ0QsVUFBVSxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsQ0FBQTtTQUM1QixDQUFDLENBQUE7S0FDSDs7O0FDelpIOzs7Ozs7Ozs7Ozs7Ozs7U0FlZ0IsS0FBSyxDQUFFLFNBQWlCLEVBQUUsYUFBcUIsRUFBRTtJQUMvRCxJQUFJLFNBQVMsR0FBRyxDQUFDO1FBQUUsTUFBTSxJQUFJLFVBQVUsQ0FBQyx1QkFBdUIsQ0FBQyxDQUFBOztJQUdoRSxJQUFJLENBQUMsV0FBVyxFQUFFO1FBQ2hCLElBQUksR0FBRyxHQUFHLEVBQUUsQ0FBQTtRQUNaLEdBQUc7WUFDRCxHQUFHLEdBQUcsVUFBVSxDQUFDLFlBQVksQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQTtTQUNoRCxRQUFRLENBQUMsZ0JBQWdCLENBQUMsR0FBRyxFQUFFLFVBQVUsQ0FBQyxFQUFDO1FBQzVDLE9BQU8sSUFBSSxPQUFPLENBQUMsQ0FBQyxPQUFPLE9BQU8sT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFBLEVBQUUsQ0FBQyxDQUFBO0tBQ2xEO0lBQ0QsT0FBTyxJQUFJLE9BQU8sQ0FBQyxDQUFDLE9BQU8sRUFBRSxNQUFNO1FBQ2pDLE1BQU0sVUFBVSxHQUFhLEVBQUUsQ0FBQTtRQUMvQixNQUFNLFVBQVUsR0FBRyxDQUFDLEdBQW9CLEVBQUUsU0FBaUI7WUFDekQsSUFBSSxHQUFHLENBQUMsT0FBTyxFQUFFOztnQkFFZixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsVUFBVSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtvQkFDMUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsRUFBRSxDQUFBO2lCQUMxQjtnQkFDRCxPQUFPLFVBQVUsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO29CQUM1QixVQUFVLENBQUMsR0FBRyxFQUFFLENBQUE7aUJBQ2pCO2dCQUNELE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUE7YUFDbkI7aUJBQU07Z0JBQ0wsTUFBTSxHQUFHLEdBQUcsWUFBWSxDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsQ0FBQTtnQkFDekMsTUFBTSxHQUFHLEdBQUcsVUFBVSxDQUFDLEdBQUcsQ0FBQyxDQUFBO2dCQUMzQixJQUFJO29CQUNGLE1BQU0sV0FBVyxHQUFvQjt3QkFDbkMsR0FBRyxFQUFFLEdBQUc7d0JBQ1IsVUFBVSxFQUFFLFVBQVU7d0JBQ3RCLEVBQUUsRUFBRSxHQUFHLENBQUMsRUFBRTtxQkFDWCxDQUFBO29CQUNELFNBQVMsQ0FBQyxXQUFXLENBQUMsV0FBVyxDQUFDLENBQUE7aUJBQ25DO2dCQUFDLE9BQU8sS0FBSyxFQUFFOztpQkFFZjthQUNGO1NBQ0YsQ0FBQTtRQVFNO1lBQ0wsTUFBTSxFQUFFLElBQUksRUFBRSxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQTtZQUM5QixNQUFNLEVBQUUsTUFBTSxFQUFFLEdBQUcsT0FBTyxDQUFDLGdCQUFnQixDQUFDLENBQUE7WUFDNUMsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksRUFBRSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUU7Z0JBQzFDLE1BQU0sU0FBUyxHQUFHLElBQUksTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFBO2dCQUN4QyxTQUFTLENBQUMsRUFBRSxDQUFDLFNBQVMsRUFBRSxDQUFDLEdBQW9CLEtBQUssVUFBVSxDQUFDLEdBQUcsRUFBRSxTQUFTLENBQUMsQ0FBQyxDQUFBO2dCQUM3RSxVQUFVLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFBO2FBQzNCO1NBQ0Y7UUFDRCxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsVUFBVSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtZQUMxQyxRQUFRLENBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFVLEdBQXNCO2dCQUM3RCxNQUFNLEdBQUcsR0FBRyxVQUFVLENBQUMsR0FBRyxDQUFDLENBQUE7Z0JBQzNCLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUM7b0JBQ3hCLEdBQUcsRUFBRSxHQUFHO29CQUNSLFVBQVUsRUFBRSxVQUFVO29CQUN0QixFQUFFLEVBQUUsQ0FBQztpQkFDTixDQUFDLENBQUE7YUFDSCxDQUFDLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFBO1NBQ2pCO0tBQ0YsQ0FBQyxDQUFBO0FBQ0osQ0FBQztBQUVEOzs7Ozs7Ozs7Ozs7U0FZZ0IsU0FBUyxDQUFFLFNBQWlCLEVBQUUsYUFBcUIsRUFBRTtJQUNuRSxJQUFJLFNBQVMsR0FBRyxDQUFDO1FBQUUsTUFBTSxJQUFJLFVBQVUsQ0FBQyx1QkFBdUIsQ0FBQyxDQUFBO0lBQ2hFLElBQUksR0FBRyxHQUFHLEVBQUUsQ0FBQTtJQUNaLEdBQUc7UUFDRCxHQUFHLEdBQUcsVUFBVSxDQUFDLFlBQVksQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQTtLQUNoRCxRQUFRLENBQUMsZ0JBQWdCLENBQUMsR0FBRyxFQUFFLFVBQVUsQ0FBQyxFQUFDO0lBQzVDLE9BQU8sR0FBRyxDQUFBO0FBQ1o7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OyJ9
