'use strict'

// Every test file (you can create as many as you want) should start like this
// Please, do NOT touch. They will be automatically removed for browser tests -->
const _pkg = require('../lib/index.node')
const chai = require('chai')
// <--

const numbers = [
  {
    min: BigInt(1),
    max: BigInt(2) ** BigInt(234),
    iterations: 100,
    error: false,
    errorMax: false
  },
  {
    min: BigInt('122461641436345153'),
    max: BigInt(2) ** BigInt(234),
    iterations: 100,
    error: false,
    errorMax: false
  },
  {
    min: BigInt(146347),
    max: BigInt(2),
    iterations: 1,
    error: true,
    errorMax: false
  },
  {
    min: BigInt(2),
    max: BigInt(2),
    iterations: 1,
    error: true,
    errorMax: false
  },
  {
    min: BigInt(-4),
    max: BigInt(2),
    iterations: 1,
    error: true,
    errorMax: false
  },
  {
    min: BigInt(1),
    max: BigInt(-1),
    iterations: 1,
    error: true,
    errorMax: true
  }
]

describe('randBetween', function () {
  this.timeout(90000)
  for (const num of numbers) {
    describe(`randBetween(${num.max}, ${num.min})`, function () {
      if (!num.error) {
        it(`[${num.iterations} iterations] should return x such that min < x < max`, function () {
          let ret = true
          for (let i = 0; i < num.iterations; i++) {
            const x = _pkg.randBetween(num.max, num.min)
            ret = ret && x > num.min && x < num.max
          }
          chai.expect(ret).to.equal(true)
        })
      } else {
        it('should return error (max <=0 || min <0 || min>=max)', function () {
          try {
            _pkg.randBetween(num.max, num.min)
            chai.expect(num.error).to.equal(false)
          } catch (error) {
            chai.expect(num.error).to.equal(true)
          }
        })
      }
    })
    describe(`randBetween(${num.max})`, function () {
      if (!num.errorMax) {
        it(`[${num.iterations} iterations] should return x such that 1 <= x <= max`, function () {
          let ret = true
          for (let i = 0; i < num.iterations; i++) {
            const x = _pkg.randBetween(num.max)
            ret = ret && x >= BigInt(1) && x <= num.max
          }
          chai.expect(ret).to.equal(true)
        })
      } else {
        it('should return error (max <=0)', function () {
          try {
            _pkg.randBetween(num.max)
            chai.expect(num.errorMax).to.equal(false)
          } catch (error) {
            chai.expect(num.errorMax).to.equal(true)
          }
        })
      }
    })
  }
})
