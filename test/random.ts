import * as bcu from '#pkg'

const iterations = 10
const bitLengths = [-1, 0, 3, 8, 16, 511, 2048]
const byteLengths = [-7, 0, 1, 8, 33, 40, 65536, 67108864]

describe('testing randBits', function () {
  for (const bitLength of bitLengths) {
    describe(`${iterations} iterations of randBitsSync(${bitLength})`, function () {
      if (bitLength > 0) {
        it('should return buffers', function () {
          let ret = true
          for (let i = 0; i < iterations; i++) {
            const randbits = bcu.randBitsSync(bitLength)
            // console.log(JSON.stringify(randbits))
            const randbits2 = bcu.randBitsSync(bitLength, true)
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
          chai.expect(() => bcu.randBitsSync(bitLength)).to.throw(RangeError)
        })
      }
    })
    describe(`${iterations} iterations of randBits(${bitLength})`, function () {
      if (bitLength > 0) {
        it('should return buffers', async function () {
          let ret = true
          for (let i = 0; i < iterations; i++) {
            const randbits = await bcu.randBits(bitLength)
            // console.log(JSON.stringify(randbits))
            const randbits2 = await bcu.randBits(bitLength, true)
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
          chai.expect(() => bcu.randBits(bitLength)).to.throw(RangeError) // eslint-disable-line
        })
      }
    })
  }
})

describe('testing randBytes', function () {
  for (const byteLength of byteLengths) {
    describe(`${iterations} iterations of randBytesSync(${byteLength})`, function () {
      if (byteLength > 0) {
        it('should return buffers', function () {
          let ret = true
          for (let i = 0; i < iterations; i++) {
            const randbytes = bcu.randBytesSync(byteLength)
            // console.log(JSON.stringify(randbits))
            const randbytes2 = bcu.randBytesSync(byteLength, true)
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
          chai.expect(() => bcu.randBytesSync(byteLength)).to.throw(RangeError)
        })
      }
    })
    describe(`${iterations} iterations of randBytes(${byteLength})`, function () {
      if (byteLength > 0) {
        it('should return buffers of the expected length', async function () {
          let ret = true
          for (let i = 0; i < iterations; i++) {
            const randbytes = await bcu.randBytes(byteLength)
            chai.expect(randbytes.length).to.equal(byteLength)
            // console.log(JSON.stringify(randbits))
            const randbytes2 = await bcu.randBytes(byteLength, true)
            chai.expect(randbytes2.length).to.equal(byteLength)
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
          chai.expect(() => bcu.randBytes(byteLength)).to.throw(RangeError) // eslint-disable-line
        })
      }
    })
  }
})
