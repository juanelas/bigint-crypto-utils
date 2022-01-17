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

export { abs, bitLength, eGcd, gcd, isProbablyPrime, lcm, max, min, modInv, modPow, prime, primeSync, randBetween, randBits, randBitsSync, randBytes, randBytesSync, toZn };
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguYnJvd3Nlci5qcyIsInNvdXJjZXMiOlsiLi4vLi4vbm9kZV9tb2R1bGVzL2JpZ2ludC1tb2QtYXJpdGgvZGlzdC9lc20vaW5kZXguYnJvd3Nlci5qcyIsIi4uLy4uL3NyYy90cy9mcm9tQnVmZmVyLnRzIiwiLi4vLi4vc3JjL3RzL3JhbmRCeXRlcy50cyIsIi4uLy4uL3NyYy90cy9yYW5kQml0cy50cyIsIi4uLy4uL3NyYy90cy9yYW5kQmV0d2Vlbi50cyIsIi4uLy4uL3NyYy90cy93b3JrZXJVdGlscy50cyIsIi4uLy4uL3NyYy90cy9pc1Byb2JhYmx5UHJpbWUudHMiLCIuLi8uLi9zcmMvdHMvcHJpbWUudHMiXSwic291cmNlc0NvbnRlbnQiOm51bGwsIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUyxHQUFHLENBQUMsQ0FBQyxFQUFFO0FBQ2hCLElBQUksT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO0FBQzdCLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVMsU0FBUyxDQUFDLENBQUMsRUFBRTtBQUN0QixJQUFJLElBQUksT0FBTyxDQUFDLEtBQUssUUFBUTtBQUM3QixRQUFRLENBQUMsR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDdEIsSUFBSSxJQUFJLENBQUMsS0FBSyxFQUFFLEVBQUU7QUFDbEIsUUFBUSxPQUFPLENBQUMsQ0FBQztBQUNqQixLQUFLO0FBQ0wsSUFBSSxJQUFJLElBQUksR0FBRyxDQUFDLENBQUM7QUFDakIsSUFBSSxHQUFHO0FBQ1AsUUFBUSxJQUFJLEVBQUUsQ0FBQztBQUNmLEtBQUssUUFBUSxDQUFDLENBQUMsS0FBSyxFQUFFLElBQUksRUFBRSxFQUFFO0FBQzlCLElBQUksT0FBTyxJQUFJLENBQUM7QUFDaEIsQ0FBQztBQUNEO0FBQ0E7QUFD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QUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQzVCLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFO0FBQ25CLElBQUksT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUM1QixDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUyxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRTtBQUNwQixJQUFJLElBQUksT0FBTyxDQUFDLEtBQUssUUFBUTtBQUM3QixRQUFRLENBQUMsR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDdEIsSUFBSSxJQUFJLE9BQU8sQ0FBQyxLQUFLLFFBQVE7QUFDN0IsUUFBUSxDQUFDLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3RCLElBQUksSUFBSSxDQUFDLElBQUksRUFBRSxFQUFFO0FBQ2pCLFFBQVEsTUFBTSxJQUFJLFVBQVUsQ0FBQyxlQUFlLENBQUMsQ0FBQztBQUM5QyxLQUFLO0FBQ0wsSUFBSSxNQUFNLEdBQUcsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ3RCLElBQUksT0FBTyxDQUFDLEdBQUcsR0FBRyxFQUFFLElBQUksR0FBRyxHQUFHLENBQUMsR0FBRyxHQUFHLENBQUM7QUFDdEMsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUU7QUFDdEIsSUFBSSxNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUNy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QUFHO1FBQ0gsR0FBRztRQUNILEdBQUc7UUFDSCxHQUFHO1FBQ0gsR0FBRztRQUNILEdBQUc7UUFDSCxHQUFHO1FBQ0gsR0FBRztRQUNILEdBQUc7UUFDSCxHQUFHO1FBQ0gsR0FBRztRQUNILEdBQUc7UUFDSCxHQUFHO1FBQ0gsR0FBRztRQUNILElBQUk7UUFDSixJQUFJO1FBQ0osSUFBSTtRQUNKLElBQUk7UUFDSixJQUFJO1FBQ0osSUFBSTtRQUNKLElBQUk7UUFDSixJQUFJO1FBQ0osSUFBSTtRQUNKLElBQUk7UUFDSixJQUFJO1FBQ0osSUFBSTtRQUNKLElBQUk7UUFDSixJQUFJO1FBQ0osSUFBSTtRQUNKLElBQUk7UUFDSixJQUFJO1FBQ0osSUFBSTtRQUNKLElBQUk7UUFDSixJQUFJO1FBQ0osSUFBSTtRQUNKLElBQUk7UUFDSixJQUFJO1FBQ0osSUFBSTtRQUNKLElBQUk7UUFDSixJQUFJO1FBQ0osSUFBSTtRQUNKLElBQUk7UUFDSixJQUFJO1FBQ0osSUFBSTtRQUNKLElBQUk7UUFDSixJQUFJO1FBQ0osSUFBSTtRQUNKLElBQUk7UUFDSixJQUFJO1FBQ0osSUFBSTtRQUNKLElBQUk7UUFDSixJQUFJO1FBQ0osSUFBSTtRQUNKLElBQUk7UUFDSixJQUFJO1FBQ0osSUFBSTtRQUNKLElBQUk7UUFDSixJQUFJO1FBQ0osSUFBSTtRQUNKLElBQUk7UUFDSixJQUFJO1FBQ0osSUFBSTtRQUNKLElBQUk7UUFDSixJQUFJO1FBQ0osSUFBSTtRQUNKLElBQUk7UUFDSixJQUFJO1FBQ0osSUFBSTtRQUNKLElBQUk7UUFDSixJQUFJO1FBQ0osSUFBSTtRQUNKLElBQUk7UUFDSixJQUFJO1FBQ0osSUFBSTtRQUNKLElBQUk7UUFDSixJQUFJO1FBQ0osSUFBSTtRQUNKLElBQUk7UUFDSixJQUFJO1FBQ0osSUFBSTtRQUNKLElBQUk7UUFDSixJQUFJO1FBQ0osSUFBSTtRQUNKLElBQUk7UUFDSixJQUFJO1FBQ0osSUFBSTtRQUNKLElBQUk7UUFDSixJQUFJO1FBQ0osSUFBSTtRQUNKLElBQUk7UUFDSixJQUFJO1FBQ0osSUFBSTtRQUNKLElBQUk7UUFDSixJQUFJO1FBQ0osSUFBSTtRQUNKLElBQUk7UUFDSixJQUFJO1FBQ0osSUFBSTtRQUNKLElBQUk7UUFDSixJQUFJO1FBQ0osSUFBSTtRQUNKLElBQUk7UUFDSixJQUFJO1FBQ0osSUFBSTtRQUNKLElBQUk7UUFDSixJQUFJO1FBQ0osSUFBSTtRQUNKLElBQUk7UUFDSixJQUFJO1FBQ0osSUFBSTtRQUNKLElBQUk7UUFDSixJQUFJO1FBQ0osSUFBSTtRQUNKLElBQUk7UUFDSixJQUFJO1FBQ0osSUFBSTtRQUNKLElBQUk7UUFDSixJQUFJO1FBQ0osSUFBSTtRQUNKLElBQUk7UUFDSixJQUFJO1FBQ0osSUFBSTtRQUNKLElBQUk7UUFDSixJQUFJO1FBQ0osSUFBSTtRQUNKLElBQUk7UUFDSixJQUFJO1FBQ0osSUFBSTtRQUNKLElBQUk7UUFDSixJQUFJO1FBQ0osSUFBSTtRQUNKLElBQUk7UUFDSixJQUFJO1FBQ0osSUFBSTtRQUNKLElBQUk7UUFDSixJQUFJO1FBQ0osSUFBSTtRQUNKLElBQUk7UUFDSixJQUFJO1FBQ0osSUFBSTtRQUNKLElBQUk7UUFDSixJQUFJO1FBQ0osSUFBSTtRQUNKLElBQUk7UUFDSixJQUFJO1FBQ0osSUFBSTtRQUNKLElBQUk7UUFDSixJQUFJO1FBQ0osSUFBSTtRQUNKLElBQUk7UUFDSixJQUFJO1FBQ0osSUFBSTtRQUNKLElBQUk7UUFDSixJQUFJO1FBQ0osSUFBSTtRQUNKLElBQUk7UUFDSixJQUFJO1FBQ0osS0FBSztRQUNMLEtBQUs7UUFDTCxLQUFLO1FBQ0wsS0FBSztRQUNMLEtBQUs7UUFDTCxLQUFLO1FBQ0wsS0FBSztRQUNMLEtBQUs7UUFDTCxLQUFLO1FBQ0wsS0FBSztRQUNMLEtBQUs7UUFDTCxLQUFLO1FBQ0wsS0FBSztRQUNMLEtBQUs7UUFDTCxLQUFLO1FBQ0wsS0FBSztRQUNMLEtBQUs7UUFDTCxLQUFLO1FBQ0wsS0FBSztRQUNMLEtBQUs7UUFDTCxLQUFLO1FBQ0wsS0FBSztRQUNMLEtBQUs7UUFDTCxLQUFLO1FBQ0wsS0FBSztRQUNMLEtBQUs7UUFDTCxLQUFLO1FBQ0wsS0FBSztRQUNMLEtBQUs7UUFDTCxLQUFLO1FBQ0wsS0FBSztRQUNMLEtBQUs7UUFDTCxLQUFLO1FBQ0wsS0FBSztRQUNMLEtBQUs7UUFDTCxLQUFLO1FBQ0wsS0FBSztRQUNMLEtBQUs7UUFDTCxLQUFLO1FBQ0wsS0FBSztRQUNMLEtBQUs7UUFDTCxLQUFLO1FBQ0wsS0FBSztRQUNMLEtBQUs7UUFDTCxLQUFLO1FBQ0wsS0FBSztRQUNMLEtBQUs7UUFDTCxLQUFLO1FBQ0wsS0FBSztRQUNMLEtBQUs7UUFDTCxLQUFLO1FBQ0wsS0FBSztRQUNMLEtBQUs7UUFDTCxLQUFLO1FBQ0wsS0FBSztRQUNMLEtBQUs7UUFDTCxLQUFLO1FBQ0wsS0FBSztRQUNMLEtBQUs7UUFDTCxLQUFLO1FBQ0wsS0FBSztRQUNMLEtBQUs7UUFDTCxLQUFLO1FBQ0wsS0FBSztRQUNMLEtBQUs7UUFDTCxLQUFLO1FBQ0wsS0FBSztRQUNMLEtBQUs7UUFDTCxLQUFLO1FBQ0wsS0FBSztRQUNMLEtBQUs7UUFDTCxLQUFLO1FBQ0wsS0FBSztRQUNMLEtBQUs7UUFDTCxLQUFLO1FBQ0wsS0FBSztRQUNMLEtBQUs7UUFDTCxLQUFLO1FBQ0wsS0FBSztRQUNMLEtBQUs7UUFDTCxLQUFLO1FBQ0wsS0FBSztRQUNMLEtBQUs7S0FDTixDQUFBO0lBRUQsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFdBQVcsQ0FBQyxNQUFNLEtBQUssV0FBVyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFO1FBQ3BFLE1BQU0sQ0FBQyxHQUFHLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQTtRQUN4QixJQUFJLENBQUMsS0FBSyxDQUFDO1lBQUUsT0FBTyxJQUFJLENBQUE7YUFDbkIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUU7WUFBRSxPQUFPLEtBQUssQ0FBQTtLQUNwQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUFx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
