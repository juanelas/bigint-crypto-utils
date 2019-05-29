'use strict';

// For the browser test builder to work you MUST import them module in a variable that
// is the camelised version of the package name.
const bigintCryptoUtils = require('../dist/bigint-crypto-utils-latest.node');
const chai = require('chai');

const inputs = [
    {
        value: BigInt(1),
        bitLength: 1
    },
    {
        value: BigInt(-2),
        bitLength: 2
    },
    {
        value: BigInt(11592217955149597331),
        abs: BigInt(11592217955149597331),
        bitLength: 64
    }
];

describe('bitLength', function () {
    for (const input of inputs) {
        describe(`bitLength(${input.value})`, function () {
            it(`should return ${input.bitLength}`, function () {
                const ret = bigintCryptoUtils.bitLength(input.value);
                chai.expect(ret).to.equal(input.bitLength);
            });
        });
    }
});