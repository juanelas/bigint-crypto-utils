'use strict'

// Every test file (you can create as many as you want) should start like this
// Please, do NOT touch. They will be automatically removed for browser tests -->
const _pkg = require('../lib/index.node')
const chai = require('chai')
// <--

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
  },
  {
    a: BigInt(0),
    n: BigInt(0),
    modInv: NaN
  },
  {
    a: BigInt(0),
    n: BigInt(37),
    modInv: NaN
  }
]

describe('modInv', function () {
  for (const input of inputs) {
    describe(`modInv(${input.a}, ${input.n})`, function () {
      it(`should return ${input.modInv}`, function () {
        const ret = _pkg.modInv(input.a, input.n)
        // chai.assert( String(ret) === String(input.modInv) );
        chai.expect(String(ret)).to.be.equal(String(input.modInv))
      })
    })
  }
})
