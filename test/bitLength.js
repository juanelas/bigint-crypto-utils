'use strict'

// Every test file (you can create as many as you want) should start like this
// Please, do NOT touch. They will be automatically removed for browser tests -->
const _pkg = require('../lib/index.node')
const chai = require('chai')
// <--

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
]

describe('bitLength', function () {
  for (const input of inputs) {
    describe(`bitLength(${input.value})`, function () {
      it(`should return ${input.bitLength}`, function () {
        const ret = _pkg.bitLength(input.value)
        chai.expect(ret).to.equal(input.bitLength)
      })
    })
  }
})
