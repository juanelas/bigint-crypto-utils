'use strict'

// Every test file (you can create as many as you want) should start like this
// Please, do NOT touch. They will be automatically removed for browser tests -->
const _pkg = require('../lib/index.node')
const chai = require('chai')
// <--

const iterations = 10
const bitLengths = [-1, 0, 3, 8, 16, 511, 2048]
const byteLengths = [-7, 0, 1, 8, 33, 40]

describe('testing randBits', async function () {
  for (const bitLength of bitLengths) {
    describe(`${iterations} iterations of randBitsSync(${bitLength})`, function () {
      if (bitLength > 0) {
        it('should return buffers', function () {
          let ret = true
          for (let i = 0; i < iterations; i++) {
            const randbits = _pkg.randBitsSync(bitLength)
            // console.log(JSON.stringify(randbits))
            const randbits2 = _pkg.randBitsSync(bitLength, true)
            // console.log(JSON.stringify(randbits2))
            if (!(((randbits instanceof Uint8Array) && (randbits2 instanceof Uint8Array)) ||
             ((randbits instanceof Buffer) && (randbits2 instanceof Buffer)))) {
              ret = false
              break
            }
          }
          chai.expect(ret).to.equal(true)
        })
      } else {
        it('should throw RangeError', function () {
          chai.expect(() => _pkg.randBitsSync(bitLength)).to.throw(RangeError)
        })
      }
    })
    describe(`${iterations} iterations of randBits(${bitLength})`, async function () {
      if (bitLength > 0) {
        it('should return buffers', async function () {
          let ret = true
          for (let i = 0; i < iterations; i++) {
            const randbits = await _pkg.randBits(bitLength)
            // console.log(JSON.stringify(randbits))
            const randbits2 = await _pkg.randBits(bitLength, true)
            // console.log(JSON.stringify(randbits2))
            if (!(((randbits instanceof Uint8Array) && (randbits2 instanceof Uint8Array)) ||
             ((randbits instanceof Buffer) && (randbits2 instanceof Buffer)))) {
              ret = false
              break
            }
          }
          chai.expect(ret).to.equal(true)
        })
      } else {
        it('should throw RangeError', function () {
          chai.expect(() => _pkg.randBits(bitLength)).to.throw(RangeError)
        })
      }
    })
  }
})

describe('testing randBytes', async function () {
  for (const byteLength of byteLengths) {
    describe(`${iterations} iterations of randBytesSync(${byteLength})`, function () {
      if (byteLength > 0) {
        it('should return buffers', function () {
          let ret = true
          for (let i = 0; i < iterations; i++) {
            const randbytes = _pkg.randBytesSync(byteLength)
            // console.log(JSON.stringify(randbits))
            const randbytes2 = _pkg.randBytesSync(byteLength, true)
            // console.log(JSON.stringify(randbits2))
            if (!(((randbytes instanceof Uint8Array) && (randbytes2 instanceof Uint8Array)) ||
             ((randbytes instanceof Buffer) && (randbytes2 instanceof Buffer)))) {
              ret = false
            }
          }
          chai.expect(ret).to.equal(true)
        })
      } else {
        it('should throw RangeError', function () {
          chai.expect(() => _pkg.randBytesSync(byteLength)).to.throw(RangeError)
        })
      }
    })
    describe(`${iterations} iterations of randBytes(${byteLength})`, async function () {
      if (byteLength > 0) {
        it('should return buffers', async function () {
          let ret = true
          for (let i = 0; i < iterations; i++) {
            const randbytes = await _pkg.randBytes(byteLength)
            // console.log(JSON.stringify(randbits))
            const randbytes2 = await _pkg.randBytes(byteLength, true)
            // console.log(JSON.stringify(randbits2))
            if (!(((randbytes instanceof Uint8Array) && (randbytes2 instanceof Uint8Array)) ||
             ((randbytes instanceof Buffer) && (randbytes2 instanceof Buffer)))) {
              ret = false
            }
          }
          chai.expect(ret).to.equal(true)
        })
      } else {
        it('should throw RangeError', function () {
          chai.expect(() => _pkg.randBytes(byteLength)).to.throw(RangeError)
        })
      }
    })
  }
})
