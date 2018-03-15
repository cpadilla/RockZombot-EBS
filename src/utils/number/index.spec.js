const {
    isValidNumber,
    parseNumber,
    getDefaultNumeric
} = require('./index')

describe('Number utils', function() {
    context('#isValidNumber', function() {
        it('it should be false if the number is not valid', function() {
            expect(isValidNumber()).to.be.false
            expect(isValidNumber({ number: null })).to.be.false
            expect(isValidNumber({ number: {} })).to.be.false
            expect(isValidNumber({ number: new Date() })).to.be.false
            expect(isValidNumber({ number: 'test' })).to.be.false
        })

        it('it should be true if the number is valid', function() {
            expect(isValidNumber({ number: 12 })).to.be.true
            expect(isValidNumber({ number: 12.5 })).to.be.true
            expect(isValidNumber({ number: '12' })).to.be.true
            expect(isValidNumber({ number: '12.5' })).to.be.true
        })
    })

    context('#parseNumber', function() {
        it('it should be NaNc', function() {
            expect(parseNumber()).to.be.NaN
            expect(parseNumber({ number: null })).to.be.NaN
            expect(parseNumber({ number: {} })).to.be.NaN
            expect(parseNumber({ number: new Date() })).to.be.NaN
            expect(parseNumber({ number: '' })).to.be.NaN
            expect(parseNumber({ number: [] })).to.be.NaN
        })

        it('it should parses the number to a float', function() {
            expect(parseNumber({ number: 15 })).to.be.equal(15)
            expect(parseNumber({ number: 15.5 })).to.be.equal(15.5)
            expect(parseNumber({ number: '15' })).to.be.equal(15)
            expect(parseNumber({ number: '15.5' })).to.be.equal(15.5)
        })
    })

    context('#getDefaultNumeric', function() {
        it('it should get the default number if the number is not valid', function() {
            expect(getDefaultNumeric()).to.be.equal(0)
            expect(getDefaultNumeric({ number: null })).to.be.equal(0)
            expect(getDefaultNumeric({ number: {} })).to.be.equal(0)
            expect(getDefaultNumeric({ number: [] })).to.be.equal(0)
            expect(getDefaultNumeric({ number: '', defaultNumber: 1 })).to.be.equal(1)
            expect(getDefaultNumeric({ number: new Date(), defaultNumber: 2 })).to.be.equal(2)
        })

        it('it should get the same number if the number is valid', function() {
            expect(getDefaultNumeric({ number: 123.4 })).to.be.equal(123.4)
            expect(getDefaultNumeric({ number: '12.5' })).to.be.equal(12.5)
        })
    })
})
