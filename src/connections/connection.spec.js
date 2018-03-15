
const mysql = require('mysql')
const config = require('../configuration')
const Connection = require('./connection')
const { user: username, password, database, host } = config.get('CLIENT_DB')

describe('Connection', function() {
    context('#constructor', function() {
        before(function() {
            this.connectionInstance = new Connection({ })
        })

        it('it should be an instance of Connection', function() {
            expect(this.connectionInstance).to.be.instanceOf(Connection)
        })

        it('it should have properties based on the configuration file', function() {
            expect(this.connectionInstance).to.have.a.property('name', 'connection')
            expect(this.connectionInstance).to.have.a.property('user', username)
            expect(this.connectionInstance).to.have.a.property('password', password)
            expect(this.connectionInstance).to.have.a.property('database', database)
            expect(this.connectionInstance).to.have.a.property('host', host)
            expect(this.connectionInstance).to.have.a.property('insecureAuth', true)
            expect(this.connectionInstance).to.have.a.property('connection').empty
        })

        it('it should have the properties passed on the constructor', function() {
            const opts = { name: 'connectionName', username: 'myUser', pass: 'myPassword', db: 'myDb', dbHost: 'myHost' }
            this.connectionInstance = new Connection(opts)

            expect(this.connectionInstance).to.have.a.property('name', opts.name)
            expect(this.connectionInstance).to.have.a.property('user', opts.username)
            expect(this.connectionInstance).to.have.a.property('password', opts.pass)
            expect(this.connectionInstance).to.have.a.property('database', opts.db)
            expect(this.connectionInstance).to.have.a.property('host', opts.dbHost)
            expect(this.connectionInstance).to.have.a.property('insecureAuth', true)
            expect(this.connectionInstance).to.have.a.property('connection').empty
        })
    })

    context('#create', function() {
        before(function() {
            this.configArgs = { username: 'user1', dbHost: 'localhost', pass: 'pass', db: 'hostmaker_api_example' }
            this.privateConnection = { config: {}, connect: () => '', on: () => '' }
            this.connectionInstance = new Connection(this.configArgs)
            this.createConnectionStub = sinon.stub(mysql, 'createConnection').returns(this.privateConnection)
            this.connectSpy = sinon.spy(this.connectionInstance, 'connect')
            this.createSpy = sinon.spy(this.connectionInstance, 'create')
        })

        after(function() {
            this.createConnectionStub.restore()
        })

        beforeEach(function() {
            this.returnedConnection = this.connectionInstance.create()
        })

        it('create connection should be called', function() {
            expect(this.createSpy).to.have.been.called
        })

        it('create connection should be called with the correct params', function() {
            expect(this.createConnectionStub).to.have.been.calledWith({
                host: this.configArgs.dbHost,
                user: this.configArgs.username,
                password: this.configArgs.pass,
                database: this.configArgs.db,
                insecureAuth: true
            })
        })

        it('connect should be called', function() {
            expect(this.connectSpy).to.have.been.called
        })

        it('connection config should have a query format function', function() {
            expect(this.privateConnection.config).to.have.a.property('queryFormat').that.is.a('Function')
        })

        it('create method should return the private connection', function() {
            expect(this.createSpy).to.have.returned(this.privateConnection)
        })
    })

    context('#connect', function() {
        before(function() {
            this.configArgs = { username: 'user1', dbHost: 'localhost', pass: 'pass', db: 'hostmaker_api_example' }
            this.privateConnection = {
                connect: () => '',
                on: (type, handler) => {
                    handler({ code: 'PROTOCOL_CONNECTION_LOST' })
                },
                end: () => ''
            }

            this.privateConnectionConnectSpy = sinon.spy(this.privateConnection, 'connect')
            this.privateConnectionOnSpy = sinon.spy(this.privateConnection, 'on')
            this.connectionInstance = new Connection(this.configArgs)
            this.connectionInstance.connection = this.privateConnection
            this.connectSpy = sinon.spy(this.connectionInstance, 'connect')
            this.closeSpy = sinon.spy(this.connectionInstance, 'close')
        })

        beforeEach(function() {
            this.connectionInstance.connect()
        })

        it('connect method should be called', function() {
            expect(this.connectSpy).to.have.been.called
        })

        it('it should have called the private connection connect method', function() {
            expect(this.privateConnectionConnectSpy).to.have.been.called
        })

        it('it should have called private connection on method', function() {
            expect(this.privateConnectionOnSpy).to.have.been.called
        })

        it('it should have called close method if a PROTOCOL_CONNECTION_LOST occurs', function() {
            expect(this.closeSpy).to.have.been.called
        })
    })

    context('#close', function() {
        before(function() {
            this.configArgs = { username: 'user1', dbHost: 'localhost', pass: 'pass', db: 'hostmaker_api_example' }
            this.privateConnection = { end: () => '' }

            this.privateConnectionEndSpy = sinon.spy(this.privateConnection, 'end')
            this.connectionInstance = new Connection(this.configArgs)
            this.connectionInstance.connection = this.privateConnection
            this.closeSpy = sinon.spy(this.connectionInstance, 'close')
        })

        beforeEach(function() {
            this.connectionInstance.close()
        })

        it('close should be called', function() {
            expect(this.closeSpy).to.have.been.called
        })

        it('it should called the private connection end method', function() {
            expect(this.privateConnectionEndSpy).to.have.been.called
        })
    })
})
