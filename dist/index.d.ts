/// <reference types="node" />
declare function abs(a: number | bigint): number | bigint;

declare function bitLength(a: number | bigint): number;

interface Egcd {
    g: bigint;
    x: bigint;
    y: bigint;
}
declare function eGcd(a: number | bigint, b: number | bigint): Egcd;

declare function gcd(a: number | bigint, b: number | bigint): bigint;

declare function lcm(a: number | bigint, b: number | bigint): bigint;

declare function max(a: number | bigint, b: number | bigint): number | bigint;

declare function min(a: number | bigint, b: number | bigint): number | bigint;

declare function modInv(a: number | bigint, n: number | bigint): bigint;

declare function modPow(b: number | bigint, e: number | bigint, n: number | bigint): bigint;

declare function toZn(a: number | bigint, n: number | bigint): bigint;

declare function isProbablyPrime(w: number | bigint, iterations?: number, disableWorkers?: boolean): Promise<boolean>;

declare function prime(bitLength: number, iterations?: number): Promise<bigint>;
declare function primeSync(bitLength: number, iterations?: number): bigint;

declare function randBetween(max: bigint, min?: bigint): bigint;

declare function randBits(bitLength: number, forceLength?: boolean): Promise<Uint8Array | Buffer>;
declare function randBitsSync(bitLength: number, forceLength?: boolean): Uint8Array | Buffer;

declare function randBytes(byteLength: number, forceLength?: boolean): Promise<Uint8Array | Buffer>;
declare function randBytesSync(byteLength: number, forceLength?: boolean): Uint8Array | Buffer;

export { abs, bitLength, eGcd, gcd, isProbablyPrime, lcm, max, min, modInv, modPow, prime, primeSync, randBetween, randBits, randBitsSync, randBytes, randBytesSync, toZn };
