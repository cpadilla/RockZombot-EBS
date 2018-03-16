const { getNewId, isNil, isEmpty } = require('./index')

describe('Generic utils', function() {
    context('#getNewId', function() {
        it('it should get a new uuid', function() {
            expect(getNewId()).to.be.a('string').with.length(36)
        })
    })

    context('#isNil', function() {
        it('it should be false if the value is not null or undefined', function() {
            expect(isNil({ value: 1 })).to.be.false
            expect(isNil({ value: '' })).to.be.false
            expect(isNil({ value: {} })).to.be.false
            expect(isNil({ value: [] })).to.be.false
        })

        it('it should be true if the value is null or undefined', function() {
            expect(isNil()).to.be.true
            expect(isNil({ value: null })).to.be.true
        })
    })

    context('#isEmpty', function() {
        it('it should get false if the value is not empty', function() {
            expect(isEmpty({ value: { key: 1 } })).to.be.false
            expect(isEmpty({ value: [1] })).to.be.false
        })

        it('it should get true if the value is empty', function() {
            expect(isEmpty()).to.be.true
            expect(isEmpty({ value: null })).to.be.true
            expect(isEmpty({ value: '' })).to.be.true
            expect(isEmpty({ value: {} })).to.be.true
            expect(isEmpty({ value: [] })).to.be.true
        })
    })
})
