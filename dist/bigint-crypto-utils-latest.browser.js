var bigintCryptoUtils = (function (exports) {
    'use strict';

    /**
     * Absolute value. abs(a)==a if a>=0. abs(a)==-a if a<0
     *  
     * @param {number|bigint} a 
     * 
     * @returns {bigint} the absolute value of a
     */
    const abs = function (a) {
        a = BigInt(a);
        return (a >= BigInt(0)) ? a : -a;
    };

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
     * @returns {egcdReturn}
     */
    const eGcd = function (a, b) {
        a = BigInt(a);
        b = BigInt(b);
        let x = BigInt(0);
        let y = BigInt(1);
        let u = BigInt(1);
        let v = BigInt(0);

        while (a !== BigInt(0)) {
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
    };

    /**
     * Greatest-common divisor of two integers based on the iterative binary algorithm.
     * 
     * @param {number|bigint} a 
     * @param {number|bigint} b 
     * 
     * @returns {bigint} The greatest common divisor of a and b
     */
    const gcd = function (a, b) {
        a = abs(a);
        b = abs(b);
        let shift = BigInt(0);
        while (!((a | b) & BigInt(1))) {
            a >>= BigInt(1);
            b >>= BigInt(1);
            shift++;
        }
        while (!(a & BigInt(1))) a >>= BigInt(1);
        do {
            while (!(b & BigInt(1))) b >>= BigInt(1);
            if (a > b) {
                let x = a;
                a = b;
                b = x;
            }
            b -= a;
        } while (b);

        // rescale
        return a << shift;
    };

    /**
     * The test first tries if any of the first 250 small primes are a factor of the input number and then passes several iterations of Miller-Rabin Probabilistic Primality Test (FIPS 186-4 C.3.1)
     * 
     * @param {bigint} w An integer to be tested for primality
     * @param {number} iterations The number of iterations for the primality test. The value shall be consistent with Table C.1, C.2 or C.3
     * 
     * @return {Promise} A promise that resolve to a boolean that is either true (a probably prime number) or false (definitely composite)
     */
    const isProbablyPrime = async function (w, iterations = 16) {
        {
            return new Promise(resolve => {
                let worker = _isProbablyPrimeWorker();

                worker.onmessage = (event) => {
                    worker.terminate();
                    resolve(event.data.isPrime);
                };

                worker.postMessage({
                    'rnd': w,
                    'iterations': iterations
                });
            });
        }
    };

    /**
     * The least common multiple computed as abs(a*b)/gcd(a,b)
     * @param {number|bigint} a 
     * @param {number|bigint} b 
     * 
     * @returns {bigint} The least common multiple of a and b
     */
    const lcm = function (a, b) {
        a = BigInt(a);
        b = BigInt(b);
        return abs(a * b) / gcd(a, b);
    };

    /**
     * Modular inverse.
     * 
     * @param {number|bigint} a The number to find an inverse for
     * @param {number|bigint} n The modulo
     * 
     * @returns {bigint} the inverse modulo n
     */
    const modInv = function (a, n) {
        let egcd = eGcd(a, n);
        if (egcd.b !== BigInt(1)) {
            return null; // modular inverse does not exist
        } else {
            return toZn(egcd.x, n);
        }
    };

    /**
     * Modular exponentiation a**b mod n
     * @param {number|bigint} a base
     * @param {number|bigint} b exponent
     * @param {number|bigint} n modulo
     * 
     * @returns {bigint} a**b mod n
     */
    const modPow = function (a, b, n) {
        // See Knuth, volume 2, section 4.6.3.
        n = BigInt(n);
        a = toZn(a, n);
        b = BigInt(b);
        if (b < BigInt(0)) {
            return modInv(modPow(a, abs(b), n), n);
        }
        let result = BigInt(1);
        let x = a;
        while (b > 0) {
            var leastSignificantBit = b % BigInt(2);
            b = b / BigInt(2);
            if (leastSignificantBit == BigInt(1)) {
                result = result * x;
                result = result % n;
            }
            x = x * x;
            x = x % n;
        }
        return result;
    };

    /**
     * A probably-prime (Miller-Rabin), cryptographically-secure, random-number generator. 
     * The browser version uses web workers to parallelise prime look up. Therefore, it does not lock the UI 
     * main process, and it can be much faster (if several cores or cpu are available). 
     * 
     * @param {number} bitLength The required bit length for the generated prime
     * @param {number} iterations The number of iterations for the Miller-Rabin Probabilistic Primality Test
     * 
     * @returns {Promise} A promise that resolves to a bigint probable prime of bitLength bits
     */
    const prime = async function (bitLength, iterations = 16) {
        return new Promise(async (resolve) => {
            {
                let workerList = [];
                for (let i = 0; i < self.navigator.hardwareConcurrency; i++) {
                    let newWorker = _isProbablyPrimeWorker();
                    newWorker.onmessage = async (event) => {
                        if (event.data.isPrime) {
                            // if a prime number has been found, stop all the workers, and return it
                            for (let j = 0; j < workerList.length; j++) {
                                workerList[j].terminate();
                            }
                            while (workerList.length) {
                                workerList.pop();
                            }
                            resolve(event.data.value);
                        } else { // if a composite is found, make the worker test another random number
                            let rnd = BigInt(0);
                            rnd = fromBuffer(await randBytes(bitLength / 8, true));
                            newWorker.postMessage({
                                'rnd': rnd,
                                'iterations': iterations
                            });
                        }
                    };
                    workerList.push(newWorker);
                }

                for (const worker of workerList) {
                    let rnd = BigInt(0);
                    rnd = fromBuffer(await randBytes(bitLength / 8, true));
                    worker.postMessage({
                        'rnd': rnd,
                        'iterations': iterations
                    });
                }

            }
        });
    };

    /**
     * Returns a cryptographically secure random integer between [min,max]
     * @param {bigint} max Returned value will be <= max
     * @param {bigint} min Returned value will be >= min
     * 
     * @returns {Promise} A promise that resolves to a cryptographically secure random bigint between [min,max]
     */
    const randBetween = async function (max, min = 1) {
        let bitLen = bitLength(max);
        let byteLength = bitLen >> 3;
        let remaining = bitLen - (byteLength * 8);
        let extraBits;
        if (remaining > 0) {
            byteLength++;
            extraBits = 2 ** remaining - 1;
        }

        let rnd;
        do {
            let buf = await randBytes(byteLength);
            // remove extra bits
            if (remaining > 0)
                buf[0] = buf[0] & extraBits;
            rnd = fromBuffer(buf);
        } while (rnd > max || rnd < min);
        return rnd;
    };

    /**
     * Secure random bytes for both node and browsers. Node version uses crypto.randomFill() and browser one self.crypto.getRandomValues()
     * 
     * @param {number} byteLength The desired number of random bytes
     * @param {boolean} forceLength If we want to force the output to have a bit length of 8*byteLength. It basically forces the msb to be 1
     * 
     * @returns {Promise} A promise that resolves to a Buffer/UInt8Array filled with cryptographically secure random bytes
     */
    const randBytes = async function (byteLength, forceLength = false) {
        return new Promise((resolve) => {
            let buf;

            { // browser
                buf = new Uint8Array(byteLength);
                self.crypto.getRandomValues(buf);
                // If fixed length is required we put the first bit to 1 -> to get the necessary bitLength
                if (forceLength)
                    buf[0] = buf[0] | 128;
                resolve(buf);
            }
        });
    };

    /**
     * Finds the smallest positive element that is congruent to a in modulo n
     * @param {number|bigint} a An integer
     * @param {number|bigint} n The modulo
     * 
     * @returns {bigint} The smallest positive representation of a in modulo n
     */
    const toZn = function (a, n) {
        n = BigInt(n);
        a = BigInt(a) % n;
        return (a < 0) ? a + n : a;
    };



    /* HELPER FUNCTIONS */

    function fromBuffer(buf) {
        let ret = BigInt(0);
        for (let i of buf.values()) {
            let bi = BigInt(i);
            ret = (ret << BigInt(8)) + bi;
        }
        return ret;
    }

    function bitLength(a) {
        let bits = 1;
        do {
            bits++;
        } while ((a >>= BigInt(1)) > BigInt(1));
        return bits;
    }

    function _isProbablyPrimeWorker() {
        async function _onmessage(event) { // Let's start once we are called
            // event.data = {rnd: <bigint>, iterations: <number>}
            const isPrime = await isProbablyPrime(event.data.rnd, event.data.iterations);
            postMessage({
                'isPrime': isPrime,
                'value': event.data.rnd
            });
        }

        let workerCode = `(() => {'use strict';const eGcd = ${eGcd.toString()};const modInv = ${modInv.toString()};const modPow = ${modPow.toString()};const toZn = ${toZn.toString()};const randBytes = ${randBytes.toString()};const randBetween = ${randBetween.toString()};const isProbablyPrime = ${_isProbablyPrime.toString()};${bitLength.toString()}${fromBuffer.toString()}onmessage = ${_onmessage.toString()};})()`;

        var _blob = new Blob([workerCode], { type: 'text/javascript' });

        return new Worker(window.URL.createObjectURL(_blob));
    }

    async function _isProbablyPrime(w, iterations = 16) {
        /*
    	PREFILTERING. Even values but 2 are not primes, so don't test. 
    	1 is not a prime and the M-R algorithm needs w>1.
    	*/
        if (w === BigInt(2))
            return true;
        else if ((w & BigInt(1)) === BigInt(0) || w === BigInt(1))
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
            else if (w % p === BigInt(0))
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
        let a = BigInt(0), d = w - BigInt(1);
        while (d % BigInt(2) === BigInt(0)) {
            d /= BigInt(2);
            ++a;
        }

        let m = (w - BigInt(1)) / (BigInt(2) ** a);

        loop: do {
            let b = await randBetween(w - BigInt(1), 2);
            let z = modPow(b, m, w);
            if (z === BigInt(1) || z === w - BigInt(1))
                continue;

            for (let j = 1; j < a; j++) {
                z = modPow(z, BigInt(2), w);
                if (z === w - BigInt(1))
                    continue loop;
                if (z === BigInt(1))
                    break;
            }
            return false;
        } while (--iterations);

        return true;
    }

    exports.abs = abs;
    exports.eGcd = eGcd;
    exports.gcd = gcd;
    exports.isProbablyPrime = isProbablyPrime;
    exports.lcm = lcm;
    exports.modInv = modInv;
    exports.modPow = modPow;
    exports.prime = prime;
    exports.randBetween = randBetween;
    exports.randBytes = randBytes;
    exports.toZn = toZn;

    return exports;

}({}));
