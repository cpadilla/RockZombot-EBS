const { MySqlConnection } = require('../../connections')
const locales = require('../../locales')
const Runner = require('../runner')
const MySqlRunner = require('./index')

describe('MySqlRunner', function() {
    context('#constructor', function() {
        before(function() {
            this.runnerInstance = new MySqlRunner({})
        })

        it('it should be an instance of runner', function() {
            expect(this.runnerInstance).to.be.instanceOf(Runner)
        })

        it('it should be an instance of mysql runner', function() {
            expect(this.runnerInstance).to.be.instanceOf(MySqlRunner)
        })

        it('it should have the default constructor properties', function() {
            expect(this.runnerInstance).to.have.a.property('name', 'mysqlRunner')
            expect(this.runnerInstance).to.have.a.property('connection').to.be.instanceOf(MySqlConnection)
            expect(this.runnerInstance).to.have.a.property('locales', locales.get())
        })

        it('it should have the passed properties after initialization', function() {
            const opts = {
                name: 'myRunner',
                user: { name: 'myName', pass: 'myPassword', db: 'hostmaker-api-example', host: 'localhost' },
                Connection: { }
            }

            this.runnerInstance = new MySqlRunner(opts)
            expect(this.runnerInstance).to.have.a.property('name', opts.name)
            expect(this.runnerInstance).to.have.a.property('connection').to.be.deep.equal(opts.Connection)
            expect(this.runnerInstance).to.have.a.property('locales', locales.get())
        })
    })

    describe('#async run', function() {
        context('#without connection', function() {
            before(function() {
                this.connectionMock = { getConnection: () => {} }
                this.runnerInstance = new MySqlRunner({})
                this.runnerInstance.connection = this.connectionMock
                this.runSpy = sinon.spy(this.runnerInstance, 'run')
                this.getConnectionSpy = sinon.spy(this.runnerInstance.connection, 'getConnection')
                this.opts = { sql: 'some sql query', params: { param1: '1' }, attempts: 1 }
            })

            after(function() {
                this.getConnectionSpy.restore()
            })

            beforeEach(async function() {
                await this.runnerInstance.run(this.opts)
            })

            it('it should have been called', function() {
                expect(this.runSpy).to.have.been.called
            })

            it('it should have been called with the correct options', function() {
                expect(this.runSpy).to.have.been.calledWith(this.opts)
            })

            it('it should have call get connection from connection', function() {
                expect(this.getConnectionSpy).to.have.been.called
            })

            it('get connection should have retrieved undefined', function() {
                expect(this.getConnectionSpy).to.have.returned()
            })

            it('it should have return if no connection', function() {
                expect(this.runnerInstance.run(this.opts)).to.eventually.be.equal(undefined)
            })
        })

        context('#with valid connection', function() {
            before(function() {
                this.resolvedValue = { message: 'end delegate process' }
                this.internalConnection = { query: (sql, params, cb) => { cb(null, this.resolvedValue) } }
                this.connectionMock = { getConnection: () => this.internalConnection, close: () => {} }
                this.runnerInstance = new MySqlRunner({})
                this.runnerInstance.connection = this.connectionMock
                this.runSpy = sinon.spy(this.runnerInstance, 'run')
                this.getConnectionSpy = sinon.spy(this.runnerInstance.connection, 'getConnection')
                this.closeSpy = sinon.spy(this.runnerInstance.connection, 'close')
                this.opts = { sql: 'some sql query', params: { param1: '1' }, attempts: 1 }
            })

            after(function() {
                this.runSpy.restore()
                this.getConnectionSpy.restore()
                this.closeSpy.restore()
            })

            beforeEach(async function() {
                await this.runnerInstance.run(this.opts)
            })

            afterEach(function() {
                this.closeSpy.resetHistory()
            })

            it('it should have been called', function() {
                expect(this.runSpy).to.have.been.called
            })

            it('it should have been called with the correct opts', function() {
                expect(this.runSpy).to.have.been.calledWith(this.opts)
            })

            it('it should have get the connection', function() {
                expect(this.getConnectionSpy).to.have.returned(this.internalConnection)
            })

            it('it should have call the connection close method only once', function() {
                expect(this.closeSpy).to.have.been.calledOnce
            })

            it('it should have return the correct resolved value', function() {
                expect(this.runnerInstance.run(this.opts)).to.eventually.be.deep.equal(this.resolvedValue)
            })
        })
    })
})
