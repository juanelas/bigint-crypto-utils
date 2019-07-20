'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const _ZERO = BigInt(0);
const _ONE = BigInt(1);
const _TWO = BigInt(2);

/**
 * Absolute value. abs(a)==a if a>=0. abs(a)==-a if a<0
 *  
 * @param {number|bigint} a 
 * 
 * @returns {bigint} the absolute value of a
 */
function abs(a) {
    a = BigInt(a);
    return (a >= _ZERO) ? a : -a;
}

/**
 * Returns the bitlength of a number. If it is signed it omits the sign. bitLength(-2) = bitLength(2)
 * 
 * @param {number|bigint} a  
 * @returns {number} - the bit length
 */
function bitLength(a) {
    return wordLength(a, 1);
}

/**
 * @typedef {Object} egcdReturn A triple (g, x, y), such that ax + by = g = gcd(a, b).
 * @property {bigint} g
 * @property {bigint} x 
 * @property {bigint} y
 */
/**
 * An iterative implementation of the extended euclidean algorithm or extended greatest common divisor algorithm. 
 * Take positive integers a, b as input, and return a triple (g, x, y), such that ax + by = g = gcd(a, b).
 * 
 * @param {number|bigint} a 
 * @param {number|bigint} b 
 * 
 * @returns {egcdReturn} A triple (g, x, y), such that ax + by = g = gcd(a, b).
 */
function eGcd(a, b) {
    a = BigInt(a);
    b = BigInt(b);
    if (a <= _ZERO | b <= _ZERO)
        return NaN; // a and b MUST be positive

    let x = _ZERO;
    let y = _ONE;
    let u = _ONE;
    let v = _ZERO;

    while (a !== _ZERO) {
        let q = b / a;
        let r = b % a;
        let m = x - (u * q);
        let n = y - (v * q);
        b = a;
        a = r;
        x = u;
        y = v;
        u = m;
        v = n;
    }
    return {
        b: b,
        x: x,
        y: y
    };
}

/**
 * Greatest-common divisor of two integers based on the iterative binary algorithm.
 * 
 * @param {number|bigint} a 
 * @param {number|bigint} b 
 * 
 * @returns {bigint} The greatest common divisor of a and b
 */
function gcd(a, b) {
    a = abs(a);
    b = abs(b);
    if (a === _ZERO)
        return b;
    else if (b === _ZERO)
        return a;

    let shift = _ZERO;
    while (!((a | b) & _ONE)) {
        a >>= _ONE;
        b >>= _ONE;
        shift++;
    }
    while (!(a & _ONE)) a >>= _ONE;
    do {
        while (!(b & _ONE)) b >>= _ONE;
        if (a > b) {
            let x = a;
            a = b;
            b = x;
        }
        b -= a;
    } while (b);

    // rescale
    return a << shift;
}

/**
 * The test first tries if any of the first 250 small primes are a factor of the input number and then passes several 
 * iterations of Miller-Rabin Probabilistic Primality Test (FIPS 186-4 C.3.1)
 * 
 * @param {number|bigint} w An integer to be tested for primality
 * @param {number} iterations The number of iterations for the primality test. The value shall be consistent with Table C.1, C.2 or C.3
 * 
 * @return {Promise} A promise that resolves to a boolean that is either true (a probably prime number) or false (definitely composite)
 */
async function isProbablyPrime(w, iterations = 16) {
    if (typeof w === 'number') {
        w = BigInt(w);
    }
    { // Node.js
        if (_useWorkers) {
            const { Worker } = require('worker_threads');
            return new Promise((resolve, reject) => {
                const worker = new Worker(__filename);

                worker.on('message', (data) => {
                    worker.terminate();
                    resolve(data.isPrime);
                });

                worker.on('error', reject);

                worker.postMessage({
                    'rnd': w,
                    'iterations': iterations,
                    'id': 0

                });
            });
        } else {
            return new Promise((resolve) => {
                resolve(_isProbablyPrime(w, iterations));
            });
        }
    }
}

/**
 * The least common multiple computed as abs(a*b)/gcd(a,b)
 * @param {number|bigint} a 
 * @param {number|bigint} b 
 * 
 * @returns {bigint} The least common multiple of a and b
 */
function lcm(a, b) {
    a = BigInt(a);
    b = BigInt(b);
    if (a === _ZERO && b === _ZERO)
        return _ZERO;
    return abs(a * b) / gcd(a, b);
}

/**
 * Modular inverse.
 * 
 * @param {number|bigint} a The number to find an inverse for
 * @param {number|bigint} n The modulo
 * 
 * @returns {bigint} the inverse modulo n or NaN if it does not exist
 */
function modInv(a, n) {
    if (a == _ZERO | n <= _ZERO)
        return NaN;

    let egcd = eGcd(toZn(a, n), n);
    if (egcd.b !== _ONE) {
        return NaN; // modular inverse does not exist
    } else {
        return toZn(egcd.x, n);
    }
}

/**
 * Modular exponentiation b**e mod n. 
 * Several modular exponentiation algorithms have been developed for testing purposes. However, 
 * with BigInt native, left-to-right binary exponentiation outperformns all the others: 
 *  - k-ary is disappointingly slow, even with precomputed values for the powers of g. 
 *  - Montgomery implementations are more than 4 times slower than their non-reduced counterparts
 * 
 * @param {number|bigint} g base
 * @param {number|bigint} e exponent
 * @param {number|bigint} m modulo
 * @param {number} algorithm the algorithm to compute the exponentiation. It could be:
 *  0 - left-to-right binary exponentiation;
 *  1 - right-to-left binary exponentiation;
 *  2 - left-to-right k-ary exponentiation;
 *  3 - left-to-right binary exponentiation with Montgomery Multplication;
 *  4 - right-to-left binary exponentiation with Montgomery Multplication;
 *  5 - left-to-right binary exponentiation with Montgomery Redc;
 *  6 - right-to-left binary exponentiation with Montgomery Redc;
 * @param {number} baseBits bits for the montgomery base or k=2^baseBits in the k-ary method. Only for algorithm >= 2.
 * @param {object} gPowers only for algorithm 2. An array with the precomputed powers of g. gPowers.length is 2^baseBits and gPowers[i] = g^i.
 * 
 * @returns {bigint} g^e mod m
 */
function modPow(g, e, m, algorithm = 0, baseBits = 64, gPowers) {
    m = BigInt(m);
    if (m === _ZERO)
        return NaN;
    else if (m === _ONE)
        return _ZERO;

    g = toZn(g, m);

    e = BigInt(e);
    if (e < _ZERO) {
        return modInv(modPow(g, abs(e), m, algorithm, baseBits), m);
    }

    switch (Number(algorithm)) {
        case 0:
            return _modPowLeftToRightBinary(g, e, m);
        case 1:
            return _modPowRightToLeftBinary(g, e, m);
        case 2:
            if (gPowers)
                return _modPowLeftToRightKary(gPowers, e, m, baseBits);
            else
                return _modPowLeftToRightKary(g, e, m, baseBits);
        case 3:
            return _modPowLeftToRightBinaryMontgomery(g, e, m, baseBits);
        case 4:
            return _modPowRightToLeftBinaryMontgomery(g, e, m, baseBits);
        case 5:
            return _modPowLeftToRightBinaryRedc(g, e, m, baseBits);
        case 6:
            return _modPowRightToLeftBinaryRedc(g, e, m, baseBits);
        default:
            return _modPowLeftToRightBinary(g, e, m);
    }
}

/**
 * Class representing a Montgomery domain
 */
class Mont {
    /**
     * Creates a Montgomery domain where R is chosen as the smallest power of 2 s.t. R > m
     * 
     * @param {bigint} m modulo (MUST be odd) 
     */
    constructor(m, baseBits = 512) {
        if (m % _TWO === _ZERO) { // as b is a power of 2, gcd(m,b) == 1 if m is odd
            throw new Error('In a Montgomery domain with R a power of 2, the module MUST be odd');
        }
        this.m = m;
        this.baseBits = BigInt(baseBits);
        this.b = _TWO ** this.baseBits;
        this.wLen = BigInt(wordLength(m, baseBits));
        this.RBits = this.baseBits * this.wLen;
        this.R = _TWO ** this.RBits;
        this.Rsqr = (this.R ** _TWO) % m;
        let mPrime = - modInv(m, this.R);
        if (abs(mPrime) > (m / _TWO)) { // mPrime appears in products so its better to use the smallest version (either positive or negative)
            mPrime = toZn(mPrime, this.R);
        }
        this.mPrime = mPrime;
    }

    /**
     * Returns a representation of x in this Montgomery domain
     * @param {bigint} x 
     * 
     * @returns {bigint} x·R mod m
     */
    toMont(x) {
        return this.redc(x * this.Rsqr);
    }

    /**
     * The Montgomery reduction
     * @param {bigint} x
     * 
     * @returns {bigint} x R⁻¹ mod m 
     */
    redc(x) {
        let y = (x * this.mPrime) % this.R;
        if (y < _ZERO) {
            y += this.R;
        }
        const ret = (x + y * this.m) >> this.RBits;
        if (ret >= this.m) {
            return ret - this.m;
        }
        return ret; // x * R^(-1) mod m
    }

    /**
     * Montgomery multiplication. 
     * Based on the Algorithm 14.36 from the book Handbook of applied cryptography by Menezes, Van Oorschot and Vanstone.
     * It combines Montgomery reduction (Algorithm 14.32) and multiple-precision multiplication (Algorithm 14.12) to compute the Montgomery reduction of the product of two integers x, y modulo m.
     * 
     * @param {bigint} x 
     * @param {bigint} y 
     * 
     * @returns {bigint} x*y*R^(-1) mod m
     */
    mul(x, y) {
        let A = _ZERO;
        const _mask = (this.b - _ONE);
        const y_0 = y & _mask;
        for (let i = 0; i < this.wLen; i++) {
            const a_0 = A & _mask;
            const x_i = x & _mask;
            let u_i = (((a_0 + x_i * y_0) % this.b) * this.mPrime) % this.b;
            if (u_i < _ZERO) {
                u_i += this.base;
            }
            A = (A + x_i * y + u_i * this.m) >> this.baseBits;
            if (x > _ZERO) {
                x >>= this.baseBits;
            }
        }
        if (A >= this.m) {
            A -= this.m;
        }
        return A;
    }
}

/**
 * A probably-prime (Miller-Rabin), cryptographically-secure, random-number generator. 
 * The browser version uses web workers to parallelise prime look up. Therefore, it does not lock the UI 
 * main process, and it can be much faster (if several cores or cpu are available). 
 * The node version can also use worker_threads if they are available (enabled by default with Node 11 and 
 * and can be enabled at runtime executing node --experimental-worker with node >=10.5.0).
 * 
 * @param {number} bitLength The required bit length for the generated prime
 * @param {number} iterations The number of iterations for the Miller-Rabin Probabilistic Primality Test
 * 
 * @returns {Promise} A promise that resolves to a bigint probable prime of bitLength bits
 */
function prime(bitLength, iterations = 16) {
    if (bitLength < 1)
        throw new RangeError(`bitLength MUST be > 0 and it is ${bitLength}`);

    if (!_useWorkers) {
        let rnd = _ZERO;
        do {
            rnd = _fromBuffer(randBytesSync(bitLength / 8, true));
        } while (!_isProbablyPrime(rnd, iterations));
        return new Promise((resolve) => { resolve(rnd); });
    }
    return new Promise((resolve) => {
        let workerList = [];
        const _onmessage = (msg, newWorker) => {
            if (msg.isPrime) {
                // if a prime number has been found, stop all the workers, and return it
                for (let j = 0; j < workerList.length; j++) {
                    workerList[j].terminate();
                }
                while (workerList.length) {
                    workerList.pop();
                }
                resolve(msg.value);
            } else { // if a composite is found, make the worker test another random number
                let buf = randBits(bitLength, true);
                let rnd = _fromBuffer(buf);
                try {
                    newWorker.postMessage({
                        'rnd': rnd,
                        'iterations': iterations,
                        'id': msg.id
                    });
                } catch (error) {
                    // The worker has already terminated. There is nothing to handle here
                }
            }
        };
        { // Node.js
            const { cpus } = require('os');
            const { Worker } = require('worker_threads');
            for (let i = 0; i < cpus().length; i++) {
                let newWorker = new Worker(__filename);
                newWorker.on('message', (msg) => _onmessage(msg, newWorker));
                workerList.push(newWorker);
            }
        }
        for (let i = 0; i < workerList.length; i++) {
            let buf = randBits(bitLength, true);
            let rnd = _fromBuffer(buf);
            workerList[i].postMessage({
                'rnd': rnd,
                'iterations': iterations,
                'id': i
            });
        }
    });
}

/**
 * Returns a cryptographically secure random integer between [min,max]
 * @param {bigint} max Returned value will be <= max
 * @param {bigint} min Returned value will be >= min
 * 
 * @returns {bigint} A cryptographically secure random bigint between [min,max]
 */
function randBetween(max, min = _ONE) {
    if (max <= min) throw new Error('max must be > min');
    const interval = max - min;
    let bitLen = bitLength(interval);
    let rnd;
    do {
        let buf = randBits(bitLen);
        rnd = _fromBuffer(buf);
    } while (rnd > interval);
    return rnd + min;
}

/**
 * Secure random bits for both node and browsers. Node version uses crypto.randomFill() and browser one self.crypto.getRandomValues()
 * 
 * @param {number} bitLength The desired number of random bits
 * @param {boolean} forceLength If we want to force the output to have a specific bit length. It basically forces the msb to be 1
 * 
 * @returns {Buffer|Uint8Array} A Buffer/UInt8Array (Node.js/Browser) filled with cryptographically secure random bits
 */
function randBits(bitLength, forceLength = false) {
    if (bitLength < 1)
        throw new RangeError(`bitLength MUST be > 0 and it is ${bitLength}`);

    const byteLength = Math.ceil(bitLength / 8);
    let rndBytes = randBytesSync(byteLength, false);
    // Fill with 0's the extra bits
    rndBytes[0] = rndBytes[0] & (2 ** (bitLength % 8) - 1);
    if (forceLength) {
        let mask = (bitLength % 8) ? 2 ** ((bitLength % 8) - 1) : 128;
        rndBytes[0] = rndBytes[0] | mask;
    }
    return rndBytes;
}

/**
 * Secure random bytes for both node and browsers. Node version uses crypto.randomFill() and browser one self.crypto.getRandomValues()
 * 
 * @param {number} byteLength The desired number of random bytes
 * @param {boolean} forceLength If we want to force the output to have a bit length of 8*byteLength. It basically forces the msb to be 1
 * 
 * @returns {Promise} A promise that resolves to a Buffer/UInt8Array (Node.js/Browser) filled with cryptographically secure random bytes
 */
function randBytes(byteLength, forceLength = false) {
    if (byteLength < 1)
        throw new RangeError(`byteLength MUST be > 0 and it is ${byteLength}`);

    let buf;
    {  // node
        const crypto = require('crypto');
        buf = Buffer.alloc(byteLength);
        return crypto.randomFill(buf, function (resolve) {
            // If fixed length is required we put the first bit to 1 -> to get the necessary bitLength
            if (forceLength)
                buf[0] = buf[0] | 128;
            resolve(buf);
        });
    }
}

/**
 * Secure random bytes for both node and browsers. Node version uses crypto.randomFill() and browser one self.crypto.getRandomValues()
 * 
 * @param {number} byteLength The desired number of random bytes
 * @param {boolean} forceLength If we want to force the output to have a bit length of 8*byteLength. It basically forces the msb to be 1
 * 
 * @returns {Buffer|Uint8Array} A Buffer/UInt8Array (Node.js/Browser) filled with cryptographically secure random bytes
 */
function randBytesSync(byteLength, forceLength = false) {
    if (byteLength < 1)
        throw new RangeError(`byteLength MUST be > 0 and it is ${byteLength}`);

    let buf;
    {  // node
        const crypto = require('crypto');
        buf = Buffer.alloc(byteLength);
        crypto.randomFillSync(buf);
    }
    // If fixed length is required we put the first bit to 1 -> to get the necessary bitLength
    if (forceLength)
        buf[0] = buf[0] | 128;
    return buf;
}

/**
 * Finds the smallest positive element that is congruent to a in modulo n
 * @param {number|bigint} a An integer
 * @param {number|bigint} n The modulo
 * 
 * @returns {bigint} The smallest positive representation of a in modulo n
 */
function toZn(a, n) {
    n = BigInt(n);
    if (n <= 0)
        return NaN;

    a = BigInt(a) % n;
    return (a < 0) ? a + n : a;
}

/**
 * Returns the the digits of a number in words of wordBits bits. If it is signed it omits the sign:
 *  wordLength(-1461714354, 16) = wordLength(1461714354, 16) = 
 * @param {*} a 
 * @param {*} wordBits 
 */
function wordLength(a, wordBits) { // Returns 
    a = abs(a);
    wordBits = BigInt(wordBits);
    let digits = 1;
    while ((a >>= wordBits) > _ZERO) {
        digits++;
    }
    return digits;
}

/* HELPER FUNCTIONS */

function _fromBuffer(buf) {
    let ret = _ZERO;
    for (let i of buf.values()) {
        let bi = BigInt(i);
        ret = (ret << BigInt(8)) + bi;
    }
    return ret;
}

function _isProbablyPrime(w, iterations = 16) {
    /*
	PREFILTERING. Even values but 2 are not primes, so don't test. 
	1 is not a prime and the M-R algorithm needs w>1.
	*/
    if (w === _TWO)
        return true;
    else if ((w & _ONE) === _ZERO || w === _ONE)
        return false;

    /*
    Test if any of the first 250 small primes are a factor of w. 2 is not tested because it was already tested above.
    */
    const firstPrimes = [
        3,
        5,
        7,
        11,
        13,
        17,
        19,
        23,
        29,
        31,
        37,
        41,
        43,
        47,
        53,
        59,
        61,
        67,
        71,
        73,
        79,
        83,
        89,
        97,
        101,
        103,
        107,
        109,
        113,
        127,
        131,
        137,
        139,
        149,
        151,
        157,
        163,
        167,
        173,
        179,
        181,
        191,
        193,
        197,
        199,
        211,
        223,
        227,
        229,
        233,
        239,
        241,
        251,
        257,
        263,
        269,
        271,
        277,
        281,
        283,
        293,
        307,
        311,
        313,
        317,
        331,
        337,
        347,
        349,
        353,
        359,
        367,
        373,
        379,
        383,
        389,
        397,
        401,
        409,
        419,
        421,
        431,
        433,
        439,
        443,
        449,
        457,
        461,
        463,
        467,
        479,
        487,
        491,
        499,
        503,
        509,
        521,
        523,
        541,
        547,
        557,
        563,
        569,
        571,
        577,
        587,
        593,
        599,
        601,
        607,
        613,
        617,
        619,
        631,
        641,
        643,
        647,
        653,
        659,
        661,
        673,
        677,
        683,
        691,
        701,
        709,
        719,
        727,
        733,
        739,
        743,
        751,
        757,
        761,
        769,
        773,
        787,
        797,
        809,
        811,
        821,
        823,
        827,
        829,
        839,
        853,
        857,
        859,
        863,
        877,
        881,
        883,
        887,
        907,
        911,
        919,
        929,
        937,
        941,
        947,
        953,
        967,
        971,
        977,
        983,
        991,
        997,
        1009,
        1013,
        1019,
        1021,
        1031,
        1033,
        1039,
        1049,
        1051,
        1061,
        1063,
        1069,
        1087,
        1091,
        1093,
        1097,
        1103,
        1109,
        1117,
        1123,
        1129,
        1151,
        1153,
        1163,
        1171,
        1181,
        1187,
        1193,
        1201,
        1213,
        1217,
        1223,
        1229,
        1231,
        1237,
        1249,
        1259,
        1277,
        1279,
        1283,
        1289,
        1291,
        1297,
        1301,
        1303,
        1307,
        1319,
        1321,
        1327,
        1361,
        1367,
        1373,
        1381,
        1399,
        1409,
        1423,
        1427,
        1429,
        1433,
        1439,
        1447,
        1451,
        1453,
        1459,
        1471,
        1481,
        1483,
        1487,
        1489,
        1493,
        1499,
        1511,
        1523,
        1531,
        1543,
        1549,
        1553,
        1559,
        1567,
        1571,
        1579,
        1583,
        1597,
    ];
    for (let i = 0; i < firstPrimes.length && (BigInt(firstPrimes[i]) <= w); i++) {
        const p = BigInt(firstPrimes[i]);
        if (w === p)
            return true;
        else if (w % p === _ZERO)
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
    let a = _ZERO, d = w - _ONE;
    while (d % _TWO === _ZERO) {
        d /= _TWO;
        ++a;
    }

    let m = (w - _ONE) / (_TWO ** a);

    loop: do {
        let b = randBetween(w - _ONE, _TWO);
        let z = modPow(b, m, w);
        if (z === _ONE || z === w - _ONE)
            continue;

        for (let j = 1; j < a; j++) {
            z = modPow(z, _TWO, w);
            if (z === w - _ONE)
                continue loop;
            if (z === _ONE)
                break;
        }
        return false;
    } while (--iterations);

    return true;
}


// Handbook for applied cryptography 
// 14.79 Algorithm Left-to-right binary exponentiation
function _modPowLeftToRightBinary(g, e, m, eIsPowerOfTwo = false) {
    if (eIsPowerOfTwo) {
        while ((e >>= _ONE) > _ZERO) {
            g = g ** _TWO % m;
        }
        return g;
    } else {
        let r = _ONE;
        const e_i = [];
        let i = 0;
        do {
            e_i[i] = e & _ONE;
            i++;
        } while ((e >>= _ONE) > _ZERO);
        for (let j = i - 1; j >= 0; j--) {
            r = r ** _TWO % m;
            if (e_i[j] === _ONE) {
                r = (r * g) % m;
            }
        }
        return r;
    }
}


// Handbook for applied cryptography 
// 14.82 Left-to-right k-ary exponentiation
function _modPowLeftToRightKary(g, e, m, baseBits) {
    Array.prototype.isArray = true;
    baseBits = BigInt(baseBits);
    const base = _TWO ** baseBits;

    let gPowers;
    if (g.isArray && g.length == base) {
        gPowers = g;
    } else {
        gPowers = new Array(base);
        gPowers[0] = _ONE;
        gPowers[1] = g;

        for (let i = 2; i < base; i++) {
            gPowers[i] = (gPowers[i - 1] * g) % m;
        }

    }

    const _mask = (base - _ONE);

    const e_i = [];
    let i = 0;
    do {
        e_i[i] = e & _mask;
        i++;
    } while ((e >>= baseBits) > _ZERO);

    let r = _ONE;
    for (let j = i - 1; j >= 0; j--) {
        r = _modPowLeftToRightBinary(r, base, m, true);
        if (e_i[j] > _ZERO) {
            r = (r * gPowers[e_i[j]]) % m;
        }
    }
    return r;
}

// Handbook for applied cryptography 
// 14.94 Montgomery exponentiation
function _modPowLeftToRightBinaryMontgomery(g, e, m, baseBits = 512) {
    if (m % _TWO === _ZERO) { // as montBase is a power of 2, gcd(m,montBase) == 1 => m is odd
        return NaN;
    }
    const mont = new Mont(m, baseBits);

    let gMont = mont.mul(g, mont.Rsqr); // g*R mod m
    let ret = mont.R - m; // R mod m

    const e_i = [];
    let i = 0;
    do {
        e_i[i] = e & _ONE;
        i++;
    } while ((e >>= _ONE) > _ZERO);
    for (let j = i - 1; j >= 0; j--) {
        ret = mont.mul(ret, ret);
        if (e_i[j] === _ONE) {
            ret = mont.mul(ret, gMont);
        }
    }

    return mont.mul(ret, _ONE);
}

function _modPowLeftToRightBinaryRedc(g, e, m, baseBits = 512) {
    if (m % _TWO === _ZERO) { // as montBase is a power of 2, gcd(m,montBase) == 1 => m is odd
        return NaN;
    }
    const mont = new Mont(m, baseBits);

    let gMont = mont.redc(g * mont.Rsqr); // g*R mod m
    let ret = mont.R - m; // R mod m

    const e_i = [];
    let i = 0;
    do {
        e_i[i] = e & _ONE;
        i++;
    } while ((e >>= _ONE) > _ZERO);
    for (let j = i - 1; j >= 0; j--) {
        ret = mont.redc(ret ** _TWO);
        if (e_i[j] === _ONE) {
            ret = mont.redc(ret * gMont);
        }
    }

    return mont.redc(ret);
}

// Handbook for applied cryptography 
// 14.76 Algorithm Right-to-left binary exponentiation
function _modPowRightToLeftBinary(g, e, m) {
    let r = _ONE;
    while (e > _ZERO) {
        if ((e % _TWO) === _ONE) {
            r = (r * g) % m;
        }
        e = e >> _ONE;
        if (e !== _ZERO) {
            g = g ** _TWO % m;
        }
    }
    return r;
}

function _modPowRightToLeftBinaryMontgomery(g, e, m, baseBits = 512) {
    if (m % _TWO === _ZERO) { // as b is a power of 2, gcd(m,b) == 1 => m is odd
        return NaN;
    }
    const mont = new Mont(m, baseBits);

    let gMont = mont.mul(g, mont.Rsqr); // g*R mod m
    let ret = mont.R - m; // R mod m

    while (e > _ZERO) {
        if ((e % _TWO) === _ONE) {
            ret = mont.mul(ret, gMont);
        }
        e = e / _TWO;
        if (e !== _ZERO) {
            gMont = mont.mul(gMont, gMont);
        }
    }

    return mont.mul(ret, _ONE); // ret * R^(-1) mod m
}

function _modPowRightToLeftBinaryRedc(g, e, m, baseBits = 512) {
    if (m % _TWO === _ZERO) { // as R is a power of 2, gcd(m,R) == 1 <=> m is odd
        return NaN;
    }

    const mont = new Mont(m, baseBits);

    let gMont = mont.redc(g * mont.Rsqr); // g*R mod m
    let ret = mont.R - m; // R mod m

    while (e > _ZERO) {
        if ((e % _TWO) === _ONE) {
            ret = mont.redc(ret * gMont);
        }
        e = e / _TWO;
        if (e !== _ZERO) {
            gMont = mont.redc(gMont ** _TWO);
        }
    }

    return mont.redc(ret); // ret * R^(-1) mod m
}

let _useWorkers = true; // The following is just to check whether Node.js can use workers
{ // Node.js
    _useWorkers = (function _workers() {
        try {
            require.resolve('worker_threads');
            return true;
        } catch (e) {
            console.log(`[bigint-crypto-utils] WARNING:
This node version doesn't support worker_threads. You should enable them in order to greatly speedup the generation of big prime numbers.
    · With Node 11 it is enabled by default (consider upgrading).
    · With Node 10, starting with 10.5.0, you can enable worker_threads at runtime executing node --experimental-worker `);
            return false;
        }
    })();
}



if (_useWorkers) { // node.js with support for workers
    const { parentPort, isMainThread } = require('worker_threads');
    if (!isMainThread) { // worker
        parentPort.on('message', function (data) { // Let's start once we are called
            // data = {rnd: <bigint>, iterations: <number>}
            const isPrime = _isProbablyPrime(data.rnd, data.iterations);
            parentPort.postMessage({
                'isPrime': isPrime,
                'value': data.rnd,
                'id': data.id
            });
        });
    }
}

exports.Mont = Mont;
exports.abs = abs;
exports.bitLength = bitLength;
exports.eGcd = eGcd;
exports.gcd = gcd;
exports.isProbablyPrime = isProbablyPrime;
exports.lcm = lcm;
exports.modInv = modInv;
exports.modPow = modPow;
exports.prime = prime;
exports.randBetween = randBetween;
exports.randBits = randBits;
exports.randBytes = randBytes;
exports.randBytesSync = randBytesSync;
exports.toZn = toZn;
exports.wordLength = wordLength;
