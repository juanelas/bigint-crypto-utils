'use strict';

// For the browser test builder to work you MUST import them module in a variable that
// is the camelised version of the package name.
const bigintCryptoUtils = require('../dist/bigint-crypto-utils-latest.node');
const chai = require('chai');

const inputs = [
    {
        a: BigInt(1),
        n: BigInt(19),
        modInv: BigInt(1)
    },
    {
        a: BigInt(2),
        n: BigInt(5),
        modInv: BigInt(3)
    },
    {
        a: BigInt(-2),
        n: BigInt(5),
        modInv: BigInt(2)
    }
];

describe('modInv', function () {
    for (const input of inputs) {
        let ret;
        describe(`modInv(${input.a}, ${input.n})`, function () {
            it(`should return ${input.modInv}`, function () {
                ret = bigintCryptoUtils.modInv(input.a, input.n);
                chai.expect(ret).to.equal(input.modInv);
            });
        });
    }
});