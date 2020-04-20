'use strict'

// Every test file (you can create as many as you want) should start like this
// Please, do NOT touch. They will be automatically removed for browser tests -->
const _pkg = require('../lib/index.node')
const chai = require('chai')
// <--

const iterations = 10
const bitLengths = [0, 3, 8, 16, 511, 2048]
const byteLengths = [0, 1, 8, 33, 40]

describe('testing randBits', async function () {
  for (const bitLength of bitLengths) {
    describe(`${iterations} of randBitsSync(${bitLength})`, function () {
      for (let i = 0; i < iterations; i++) {
        it('should return a buffer', function () {
          try {
            const randbits = _pkg.randBitsSync(bitLength)
            // console.log(JSON.stringify(randbits))
            if (randbits instanceof Uint8Array) chai.expect(randbits).to.be.an.instanceOf(Uint8Array)
            else chai.expect(randbits).to.be.an.instanceOf(Buffer)
            const randbits2 = _pkg.randBitsSync(bitLength, true)
            // console.log(JSON.stringify(randbits2))
            if (randbits2 instanceof Uint8Array) chai.expect(randbits2).to.be.an.instanceOf(Uint8Array)
            else chai.expect(randbits2).to.be.an.instanceOf(Buffer)
          } catch (error) {
            chai.expect(bitLength).to.be.lte(0)
          }
        })
      }
    })
    describe(`${iterations} of randBits(${bitLength})`, async function () {
      for (let i = 0; i < iterations; i++) {
        it('should return a buffer', async function () {
          try {
            const randbits = await _pkg.randBits(bitLength)
            // console.log(JSON.stringify(randbits))
            if (randbits instanceof Uint8Array) chai.expect(randbits).to.be.an.instanceOf(Uint8Array)
            else chai.expect(randbits).to.be.an.instanceOf(Buffer)
            const randbits2 = await _pkg.randBits(bitLength, true)
            // console.log(JSON.stringify(randbits2))
            if (randbits2 instanceof Uint8Array) chai.expect(randbits2).to.be.an.instanceOf(Uint8Array)
            else chai.expect(randbits2).to.be.an.instanceOf(Buffer)
          } catch (error) {
            chai.expect(bitLength).to.be.lte(0)
          }
        })
      }
    })
  }
})

describe('testing randBytes', async function () {
  for (const byteLength of byteLengths) {
    describe(`${iterations} of randBytesSync(${byteLength})`, function () {
      for (let i = 0; i < iterations; i++) {
        it('should return a buffer', function () {
          try {
            const randbits = _pkg.randBytesSync(byteLength)
            console.log(JSON.stringify(randbits))
            if (randbits instanceof Uint8Array) chai.expect(randbits).to.be.an.instanceOf(Uint8Array)
            else chai.expect(randbits).to.be.an.instanceOf(Buffer)
            const randbits2 = _pkg.randBytesSync(byteLength, true)
            console.log(JSON.stringify(randbits2))
            if (randbits2 instanceof Uint8Array) chai.expect(randbits2).to.be.an.instanceOf(Uint8Array)
            else chai.expect(randbits2).to.be.an.instanceOf(Buffer)
          } catch (error) {
            chai.expect(byteLength).to.be.lte(0)
          }
        })
      }
    })
    describe(`${iterations} of randBytes(${byteLength})`, async function () {
      for (let i = 0; i < iterations; i++) {
        it('should return a buffer', async function () {
          try {
            const randbits = await _pkg.randBytes(byteLength)
            console.log(JSON.stringify(randbits))
            if (randbits instanceof Uint8Array) chai.expect(randbits).to.be.an.instanceOf(Uint8Array)
            else chai.expect(randbits).to.be.an.instanceOf(Buffer)
            const randbits2 = await _pkg.randBytes(byteLength, true)
            console.log(JSON.stringify(randbits2))
            if (randbits2 instanceof Uint8Array) chai.expect(randbits2).to.be.an.instanceOf(Uint8Array)
            else chai.expect(randbits2).to.be.an.instanceOf(Buffer)
          } catch (error) {
            chai.expect(byteLength).to.be.lte(0)
          }
        })
      }
    })
  }
})
