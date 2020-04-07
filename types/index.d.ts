/**
 * A triple (g, x, y), such that ax + by = g = gcd(a, b).
 */
export type egcdReturn = {
    g: bigint;
    x: bigint;
    y: bigint;
};
/**
 * Absolute value. abs(a)==a if a>=0. abs(a)==-a if a<0
 *
 * @param {number|bigint} a
 *
 * @returns {bigint} the absolute value of a
 */
export function abs(a: number | bigint): bigint;
/**
 * Returns the bitlength of a number
 *
 * @param {number|bigint} a
 * @returns {number} - the bit length
 */
export function bitLength(a: number | bigint): number;
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
export function eGcd(a: number | bigint, b: number | bigint): egcdReturn;
/**
 * Greatest-common divisor of two integers based on the iterative binary algorithm.
 *
 * @param {number|bigint} a
 * @param {number|bigint} b
 *
 * @returns {bigint} The greatest common divisor of a and b
 */
export function gcd(a: number | bigint, b: number | bigint): bigint;
/**
 * The test first tries if any of the first 250 small primes are a factor of the input number and then passes several
 * iterations of Miller-Rabin Probabilistic Primality Test (FIPS 186-4 C.3.1)
 *
 * @param {number | bigint} w An integer to be tested for primality
 * @param {number} [iterations = 16] The number of iterations for the primality test. The value shall be consistent with Table C.1, C.2 or C.3
 *
 * @returns {Promise<boolean>} A promise that resolves to a boolean that is either true (a probably prime number) or false (definitely composite)
 */
export function isProbablyPrime(w: number | bigint, iterations?: number): Promise<boolean>;
/**
 * The least common multiple computed as abs(a*b)/gcd(a,b)
 * @param {number|bigint} a
 * @param {number|bigint} b
 *
 * @returns {bigint} The least common multiple of a and b
 */
export function lcm(a: number | bigint, b: number | bigint): bigint;
/**
 * Maximum. max(a,b)==a if a>=b. max(a,b)==b if a<=b
 *
 * @param {number|bigint} a
 * @param {number|bigint} b
 *
 * @returns {bigint} maximum of numbers a and b
 */
export function max(a: number | bigint, b: number | bigint): bigint;
/**
 * Minimum. min(a,b)==b if a>=b. min(a,b)==a if a<=b
 *
 * @param {number|bigint} a
 * @param {number|bigint} b
 *
 * @returns {bigint} minimum of numbers a and b
 */
export function min(a: number | bigint, b: number | bigint): bigint;
/**
 * Modular inverse.
 *
 * @param {number|bigint} a The number to find an inverse for
 * @param {number|bigint} n The modulo
 *
 * @returns {bigint} the inverse modulo n or NaN if it does not exist
 */
export function modInv(a: number | bigint, n: number | bigint): bigint;
/**
 * Modular exponentiation b**e mod n. Currently using the right-to-left binary method
 *
 * @param {number|bigint} b base
 * @param {number|bigint} e exponent
 * @param {number|bigint} n modulo
 *
 * @returns {bigint} b**e mod n
 */
export function modPow(b: number | bigint, e: number | bigint, n: number | bigint): bigint;
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
export function prime(bitLength: number, iterations?: number): Promise<bigint>;
/**
 * A probably-prime (Miller-Rabin), cryptographically-secure, random-number generator.
 * The sync version is NOT RECOMMENDED since it won't use workers and thus it'll be slower and may freeze thw window in browser's javascript. Please consider using prime() instead.
 *
 * @param {number} bitLength The required bit length for the generated prime
 * @param {number} [iterations = 16] The number of iterations for the Miller-Rabin Probabilistic Primality Test
 *
 * @returns {bigint} A bigint probable prime of bitLength bits.
 */
export function primeSync(bitLength: number, iterations?: number): bigint;
/**
 * Returns a cryptographically secure random integer between [min,max]
 * @param {bigint} max Returned value will be <= max
 * @param {bigint} [min = BigInt(1)] Returned value will be >= min
 *
 * @returns {bigint} A cryptographically secure random bigint between [min,max]
 */
export function randBetween(max: bigint, min?: bigint): bigint;
/**
 * Secure random bits for both node and browsers. Node version uses crypto.randomFill() and browser one self.crypto.getRandomValues()
 *
 * Since version 3.0.0 this is an async function and a new randBitsSync function has been added. If you are migrating from version 2 call randBitsSync instead.
 * @since 3.0.0
 * @param {number} bitLength The desired number of random bits
 * @param {boolean} [forceLength = false] If we want to force the output to have a specific bit length. It basically forces the msb to be 1
 *
 * @returns {Promise<Buffer | Uint8Array>} A Promise that resolves to a Buffer/UInt8Array (Node.js/Browser) filled with cryptographically secure random bits
 */
export function randBits(bitLength: number, forceLength?: boolean): Promise<Uint8Array | Buffer>;
/**
 * Secure random bits for both node and browsers. Node version uses crypto.randomFill() and browser one self.crypto.getRandomValues()
 * @since 3.0.0
 * @param {number} bitLength The desired number of random bits
 * @param {boolean} [forceLength = false] If we want to force the output to have a specific bit length. It basically forces the msb to be 1
 *
 * @returns {Buffer | Uint8Array} A Buffer/UInt8Array (Node.js/Browser) filled with cryptographically secure random bits
 */
export function randBitsSync(bitLength: number, forceLength?: boolean): Uint8Array | Buffer;
/**
 * Secure random bytes for both node and browsers. Node version uses crypto.randomFill() and browser one self.crypto.getRandomValues()
 *
 * @param {number} byteLength The desired number of random bytes
 * @param {boolean} [forceLength = false] If we want to force the output to have a bit length of 8*byteLength. It basically forces the msb to be 1
 *
 * @returns {Promise<Buffer | Uint8Array>} A promise that resolves to a Buffer/UInt8Array (Node.js/Browser) filled with cryptographically secure random bytes
 */
export function randBytes(byteLength: number, forceLength?: boolean): Promise<Uint8Array | Buffer>;
/**
 * Secure random bytes for both node and browsers. Node version uses crypto.randomFill() and browser one self.crypto.getRandomValues()
 *
 * @param {number} byteLength The desired number of random bytes
 * @param {boolean} [forceLength = false] If we want to force the output to have a bit length of 8*byteLength. It basically forces the msb to be 1
 *
 * @returns {Buffer | Uint8Array} A Buffer/UInt8Array (Node.js/Browser) filled with cryptographically secure random bytes
 */
export function randBytesSync(byteLength: number, forceLength?: boolean): Uint8Array | Buffer;
/**
 * Finds the smallest positive element that is congruent to a in modulo n
 * @param {number|bigint} a An integer
 * @param {number|bigint} n The modulo
 *
 * @returns {bigint} The smallest positive representation of a in modulo n
 */
export function toZn(a: number | bigint, n: number | bigint): bigint;
