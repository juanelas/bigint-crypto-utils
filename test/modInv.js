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
    },
    {
        a: BigInt(2),
        n: BigInt(4),
        modInv: NaN
    }
];

describe('modInv', function () {
    for (const input of inputs) {
        describe(`modInv(${input.a}, ${input.n})`, function () {
            it(`should return ${input.modInv}`, function () {
                const ret = bigintCryptoUtils.modInv(input.a, input.n);
                // chai.assert( String(ret) === String(input.modInv) );
                chai.expect(String(ret)).to.be.equal(String(input.modInv));
            });
        });
    }
});