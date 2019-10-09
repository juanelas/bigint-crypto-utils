'use strict';

// For the browser test builder to work you MUST import them module in a variable that
// is the camelised version of the package name.
const bigintCryptoUtils = require('../dist/bigint-crypto-utils-latest.node');
const chai = require('chai');

const bitLengths = [
    256,
    512,
    1024,
    2048,
    3072,
    4096
];

describe('prime', function () {
    for (const bitLength of bitLengths) {
        describe(`prime(${bitLength})`, function () {
            it(`should return a random ${bitLength}-bits probable prime`, async function () {
                const prime = await bigintCryptoUtils.prime(bitLength);
                const primeBitLength = bigintCryptoUtils.bitLength(prime);
                chai.expect(primeBitLength).to.equal(bitLength);
            });
        });
    }
    describe('Testing sync (NOT-RECOMMENDED) version: primeSync()', function() {
        it('should return a random 1024-bits probable prime', function () {
            const prime = bigintCryptoUtils.primeSync(1024, 16);
            const primeBitLength = bigintCryptoUtils.bitLength(prime);
            chai.expect(primeBitLength).to.equal(1024);
        });
    });
});