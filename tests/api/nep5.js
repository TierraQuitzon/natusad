import * as NEP5 from '../../src/api/nep5'

describe('NEP5', function () {
  this.timeout(10000)
  it('get basic info', () => {
    return NEP5.getTokenInfo('http://test1.cityofzion.io:8880', '5b7074e873973a6ed3708862f219a6fbf4d1c411')
      .then(result => {
        result.name.should.equal('Red Pulse Token 3.1.4')
        result.symbol.should.equal('RPX')
        result.decimals.should.equal(8)
        result.totalSupply.should.be.above(1000)
      })
      .catch((e) => {
        console.log(e)
        throw e
      })
  })
  it('get balance', () => {
    return NEP5.getTokenBalance('http://test1.cityofzion.io:8880', '5b7074e873973a6ed3708862f219a6fbf4d1c411', 'AVf4UGKevVrMR1j3UkPsuoYKSC4ocoAkKx')
      .then(result => {
        result.should.be.above(0)
      })
      .catch((e) => {
        console.log(e)
        throw e
      })
  })
})
