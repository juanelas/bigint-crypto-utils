'use strict';

// For the browser test builder to work you MUST import them module in a variable that
// is the camelised version of the package name.
const bigintCryptoUtils = require('../dist/bigint-crypto-utils-latest.node');
const chai = require('chai');

const inputs = [
    {
        x: BigInt('2'),
        y: BigInt('512'),
        m: BigInt('1023')
    },
    {
        x: BigInt('24365122346356235624575757256436235623565662'),
        y: BigInt('972435123467572543534524524363462357543452328'),
        m: BigInt('994366340282366920938463463374607431768211455')
    },
    {
        x: BigInt('23578246824582562435213523625125115367135757157241436135715713461467157157534564567457568968596780432245724926715371376153715371537582468346724613557146815714362136846825411436162634'),
        y: BigInt('23452346257257255725757572457514361415713467143511346247552525252565672575474346713575753713467575371537537153156153634371537143656356537625613461435875935725613464351357258246826433'),
        m: BigInt('34625256245625252562562562522243656257475723472525257825421513453465372572467134613757879928061874561780674016745076267344567226707541510465051746350716345026843501611257257252575247')
    }
];

describe('montMul', function () {
    const ITERATIONS = 100;
    const baseBitsArr = [1, 2, 4, 8, 16, 32, 64, 128];

    for (const input of inputs) {
        for (const baseBits of baseBitsArr) {
            describe(`${ITERATIONS} iterations. Mont Mul(${input.x}, ${input.y}, ${input.m}, ${baseBits})`, function () {
                it('should return x*y*R^(-1) mod m', function () {
                    const output = (input.x * input.y) % input.m;

                    let iterations = ITERATIONS;
                    while (iterations > 0) {
                        const mont = new bigintCryptoUtils.Mont(input.m, baseBits);
                        const x = mont.mul(input.x, mont.Rsqr);
                        const y = mont.mul(input.y, mont.Rsqr);
                        let ret = mont.mul(x, y);
                        ret = mont.mul(ret, BigInt(1));
                        chai.expect(ret.toString()).equals(output.toString());
                        iterations--;
                    }
                });
            });
        }
        describe(`${ITERATIONS} iterations. Mont Redc(${input.x} * ${input.y}, ${input.m})`, function () {
            it('should return x*y*R^(-1) mod m', function () {
                const output = (input.x * input.y) % input.m;

                let iterations = ITERATIONS;
                while (iterations > 0) {
                    const mont = new bigintCryptoUtils.Mont(input.m);
                    const x = mont.redc(input.x * mont.Rsqr);
                    const y = mont.redc(input.y * mont.Rsqr);
                    let ret = mont.redc(x * y);
                    ret = mont.redc(ret);
                    chai.expect(ret.toString()).equals(output.toString());
                    iterations--;
                }
            });
        });
    }
});
