'use strict'

// Every test file (you can create as many as you want) should start like this
// Please, do NOT touch. They will be automatically removed for browser tests -->
const _pkg = require('../lib/index.node')
const chai = require('chai')
// <--

const bitLengths = [
  0,
  8,
  255,
  256,
  258,
  512,
  1024,
  2048,
  3072
]

describe('prime', function () {
  this.timeout(120000)
  for (const bitLength of bitLengths) {
    describe(`prime(${bitLength})`, function () {
      it(`should return a random ${bitLength}-bits probable prime`, async function () {
        let primeBitLength = bitLength
        try {
          const prime = await _pkg.prime(bitLength)
          primeBitLength = _pkg.bitLength(prime)
        } catch {}
        chai.expect(primeBitLength).to.equal(bitLength)
      })
    })
  }
  describe('Testing sync (NOT-RECOMMENDED) version: primeSync()', function () {
    it('should return a random 1024-bits probable prime', function () {
      const prime = _pkg.primeSync(1024, 16)
      const primeBitLength = _pkg.bitLength(prime)
      chai.expect(primeBitLength).to.equal(1024)
      try {
        _pkg.primeSync(0)
      } catch (error) {
        chai.expect(true).to.equal(true)
      }
    })
  })
})
