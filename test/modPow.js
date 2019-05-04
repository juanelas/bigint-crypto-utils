'use strict';

// For the browser test builder to work you MUST import them module in a variable that
// is the camelised version of the package name.
const bigintCryptoUtils = require('../dist/bigint-crypto-utils-latest.node');
const chai = require('chai');

const inputs = [
    {
        a: BigInt(4),
        b: BigInt(-1),
        n: BigInt(19),
        modPow: BigInt(5)
    },
    {
        a: BigInt(-5),
        b: BigInt(2),
        n: BigInt(7),
        modPow: BigInt(4)
    },
    {
        a: BigInt(2),
        b: BigInt(255),
        n: BigInt(64),
        modPow: BigInt(0)
    },
    {
        a: BigInt(3),
        b: BigInt(3),
        n: BigInt(25),
        modPow: BigInt(2)
    }
];

describe('modPow', function () {
    for (const input of inputs) {
        let ret;
        describe(`modPow(${input.a}, ${input.b}, ${input.n})`, function () {
            it(`should return ${input.modPow}`, function () {
                ret = bigintCryptoUtils.modPow(input.a, input.b, input.n);
                chai.expect(ret).to.equal(input.modPow);
            });
        });
    }
});