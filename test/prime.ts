describe('Testing prime generation', function () {
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
  this.timeout(120000)
  for (const bitLength of bitLengths) {
    describe(`prime(${bitLength})`, function () {
      if (bitLength > 0) {
        it(`should return a random ${bitLength}-bits probable prime`, async function () {
          const prime = await _pkg.prime(bitLength)
          chai.expect(_pkg.bitLength(prime)).to.equal(bitLength)
        })
      } else {
        it('should throw error', function () {
          chai.expect(() => _pkg.prime(bitLength)).to.throw(RangeError) // eslint-disable-line
        })
      }
    })
  }
  describe('Testing sync (NOT-RECOMMENDED) version: primeSync()', function () {
    it('should return a random 1024-bits probable prime', function () {
      const prime = _pkg.primeSync(1024, 16)
      chai.expect(_pkg.bitLength(prime)).to.equal(1024)
      chai.expect(() => _pkg.primeSync(0)).to.throw(RangeError)
    })
  })
})
