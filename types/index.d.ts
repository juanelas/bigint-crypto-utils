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
export function isProbablyPrime(w: number | bigint, iterations?: number, disableWorkers?: boolean): Promise<boolean>;
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
 * Returns a cryptographically secure random integer between [min,max]. Both numbers must be >=0
 * @param {bigint} max Returned value will be <= max
 * @param {bigint} [min = BigInt(1)] Returned value will be >= min
 *
 * @returns {bigint} A cryptographically secure random bigint between [min,max]
 */
export function randBetween(max: bigint, min?: bigint): bigint;
/**
 * Secure random bits for both node and browsers. Node version uses crypto.randomFill() and browser one self.crypto.getRandomValues()
 *
 * @param {number} bitLength The desired number of random bits
 * @param {boolean} [forceLength = false] If we want to force the output to have a specific bit length. It basically forces the msb to be 1
 *
 * @returns {Promise<Buffer | Uint8Array>} A Promise that resolves to a Buffer/UInt8Array (Node.js/Browser) filled with cryptographically secure random bits
 */
export function randBits(bitLength: number, forceLength?: boolean): Promise<Uint8Array | Buffer>;
/**
 * Secure random bits for both node and browsers. Node version uses crypto.randomFill() and browser one self.crypto.getRandomValues()
 * @param {number} bitLength The desired number of random bits
 * @param {boolean} [forceLength = false] If we want to force the output to have a specific bit length. It basically forces the msb to be 1
 *
 * @returns {Buffer | Uint8Array} A Buffer/UInt8Array (Node.js/Browser) filled with cryptographically secure random bits
 */
export function randBitsSync(bitLength: number, forceLength?: boolean): Uint8Array | Buffer;
/**
 * Secure random bytes for both node and browsers. Node version uses crypto.randomBytes() and browser one self.crypto.getRandomValues()
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
export { abs, bitLength, eGcd, gcd, lcm, max, min, modInv, modPow, toZn } from "bigint-mod-arith";
