const mysql = require('mysql')
const config = require('../../configuration')
const Connection = require('../connection')
const MySqlConnection = require('./index')
const { user: username, password, database, host } = config.get('CLIENT_DB')

describe('MySql connection', function() {
    context('#constructor', function() {
        before(function() {
            this.connectionInstance = new MySqlConnection({})
        })

        it('it should be an instance of Connection', function() {
            expect(this.connectionInstance).to.be.instanceOf(Connection)
        })

        it('it should be an instance of MySql Connection', function() {
            expect(this.connectionInstance).to.be.an.instanceOf(MySqlConnection)
        })

        it('it should have properties based on the configuration file', function() {
            expect(this.connectionInstance).to.have.a.property('name', 'mysqlConnection')
            expect(this.connectionInstance).to.have.a.property('user', username)
            expect(this.connectionInstance).to.have.a.property('password', password)
            expect(this.connectionInstance).to.have.a.property('database', database)
            expect(this.connectionInstance).to.have.a.property('host', host)
            expect(this.connectionInstance).to.have.a.property('insecureAuth', true)
            expect(this.connectionInstance).to.have.a.property('connection').empty
        })

        it('it should get another connection name if it was passed in the constructor', function() {
            const opts = { name: 'connectionName', username: 'myUser', pass: 'myPassword', db: 'myDb', dbHost: 'myHost' }
            this.connectionInstance = new MySqlConnection(opts)
            expect(this.connectionInstance).to.have.a.property('name', opts.name)
            expect(this.connectionInstance).to.have.a.property('user', opts.username)
            expect(this.connectionInstance).to.have.a.property('password', opts.pass)
            expect(this.connectionInstance).to.have.a.property('database', opts.db)
            expect(this.connectionInstance).to.have.a.property('host', opts.dbHost)
            expect(this.connectionInstance).to.have.a.property('insecureAuth', true)
            expect(this.connectionInstance).to.have.a.property('connection').empty
        })
    })

    context('#getConnection', function() {
        before(function() {
            this.configArgs = { username, dbHost: host, pass: password, db: database, insecureAuth: true }
            this.privateConnection = { config: {}, connect: () => '', on: () => '' }
            this.connectionInstance = new MySqlConnection({})
            this.createConnectionStub = sinon.stub(mysql, 'createConnection').returns(this.privateConnection)
            this.createSpy = sinon.spy(this.connectionInstance, 'create')
            this.getConnectionSpy = sinon.spy(this.connectionInstance, 'getConnection')
        })

        after(function() {
            this.createConnectionStub.restore()
        })

        beforeEach(function() {
            this.connectionInstance.getConnection()
        })

        it('get connection should have been called', function() {
            expect(this.getConnectionSpy).to.have.been.called
        })

        it('create should have been been called', function() {
            expect(this.createSpy).to.have.been.called
        })

        it('create connection should have been called with config args', function() {
            expect(this.createConnectionStub).to.have.been.calledWith({
                user: this.configArgs.username,
                password: this.configArgs.pass,
                database: this.configArgs.db,
                host: this.configArgs.dbHost,
                insecureAuth: this.configArgs.insecureAuth
            })
        })

        it('it should have returned private connection', function() {
            expect(this.getConnectionSpy).to.have.returned(this.privateConnection)
        })
    })
})
