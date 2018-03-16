const { MySqlConnection } = require('../connections')
const { MySqlRunner } = require('../database')
const locales = require('../locales')
const Model = require('./index')

describe('Model', function() {
    describe('#constructor', function() {
        context('#defaults', function() {
            before(function() {
                this.modelInstance = new Model({ name: 'myModel' })
            })

            it('it should be an instance of MySqlRunner', function() {
                expect(this.modelInstance).to.be.instanceOf(MySqlRunner)
            })

            it('it should be an instance of Model', function() {
                expect(this.modelInstance).to.be.instanceOf(Model)
            })

            it('it should initialize with default options', function() {
                expect(this.modelInstance).to.have.a.property('name', 'myModel')
                expect(this.modelInstance).to.have.a.property('connection').to.be.instanceOf(MySqlConnection)
                expect(this.modelInstance).to.have.a.property('locales', locales.get())
            })
        })
    })

    context('#find', function() {
        before(function() {
            this.modelInstance = new Model({ name: 'userModel' })
            this.findSpy = sinon.spy(this.modelInstance, 'find')
            this.sql = 'some sql'
            this.params = { id: 1 }
            this.resolvedValue = [{ name: 'myName', email: 'my@email.com' }]
            this.runStub = sinon.stub(this.modelInstance, 'run').resolves(this.resolvedValue)
        })

        after(function() {
            this.findSpy.restore()
            this.runStub.restore()
        })

        beforeEach(async function() {
            await this.modelInstance.find({ sql: this.sql })
        })

        it('it should have been called', function() {
            expect(this.findSpy).to.have.been.calledWith({ sql: this.sql })
        })

        it('it should have called super.run', function() {
            expect(this.runStub).to.have.been.called
        })

        it('it should have called super.run with correct params', function() {
            expect(this.runStub).to.have.been.calledWith({
                sql: this.sql,
                params: {},
                attempts: 1
            })
        })

        it('it should returned the founded items', function() {
            expect(this.modelInstance.find({ sql: this.sql, params: this.params, attempts: 2 })).to.eventually.be.deep.equal(this.resolvedValue)
        })
    })

    context('#findOne', function() {
        before(function() {
            this.modelInstance = new Model({ name: 'userModel' })
            this.findOneSpy = sinon.spy(this.modelInstance, 'findOne')
            this.sql = 'some sql'
            this.params = { id: 1 }
            this.resolvedValue = [{ name: 'myName', email: 'my@email.com' }]
            this.runStub = sinon.stub(this.modelInstance, 'run').resolves(this.resolvedValue)
        })

        after(function() {
            this.findOneSpy.restore()
            this.runStub.restore()
        })

        beforeEach(async function() {
            await this.modelInstance.findOne({ sql: this.sql })
        })

        it('it should have been called', function() {
            expect(this.findOneSpy).to.have.been.calledWith({ sql: this.sql })
        })

        it('it should have called super.run', function() {
            expect(this.runStub).to.have.been.called
        })

        it('it should have called super.run with correct params', function() {
            expect(this.runStub).to.have.been.calledWith({
                sql: this.sql,
                params: {},
                attempts: 1
            })
        })

        it('it should returned the founded items', function() {
            expect(this.modelInstance.findOne({ sql: this.sql, params: this.params, attempts: 2 })).to.eventually.be.deep.equal(this.resolvedValue[0])
        })
    })

    context('#create', function() {
        before(function() {
            this.modelInstance = new Model({ name: 'userModel' })
            this.createSpy = sinon.spy(this.modelInstance, 'create')
            this.sql = 'some sql'
            this.params = { id: 1 }
            this.runStub = sinon.stub(this.modelInstance, 'run').resolves({ insertedId: 1 })
        })

        after(function() {
            this.createSpy.restore()
            this.runStub.restore()
        })

        beforeEach(async function() {
            await this.modelInstance.create({ sql: this.sql, params: this.params })
        })

        it('it should have been called', function() {
            expect(this.createSpy).to.have.been.calledWith({ sql: this.sql, params: this.params })
        })

        it('it should have called super.run', function() {
            expect(this.runStub).to.have.been.called
        })

        it('it should have called super.run with correct params', function() {
            expect(this.runStub).to.have.been.calledWith({
                sql: this.sql,
                params: this.params,
                attempts: 1
            })
        })

        it('it should returned an empty array', function() {
            expect(this.modelInstance.create({ sql: this.sql, params: this.params, attempts: 2 })).to.eventually.be.deep.equal([])
        })
    })

    context('#update', function() {
        before(function() {
            this.modelInstance = new Model({ name: 'userModel' })
            this.updateSpy = sinon.spy(this.modelInstance, 'update')
            this.sql = 'some sql'
            this.params = { id: 1 }
            this.runStub = sinon.stub(this.modelInstance, 'run').resolves([])
        })

        after(function() {
            this.updateSpy.restore()
            this.runStub.restore()
        })

        beforeEach(async function() {
            await this.modelInstance.update({ sql: this.sql, params: this.params })
        })

        it('it should have been called', function() {
            expect(this.updateSpy).to.have.been.calledWith({ sql: this.sql, params: this.params })
        })

        it('it should have called super.run', function() {
            expect(this.runStub).to.have.been.called
        })

        it('it should have called super.run with correct params', function() {
            expect(this.runStub).to.have.been.calledWith({
                sql: this.sql,
                params: this.params,
                attempts: 1
            })
        })

        it('it should returned an empty array', function() {
            expect(this.modelInstance.update({ sql: this.sql, params: this.params, attempts: 2 })).to.eventually.be.deep.equal([])
        })
    })

    context('#remove', function() {
        before(function() {
            this.modelInstance = new Model({ name: 'userModel' })
            this.removeSpy = sinon.spy(this.modelInstance, 'remove')
            this.sql = 'some sql'
            this.params = { id: 1 }
            this.runStub = sinon.stub(this.modelInstance, 'run').resolves([])
        })

        after(function() {
            this.removeSpy.restore()
            this.runStub.restore()
        })

        beforeEach(async function() {
            await this.modelInstance.remove({ sql: this.sql, params: this.params })
        })

        it('it should have been called', function() {
            expect(this.removeSpy).to.have.been.calledWith({ sql: this.sql, params: this.params })
        })

        it('it should have called super.run', function() {
            expect(this.runStub).to.have.been.called
        })

        it('it should have called super.run with correct params', function() {
            expect(this.runStub).to.have.been.calledWith({
                sql: this.sql,
                params: this.params,
                attempts: 1
            })
        })

        it('it should returned an empty array', function() {
            expect(this.modelInstance.remove({ sql: this.sql, params: this.params, attempts: 2 })).to.eventually.be.deep.equal([])
        })
    })
})
