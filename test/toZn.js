'use strict';

// For the browser test builder to work you MUST import them module in a variable that
// is the camelised version of the package name.
const bigintCryptoUtils = require('../dist/bigint-crypto-utils-latest.node');
const chai = require('chai');

const inputs = [
    {
        a: BigInt(1),
        n: BigInt(19),
        toZn: BigInt(1)
    },
    {
        a: BigInt(-25),
        n: BigInt(9),
        toZn: BigInt(2)
    },
    {
        a: BigInt('12359782465012847510249'),
        n: BigInt(5),
        toZn: BigInt(4)
    }
];

describe('toZn', function () {
    for (const input of inputs) {
        describe(`toZn(${input.a}, ${input.n})`, function () {
            it(`should return ${input.toZn}`, function () {
                const ret = bigintCryptoUtils.toZn(input.a, input.n);
                chai.expect(ret).to.equal(input.toZn);
            });
        });
    }
});