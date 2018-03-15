const { isValidString, getDefaultString } = require('./index')

describe('String utils', function() {
    context('#isValidString', function() {
        it('it should be false if the string is not valid', function() {
            expect(isValidString()).to.be.false
            expect(isValidString({ value: null })).to.be.false
            expect(isValidString({ value: {} })).to.be.false
            expect(isValidString({ value: new Date() })).to.be.false
            expect(isValidString({ value: 12 })).to.be.false
            expect(isValidString({ value: '' })).to.be.false
        })

        it('it should be true if the string is valid', function() {
            expect(isValidString({ value: 'valid' })).to.be.true
        })
    })

    context('#getDefaultString', function() {
        it('it should get the defaults strings if the string is not valid', function() {
            expect(getDefaultString()).to.be.equal('0')
            expect(getDefaultString({ value: null })).to.be.equal('0')
            expect(getDefaultString({ value: {} })).to.be.equal('0')
            expect(getDefaultString({ value: [] })).to.be.equal('0')
            expect(getDefaultString({ value: '' })).to.be.equal('0')
            expect(getDefaultString({ value: 1, defaultValue: 'default' })).to.be.equal('default')
            expect(getDefaultString({ value: new Date(), defaultValue: 'default' })).to.be.equal('default')
        })

        it('it should get the same string if string is valid', function() {
            expect(getDefaultString({ value: 'valid string' })).to.be.equal('valid string')
            expect(getDefaultString({ value: '123' })).to.be.equal('123')
        })
    })
})
