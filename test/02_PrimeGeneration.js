'use strict';

// For the browser test builder to work you MUST import them module in a variable that
// is the camelised version of the package name.
const bigintUtils = require('../dist/bigint-utils-latest.node');
const chai = require('chai');

const bitLengths = [
    256,
    512,
    1024,
    2048,
    3072
];

describe('Testing generation of prime numbers', function () {
    for (const bitLength of bitLengths) {
        describe(`Executing prime(${bitLength})`, function () {
            it(`should return a random ${bitLength}-bits probable prime`, async function () {
                let prime = await bigintUtils.prime(bitLength);
                const ret = await bigintUtils.isProbablyPrime(prime);
                chai.expect(ret).to.equal(true);
                let bits = 1;
                do {
                    bits++;
                } while ((prime >>= BigInt(1)) > BigInt(1));
                chai.expect(bits).to.equal(bitLength);
            });
        });
    }
});