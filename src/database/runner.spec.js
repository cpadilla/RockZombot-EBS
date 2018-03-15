const Runner = require('./runner')
const locales = require('../locales')

describe('Runner', function() {
    context('#constructor', function() {
        before(function() {
            this.runnerInstance = new Runner({})
        })

        it('it should be a instance of Runner', function() {
            expect(this.runnerInstance).to.be.instanceOf(Runner)
        })

        it('it should have the correct default values into constructor', function() {
            expect(this.runnerInstance).to.have.a.property('name', 'runner')
            expect(this.runnerInstance).to.have.a.property('connection', undefined)
            expect(this.runnerInstance).to.have.a.property('locales', locales.get())
        })

        it('it should have the correct passed values into constructor', function() {
            const opts = { name: 'myRunner', connection: {} }
            this.runnerInstance = new Runner(opts)
            expect(this.runnerInstance).to.have.a.property('name', opts.name)
            expect(this.runnerInstance).to.have.a.property('connection', opts.connection)
            expect(this.runnerInstance).to.have.a.property('locales', locales.get())
        })
    })

    describe('#async run', function() {
        context('#without throwing error', function() {
            before(function() {
                this.runnerInstance = new Runner({})
                this.expectedValue = { key: 'some data' }
                this.connectionMock = { close: () => '' }
                this.sql = 'some sql query'
                this.delegateStub = sinon.stub().withArgs(this.sql, {}).resolves(this.expectedValue)
                this.params = { delegate: this.delegateStub, sql: this.sql }
                this.runnerInstance.connection = this.connectionMock
                this.runSpy = sinon.spy(this.runnerInstance, 'run')
                this.connectionCloseSpy = sinon.spy(this.connectionMock, 'close')
            })

            beforeEach(async function() {
                this.returnedValue = await this.runnerInstance.run(this.params)
            })

            after(function() {
                this.runSpy.restore()
                this.connectionCloseSpy.restore()
            })

            it('it should have been called', function() {
                expect(this.runSpy).to.have.been.called
            })

            it('it should have been called with the correct params', function() {
                expect(this.runSpy).to.have.been.calledWith(this.params)
            })

            it('it should have called the delegate function', function() {
                expect(this.delegateStub).to.have.been.called
            })

            it('it should have called the delegate function with the correct params', function() {
                expect(this.delegateStub).to.have.been.calledWith(this.sql, {})
            })

            it('delegate should have return the resolved value', function() {
                expect(this.delegateStub()).to.have.eventually.be.equal(this.expectedValue)
            })

            it('it should have called the connection close method', function() {
                expect(this.connectionCloseSpy).to.have.been.called
            })

            it('it should have return the correct response data', function() {
                expect(this.returnedValue).to.be.equal(this.expectedValue)
            })
        })

        context('#throw error because socket was closed', function() {
            before(function() {
                this.runnerInstance = new Runner({})
                this.connectionMock = { close: () => '' }
                this.sql = 'some sql query'
                this.error = { message: locales.get().theSocketIsClosed }
                this.delegateStub = sinon.stub().rejects(this.error)
                this.params = { delegate: this.delegateStub, sql: this.sql, params: {}, attempts: 3 }
                this.runnerInstance.connection = this.connectionMock
                this.runSpy = sinon.spy(this.runnerInstance, 'run')
                this.connectionCloseSpy = sinon.spy(this.connectionMock, 'close')
            })

            after(function() {
                this.runSpy.restore()
                this.connectionCloseSpy.restore()
            })

            beforeEach(async function() {
                try {
                    await this.runnerInstance.run(this.params)
                } catch (err) { }
            })

            afterEach(function() {
                this.runSpy.resetHistory()
                this.connectionCloseSpy.resetHistory()
            })

            it('delegate function should have throw a socket closed error', function() {
                expect(this.delegateStub()).to.be.rejected
            })

            it('it should have call run method for 3 times', function() {
                expect(this.runSpy).to.have.been.calledThrice
            })

            it('it should have only 1 call of connection close method after the 3 attempts', function() {
                expect(this.connectionCloseSpy).to.have.been.calledOnce
            })

            it('it should throw the error after trying all the attempts', function() {
                expect(this.runnerInstance.run(this.params)).to.be.rejected
            })
        })

        context('#throw unexpected error ', function() {
            before(function() {
                this.connectionMock = { close: () => '' }
                this.runnerInstance = new Runner({})
                this.sql = 'some sql query'
                this.error = new Error('Another error')
                this.delegateStub = sinon.stub().rejects(this.error)
                this.params = { delegate: this.delegateStub, sql: this.sql, params: {}, attempts: 2 }
                this.runnerInstance.connection = this.connectionMock
                this.runSpy = sinon.spy(this.runnerInstance, 'run')
                this.connectionCloseSpy = sinon.spy(this.runnerInstance.connection, 'close')
            })

            after(function() {
                this.runSpy.restore()
                this.connectionCloseSpy.restore()
            })

            beforeEach(async function() {
                try {
                    await this.runnerInstance.run(this.params)
                } catch (err) { }
            })

            afterEach(function() {
                this.connectionCloseSpy.resetHistory()
            })

            it('it should have call connection close only once', function() {
                expect(this.connectionCloseSpy).to.have.been.calledOnce
            })

            it('it should have throw an error', function() {
                expect(this.runnerInstance.run(this.params)).to.be.rejected
            })
        })
    })
})
