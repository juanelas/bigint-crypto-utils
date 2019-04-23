'use strict';

// For the browser test builder to work you MUST import them module in a variable that
// is the camelised version of the package name.
const bigintCryptoUtils = require('../dist/bigint-crypto-utils-latest.node');
const chai = require('chai');

const bitLengths = [
    1024,
    2048,
    3072,
    4096
];

describe('Testing generation of prime numbers', function () {
    for (const bitLength of bitLengths) {
        describe(`Executing prime(${bitLength})`, function () {
            it(`should return a random ${bitLength}-bits probable prime`, async function () {
                let prime = await bigintCryptoUtils.prime(bitLength);
                let bits = 1;
                do {
                    bits++;
                } while ((prime >>= BigInt(1)) > BigInt(1));
                chai.expect(bits).to.equal(bitLength);
            });
        });
    }
});