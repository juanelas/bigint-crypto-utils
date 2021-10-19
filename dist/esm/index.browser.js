import { bitLength, eGcd, modInv, modPow, toZn } from 'bigint-mod-arith';
export { abs, bitLength, eGcd, gcd, lcm, max, min, modInv, modPow, toZn } from 'bigint-mod-arith';

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
        { // browser
            const buf = new Uint8Array(byteLength);
            self.crypto.getRandomValues(buf);
            // If fixed length is required we put the first bit to 1 -> to get the necessary bitLength
            if (forceLength)
                buf[0] = buf[0] | 128;
            resolve(buf);
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
    { // browser
        const buf = new Uint8Array(byteLength);
        self.crypto.getRandomValues(buf);
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
    const bitLen = bitLength(interval);
    let rnd;
    do {
        const buf = randBitsSync(bitLen);
        rnd = fromBuffer(buf);
    } while (rnd > interval);
    return rnd + min;
}

function _workerUrl(workerCode) {
    workerCode = `(() => {${workerCode}})()`; // encapsulate IIFE
    const _blob = new Blob([workerCode], { type: 'text/javascript' });
    return window.URL.createObjectURL(_blob);
}
let _useWorkers = false; // The following is just to check whether we can use workers
/* eslint-disable no-lone-blocks */
{ // Native JS
    if (self.Worker !== undefined)
        _useWorkers = true;
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
    { // browser
        return new Promise((resolve, reject) => {
            const worker = new Worker(_isProbablyPrimeWorkerUrl());
            worker.onmessage = (event) => {
                worker.terminate();
                resolve(event.data.isPrime);
            };
            worker.onmessageerror = (event) => {
                reject(event);
            };
            const msg = {
                rnd: w,
                iterations: iterations,
                id: 0
            };
            worker.postMessage(msg);
        });
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
        let z = modPow(b, m, w);
        if (z === 1n || z === d)
            continue;
        let j = 1;
        while (j < a) {
            z = modPow(z, 2n, w);
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
function _isProbablyPrimeWorkerUrl() {
    // Let's us first add all the required functions
    let workerCode = `'use strict';const ${eGcd.name}=${eGcd.toString()};const ${modInv.name}=${modInv.toString()};const ${modPow.name}=${modPow.toString()};const ${toZn.name}=${toZn.toString()};const ${randBitsSync.name}=${randBitsSync.toString()};const ${randBytesSync.name}=${randBytesSync.toString()};const ${randBetween.name}=${randBetween.toString()};const ${isProbablyPrime.name}=${_isProbablyPrime.toString()};${bitLength.toString()};${fromBuffer.toString()};`;
    workerCode += `onmessage=async function(_e){const _m={isPrime:await ${isProbablyPrime.name}(_e.data.rnd,_e.data.iterations),value:_e.data.rnd,id:_e.data.id};postMessage(_m);}`;
    return _workerUrl(workerCode);
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
        { // browser
            const workerURL = _isProbablyPrimeWorkerUrl();
            for (let i = 0; i < self.navigator.hardwareConcurrency - 1; i++) {
                const newWorker = new Worker(workerURL);
                newWorker.onmessage = (event) => _onmessage(event.data, newWorker);
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

export { isProbablyPrime, prime, primeSync, randBetween, randBits, randBitsSync, randBytes, randBytesSync };
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguYnJvd3Nlci5qcyIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3RzL2Zyb21CdWZmZXIudHMiLCIuLi8uLi9zcmMvdHMvcmFuZEJ5dGVzLnRzIiwiLi4vLi4vc3JjL3RzL3JhbmRCaXRzLnRzIiwiLi4vLi4vc3JjL3RzL3JhbmRCZXR3ZWVuLnRzIiwiLi4vLi4vc3JjL3RzL3dvcmtlclV0aWxzLnRzIiwiLi4vLi4vc3JjL3RzL2lzUHJvYmFibHlQcmltZS50cyIsIi4uLy4uL3NyYy90cy9wcmltZS50cyJdLCJzb3VyY2VzQ29udGVudCI6bnVsbCwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O1NBQWdCLFVBQVUsQ0FBRSxHQUFzQjtJQUNoRCxJQUFJLEdBQUcsR0FBRyxFQUFFLENBQUE7SUFDWixLQUFLLE1BQU0sQ0FBQyxJQUFJLEdBQUcsQ0FBQyxNQUFNLEVBQUUsRUFBRTtRQUM1QixNQUFNLEVBQUUsR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUE7UUFDcEIsR0FBRyxHQUFHLENBQUMsR0FBRyxJQUFJLEVBQUUsSUFBSSxFQUFFLENBQUE7S0FDdkI7SUFDRCxPQUFPLEdBQUcsQ0FBQTtBQUNaOztBQ1BBOzs7Ozs7Ozs7OztTQVdnQixTQUFTLENBQUUsVUFBa0IsRUFBRSxXQUFXLEdBQUcsS0FBSztJQUNoRSxJQUFJLFVBQVUsR0FBRyxDQUFDO1FBQUUsTUFBTSxJQUFJLFVBQVUsQ0FBQyx3QkFBd0IsQ0FBQyxDQUFBO0lBRWxFLE9BQU8sSUFBSSxPQUFPLENBQUMsVUFBVSxPQUFPLEVBQUUsTUFBTTtRQVVuQztZQUNMLE1BQU0sR0FBRyxHQUFHLElBQUksVUFBVSxDQUFDLFVBQVUsQ0FBQyxDQUFBO1lBQ3RDLElBQUksQ0FBQyxNQUFNLENBQUMsZUFBZSxDQUFDLEdBQUcsQ0FBQyxDQUFBOztZQUVoQyxJQUFJLFdBQVc7Z0JBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUE7WUFDdEMs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SCxHQUFHO1FBQ0gsR0FBRztRQUNILEdBQUc7UUFDSCxJQUFJO1FBQ0osSUFBSTtRQUNKLElBQUk7UUFDSixJQUFJO1FBQ0osSUFBSTtRQUNKLElBQUk7UUFDSixJQUFJO1FBQ0osSUFBSTtRQUNKLElBQUk7UUFDSixJQUFJO1FBQ0osSUFBSTtRQUNKLElBQUk7UUFDSixJQUFJO1FBQ0osSUFBSTtRQUNKLElBQUk7UUFDSixJQUFJO1FBQ0osSUFBSTtRQUNKLElBQUk7UUFDSixJQUFJO1FBQ0osSUFBSTtRQUNKLElBQUk7UUFDSixJQUFJO1FBQ0osSUFBSTtRQUNKLElBQUk7UUFDSixJQUFJO1FBQ0osSUFBSTtRQUNKLElBQUk7UUFDSixJQUFJO1FBQ0osSUFBSTtRQUNKLElBQUk7UUFDSixJQUFJO1FBQ0osSUFBSTtRQUNKLElBQUk7UUFDSixJQUFJO1FBQ0osSUFBSTtRQUNKLElBQUk7UUFDSixJQUFJO1FBQ0osSUFBSTtRQUNKLElBQUk7UUFDSixJQUFJO1FBQ0osSUFBSTtRQUNKLElBQUk7UUFDSixJQUFJO1FBQ0osSUFBSTtRQUNKLElBQUk7UUFDSixJQUFJO1FBQ0osSUFBSTtRQUNKLElBQUk7UUFDSixJQUFJO1FBQ0osSUFBSTtRQUNKLElBQUk7UUFDSixJQUFJO1FBQ0osSUFBSTtRQUNKLElBQUk7UUFDSixJQUFJO1FBQ0osSUFBSTtRQUNKLElBQUk7UUFDSixJQUFJO1FBQ0osSUFBSTtRQUNKLElBQUk7UUFDSixJQUFJO1FBQ0osSUFBSTtRQUNKLElBQUk7UUFDSixJQUFJO1FBQ0osSUFBSTtRQUNKLElBQUk7UUFDSixJQUFJO1FBQ0osSUFBSTtRQUNKLElBQUk7UUFDSixJQUFJO1FBQ0osSUFBSTtRQUNKLElBQUk7UUFDSixJQUFJO1FBQ0osSUFBSTtRQUNKLElBQUk7UUFDSixJQUFJO1FBQ0osSUFBSTtRQUNKLElBQUk7UUFDSixJQUFJO1FBQ0osSUFBSTtRQUNKLElBQUk7UUFDSixJQUFJO1FBQ0osSUFBSTtRQUNKLElBQUk7UUFDSixJQUFJO1FBQ0osSUFBSTtRQUNKLElBQUk7UUFDSixJQUFJO1FBQ0osSUFBSTtRQUNKLElBQUk7UUFDSixJQUFJO1FBQ0osSUFBSTtRQUNKLElBQUk7UUFDSixJQUFJO1FBQ0osSUFBSTtRQUNKLElBQUk7UUFDSixJQUFJO1FBQ0osSUFBSTtRQUNKLElBQUk7UUFDSixJQUFJO1FBQ0osSUFBSTtRQUNKLElBQUk7UUFDSixJQUFJO1FBQ0osSUFBSTtRQUNKLElBQUk7UUFDSixJQUFJO1FBQ0osSUFBSTtRQUNKLElBQUk7UUFDSixJQUFJO1FBQ0osSUFBSTtRQUNKLElBQUk7UUFDSixJQUFJO1FBQ0osSUFBSTtRQUNKLElBQUk7UUFDSixJQUFJO1FBQ0osSUFBSTtRQUNKLElBQUk7UUFDSixJQUFJO1FBQ0osSUFBSTtRQUNKLElBQUk7UUFDSixJQUFJO1FBQ0osSUFBSTtRQUNKLElBQUk7UUFDSixJQUFJO1FBQ0osSUFBSTtRQUNKLElBQUk7UUFDSixJQUFJO1FBQ0osSUFBSTtRQUNKLElBQUk7UUFDSixJQUFJO1FBQ0osSUFBSTtRQUNKLElBQUk7UUFDSixJQUFJO1FBQ0osSUFBSTtRQUNKLElBQUk7UUFDSixJQUFJO1FBQ0osSUFBSTtRQUNKLElBQUk7UUFDSixJQUFJO1FBQ0osSUFBSTtRQUNKLElBQUk7UUFDSixJQUFJO1FBQ0osSUFBSTtRQUNKLEtBQUs7UUFDTCxLQUFLO1FBQ0wsS0FBSztRQUNMLEtBQUs7UUFDTCxLQUFLO1FBQ0wsS0FBSztRQUNMLEtBQUs7UUFDTCxLQUFLO1FBQ0wsS0FBSztRQUNMLEtBQUs7UUFDTCxLQUFLO1FBQ0wsS0FBSztRQUNMLEtBQUs7UUFDTCxLQUFLO1FBQ0wsS0FBSztRQUNMLEtBQUs7UUFDTCxLQUFLO1FBQ0wsS0FBSztRQUNMLEtBQUs7UUFDTCxLQUFLO1FBQ0wsS0FBSztRQUNMLEtBQUs7UUFDTCxLQUFLO1FBQ0wsS0FBSztRQUNMLEtBQUs7UUFDTCxLQUFLO1FBQ0wsS0FBSztRQUNMLEtBQUs7UUFDTCxLQUFLO1FBQ0wsS0FBSztRQUNMLEtBQUs7UUFDTCxLQUFLO1FBQ0wsS0FBSztRQUNMLEtBQUs7UUFD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
