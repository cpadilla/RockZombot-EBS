const config = require('./index')
const localConfig = require('../config.json')

describe('Configuration', function() {
    context('#process.env', function() {
        before(function() {
            this.key = 'TEST'
            this.returnedValue = 'env'
            this.getSpy = sinon.spy(config, 'get')
            process.env[this.key] = this.returnedValue
        })

        after(function() {
            delete process.env.TEST
            this.getSpy.restore()
        })

        beforeEach(function() {
            config.get(this.key)
        })

        it('get should have been called', function() {
            expect(this.getSpy).to.have.been.called
        })

        it('it should have been called with correct key', function() {
            expect(this.getSpy).to.have.been.calledWith(this.key)
        })

        it('it should have returned the correct object', function() {
            expect(this.getSpy).to.have.returned(this.returnedValue)
        })
    })

    context('#Local config', function() {
        before(function() {
            this.key = 'randomLocalKey'
            this.returnedValue = { test: 'local' }
            this.getSpy = sinon.spy(config, 'get')
            localConfig[this.key] = this.returnedValue
        })

        after(function() {
            delete localConfig.randomKey
            this.getSpy.restore()
        })

        beforeEach(function() {
            config.get(this.key)
        })

        it('get should have been called', function() {
            expect(this.getSpy).to.have.been.called
        })

        it('it should have been called with correct key', function() {
            expect(this.getSpy).to.have.been.calledWith(this.key)
        })

        it('it should have returned the correct object', function() {
            expect(this.getSpy).to.have.returned(this.returnedValue)
        })
    })

    context('#Not found', function() {
        before(function() {
            this.key = 'randomKey'
            this.returnedValue = undefined
            this.getSpy = sinon.spy(config, 'get')
        })

        after(function() {
            this.getSpy.restore()
        })

        beforeEach(function() {
            config.get(this.key)
        })

        it('get should have been called', function() {
            expect(this.getSpy).to.have.been.called
        })

        it('it should have been called with correct key', function() {
            expect(this.getSpy).to.have.been.calledWith(this.key)
        })

        it('it should have returned the correct object', function() {
            expect(this.getSpy).to.have.returned(this.returnedValue)
        })
    })
})
