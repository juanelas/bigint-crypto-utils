/// <reference types="node" />
/**
 * Absolute value. abs(a)==a if a>=0. abs(a)==-a if a<0
 *
 * @param a
 *
 * @returns The absolute value of a
 */
declare function abs(a: number | bigint): number | bigint;

/**
 * Returns the (minimum) length of a number expressed in bits.
 *
 * @param a
 * @returns The bit length
 */
declare function bitLength(a: number | bigint): number;

interface Egcd {
    g: bigint;
    x: bigint;
    y: bigint;
}
/**
 * An iterative implementation of the extended euclidean algorithm or extended greatest common divisor algorithm.
 * Take positive integers a, b as input, and return a triple (g, x, y), such that ax + by = g = gcd(a, b).
 *
 * @param a
 * @param b
 *
 * @throws {@link RangeError} if a or b are <= 0
 *
 * @returns A triple (g, x, y), such that ax + by = g = gcd(a, b).
 */
declare function eGcd(a: number | bigint, b: number | bigint): Egcd;

/**
 * Greatest common divisor of two integers based on the iterative binary algorithm.
 *
 * @param a
 * @param b
 *
 * @returns The greatest common divisor of a and b
 */
declare function gcd(a: number | bigint, b: number | bigint): bigint;

/**
 * The least common multiple computed as abs(a*b)/gcd(a,b)
 * @param a
 * @param b
 *
 * @returns The least common multiple of a and b
 */
declare function lcm(a: number | bigint, b: number | bigint): bigint;

/**
 * Maximum. max(a,b)==a if a>=b. max(a,b)==b if a<b
 *
 * @param a
 * @param b
 *
 * @returns Maximum of numbers a and b
 */
declare function max(a: number | bigint, b: number | bigint): number | bigint;

/**
 * Minimum. min(a,b)==b if a>=b. min(a,b)==a if a<b
 *
 * @param a
 * @param b
 *
 * @returns Minimum of numbers a and b
 */
declare function min(a: number | bigint, b: number | bigint): number | bigint;

/**
 * Modular inverse.
 *
 * @param a The number to find an inverse for
 * @param n The modulo
 *
 * @throws {@link RangeError} if a does not have inverse modulo n
 *
 * @returns The inverse modulo n
 */
declare function modInv(a: number | bigint, n: number | bigint): bigint;

type PrimePower = [number | bigint, number | bigint];
type PrimeFactor = number | bigint | PrimePower;
/**
 * Modular exponentiation b**e mod n. Currently using the right-to-left binary method if the prime factorization is not provided, or the chinese remainder theorem otherwise.
 *
 * @param b base
 * @param e exponent
 * @param n modulo
 * @param primeFactorization an array of the prime factors, for example [5n, 5n, 13n, 27n], or prime powers as [p, k], for instance [[5, 2], [13, 1], [27, 1]]. If the prime factorization is provided the chinese remainder theorem is used to greatly speed up the exponentiation.
 *
 * @throws {@link RangeError} if n <= 0
 *
 * @returns b**e mod n
 */
declare function modPow(b: number | bigint, e: number | bigint, n: number | bigint, primeFactorization?: PrimeFactor[]): bigint;

/**
 * Finds the smallest positive element that is congruent to a in modulo n
 *
 * @remarks
 * a and b must be the same type, either number or bigint
 *
 * @param a - An integer
 * @param n - The modulo
 *
 * @throws {@link RangeError} if n <= 0
 *
 * @returns A bigint with the smallest positive representation of a modulo n
 */
declare function toZn(a: number | bigint, n: number | bigint): bigint;

/**
 * The test first tries if any of the first 250 small primes are a factor of the input number and then passes several
 * iterations of Miller-Rabin Probabilistic Primality Test (FIPS 186-4 C.3.1)
 *
 * @param w - A positive integer to be tested for primality
 * @param iterations - The number of iterations for the primality test. The value shall be consistent with Table C.1, C.2 or C.3 of FIPS 186-4
 * @param disableWorkers - Disable the use of workers for the primality test
 *
 * @throws {@link RangeError} if w<0
 *
 * @returns A promise that resolves to a boolean that is either true (a probably prime number) or false (definitely composite)
 */
declare function isProbablyPrime(w: number | bigint, iterations?: number, disableWorkers?: boolean): Promise<boolean>;

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
 * @throws {@link RangeError} if bitLength < 1
 *
 * @returns A promise that resolves to a bigint probable prime of bitLength bits.
 */
declare function prime(bitLength: number, iterations?: number): Promise<bigint>;
/**
 * A probably-prime (Miller-Rabin), cryptographically-secure, random-number generator.
 * The sync version is NOT RECOMMENDED since it won't use workers and thus it'll be slower and may freeze thw window in browser's javascript. Please consider using prime() instead.
 *
 * @param bitLength - The required bit length for the generated prime
 * @param iterations - The number of iterations for the Miller-Rabin Probabilistic Primality Test
 *
 * @throws {@link RangeError} if bitLength < 1
 *
 * @returns A bigint probable prime of bitLength bits.
 */
declare function primeSync(bitLength: number, iterations?: number): bigint;

/**
 * Returns a cryptographically secure random integer between [min,max].
 * @param max Returned value will be <= max
 * @param min Returned value will be >= min
 *
 * @throws {@link RangeError} if max <= min
 *
 * @returns A cryptographically secure random bigint between [min,max]
 */
declare function randBetween(max: bigint, min?: bigint): bigint;

/**
 * Secure random bits for both node and browsers. Node version uses crypto.randomFill() and browser one self.crypto.getRandomValues()
 *
 * @param bitLength - The desired number of random bits
 * @param forceLength - Set to true if you want to force the output to have a specific bit length. It basically forces the msb to be 1
 *
 * @throws {@link RangeError} if bitLength < 1
 *
 * @returns A Promise that resolves to a UInt8Array/Buffer (Browser/Node.js) filled with cryptographically secure random bits
 */
declare function randBits(bitLength: number, forceLength?: boolean): Promise<Uint8Array | Buffer>;
/**
 * Secure random bits for both node and browsers. Node version uses crypto.randomFill() and browser one self.crypto.getRandomValues()
 * @param bitLength - The desired number of random bits
 * @param forceLength - Set to true if you want to force the output to have a specific bit length. It basically forces the msb to be 1
 *
 * @throws {@link RangeError} if bitLength < 1
 *
 * @returns A Uint8Array/Buffer (Browser/Node.js) filled with cryptographically secure random bits
 */
declare function randBitsSync(bitLength: number, forceLength?: boolean): Uint8Array | Buffer;

/**
 * Secure random bytes for both node and browsers. Node version uses crypto.randomBytes() and browser one self.crypto.getRandomValues()
 *
 * @param byteLength - The desired number of random bytes
 * @param forceLength - Set to true if you want to force the output to have a bit length of 8*byteLength. It basically forces the msb to be 1
 *
 * @throws {@link RangeError} if byteLength < 1
 *
 * @returns A promise that resolves to a UInt8Array/Buffer (Browser/Node.js) filled with cryptographically secure random bytes
 */
declare function randBytes(byteLength: number, forceLength?: boolean): Promise<Uint8Array | Buffer>;
/**
 * Secure random bytes for both node and browsers. Node version uses crypto.randomFill() and browser one self.crypto.getRandomValues()
 * This is the synchronous version, consider using the asynchronous one for improved efficiency.
 *
 * @param byteLength - The desired number of random bytes
 * @param forceLength - Set to true if you want to force the output to have a bit length of 8*byteLength. It basically forces the msb to be 1
 *
 * @throws {@link RangeError} if byteLength < 1
 *
 * @returns A UInt8Array/Buffer (Browser/Node.js) filled with cryptographically secure random bytes
 */
declare function randBytesSync(byteLength: number, forceLength?: boolean): Uint8Array | Buffer;

export { abs, bitLength, eGcd, gcd, isProbablyPrime, lcm, max, min, modInv, modPow, prime, primeSync, randBetween, randBits, randBitsSync, randBytes, randBytesSync, toZn };
