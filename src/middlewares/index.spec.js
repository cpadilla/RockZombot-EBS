const config = require('../configuration')
const { HttpStatus } = require('../utils/index')
const MiddleWareHelper = require('./index')

describe('MiddlewareHelper', function() {
    describe('#jsonInvalid', function() {
        context('#with error', function() {
            before(function() {
                this.jsonInvalidSpy = sinon.spy(MiddleWareHelper, 'jsonInvalid')
                this.nextStub = sinon.stub()
                this.sendMockStub = sinon.stub()
                this.resMock = { status: (httpStatus) => ({ send: this.sendMockStub }) }
                this.statusSpy = sinon.spy(this.resMock, 'status')
                this.errorMessage = 'jsonInvalid'
                this.errMock = new Error(this.errorMessage)
                this.errorReplyReturn = { status: false, message: `Error parsing json: ${this.errorMessage}`, data: [] }
                this.errorReplyStub = sinon.stub(MiddleWareHelper, 'errorReply').returns(this.errorReplyReturn)
            })

            after(function() {
                this.jsonInvalidSpy.restore()
                this.statusSpy.restore()
                this.errorReplyStub.restore()
            })

            beforeEach(function() {
                MiddleWareHelper.jsonInvalid(this.errMock, () => {}, this.resMock, this.nextStub)
            })

            it('it should have been called', function() {
                expect(this.jsonInvalidSpy).to.have.been.called
            })

            it('it should not have called next', function() {
                expect(this.nextStub).to.not.have.been.called
            })

            it('it should have called res.status with correct params', function() {
                expect(this.statusSpy).to.have.been.calledWith(HttpStatus.BAD_REQUEST)
            })

            it('it should have called send with correct params', function() {
                expect(this.sendMockStub).to.have.been.calledWith(this.errorReplyReturn)
            })

            it('it should have called errorReply with the correct params', function() {
                expect(this.errorReplyStub).to.have.been.calledWith({ message: `Error parsing json: ${this.errorMessage}` })
            })
        })

        context('#with error', function() {
            before(function() {
                this.jsonInvalidSpy = sinon.spy(MiddleWareHelper, 'jsonInvalid')
                this.nextStub = sinon.stub()
            })

            after(function() {
                this.jsonInvalidSpy.restore()
            })

            beforeEach(function() {
                MiddleWareHelper.jsonInvalid(null, () => {}, () => {}, this.nextStub)
            })

            it('it should have been called', function() {
                expect(this.jsonInvalidSpy).to.have.been.called
            })

            it('it should have called next function', function() {
                expect(this.nextStub).to.have.been.called
            })
        })
    })

    context('#errorReply', function() {
        it('it should have return a correct object with default params invoked', function() {
            expect(MiddleWareHelper.errorReply()).to.be.deep.equal({ status: false, message: '', data: [] })
        })

        it('it should have returned a correct object with err object passed as param', function() {
            expect(MiddleWareHelper.errorReply({ err: new Error('My error') })).to.be.deep.equal({ status: false, message: 'My error', data: [] })
        })

        it('it should have returned a correct object with a message passed as param', function() {
            expect(MiddleWareHelper.errorReply({ message: 'my message' })).to.be.deep.equal({ status: false, message: 'my message', data: [] })
        })
    })

    context('#dataReply', function() {
        it('it should have return a correct object with default params invoked', function() {
            expect(MiddleWareHelper.dataReply()).to.be.deep.equal({ status: true, message: '', data: [] })
        })

        it('it should have returned a correct object with data param', function() {
            expect(MiddleWareHelper.dataReply({ myData: 'data' })).to.be.deep.equal({ status: true, message: '', data: { myData: 'data' } })
        })
    })

    context('#replyProvider', function() {
        before(function() {
            this.resMock = {}
            this.nextStub = sinon.stub()
            MiddleWareHelper.replyProvider(() => {}, this.resMock, this.nextStub)
        })

        it('it should attached reply property to res object', function() {
            expect(this.resMock).to.have.a.property('reply').that.is.a('function')
        })

        it('it should have called next', function() {
            expect(this.nextStub).to.have.been.called
        })
    })

    describe('#logErrors', function() {
        context('#with environment set to dev', function() {
            before(function() {
                this.configGetStub = sinon.stub(config, 'get').returns('dev')
                this.consoleLogStub = sinon.stub(console, 'log')
                this.nextStub = sinon.stub()
                this.errMock = new Error('My error')
            })

            after(function() {
                this.configGetStub.restore()
                this.consoleLogStub.restore()
            })

            beforeEach(function() {
                MiddleWareHelper.logErrors(this.errMock, () => {}, () => {}, this.nextStub)
            })

            it('it should have called console.log with the correct params', function() {
                expect(this.consoleLogStub).to.have.been.calledWith(this.errMock.stack)
            })

            it('it should have called next with the correct params', function() {
                expect(this.nextStub).to.have.been.calledWith(this.errMock)
            })
        })

        context('#with environment set to development', function() {
            before(function() {
                this.configGetStub = sinon.stub(config, 'get').returns('development')
                this.consoleLogStub = sinon.stub(console, 'log')
                this.nextStub = sinon.stub()
                this.errMock = new Error('My error')
            })

            after(function() {
                this.configGetStub.restore()
                this.consoleLogStub.restore()
            })

            beforeEach(function() {
                MiddleWareHelper.logErrors(this.errMock, () => {}, () => {}, this.nextStub)
            })

            it('it should have called console.log with the correct params', function() {
                expect(this.consoleLogStub).to.have.been.calledWith(this.errMock.stack)
            })

            it('it should have called next with the correct params', function() {
                expect(this.nextStub).to.have.been.calledWith(this.errMock)
            })
        })

        context('#without env or it is different than dev or development', function() {
            before(function() {
                this.configGetStub = sinon.stub(config, 'get').returns('production')
                this.consoleLogStub = sinon.stub(console, 'log')
                this.nextStub = sinon.stub()
                this.errMock = new Error('My error')
            })

            after(function() {
                this.configGetStub.restore()
                this.consoleLogStub.restore()
            })

            beforeEach(function() {
                MiddleWareHelper.logErrors(this.errMock, () => {}, () => {}, this.nextStub)
            })

            it('it should have have called console.log', function() {
                expect(this.consoleLogStub).to.not.have.been.called
            })

            it('it should have called next with the correct params', function() {
                expect(this.nextStub).to.have.been.calledWith(this.errMock)
            })
        })
    })

    context('#errorHandler', function() {
        before(function() {
            this.sendMockStub = sinon.stub()
            this.resMock = { status: (httpStatus) => ({ send: this.sendMockStub }) }
            this.statusSpy = sinon.spy(this.resMock, 'status')
            this.errMock = new Error('my error')
            this.nextStub = sinon.stub()
        })

        beforeEach(function() {
            MiddleWareHelper.errorHandler(this.errMock, () => {}, this.resMock, this.nextStub)
        })

        it('it should have called res.status with correct params', function() {
            expect(this.statusSpy).to.have.been.calledWith(HttpStatus.SERVER_ERROR)
        })

        it('it should have called res.send with the correct params', function() {
            expect(this.sendMockStub).to.have.been.calledWith(MiddleWareHelper.errorReply({ err: this.errMock }))
        })

        it('it should have called next with the correct params', function() {
            expect(this.nextStub).to.have.been.calledWith()
        })
    })

    describe('#addCorsHeaders', function() {
        context('#with add cors headers env variable set to false', function() {
            before(function() {
                this.resMock = { setHeader: sinon.stub() }
                this.configGetStub = sinon.stub(config, 'get').returns(false)
                this.nextStub = sinon.stub()
            })

            after(function() {
                this.configGetStub.restore()
            })

            beforeEach(function() {
                MiddleWareHelper.addCorsHeaders(() => {}, this.resMock, this.nextStub)
            })

            it('it should have called next', function() {
                expect(this.nextStub).to.have.been.called
            })

            it('it should not have called res.setHeader', function() {
                expect(this.resMock.setHeader).to.not.have.been.called
            })
        })

        context('#with add cors env variable set to true', function() {
            before(function() {
                this.resMock = { setHeader: sinon.stub() }
                this.configGetStub = sinon.stub(config, 'get').returns(true)
                this.nextStub = sinon.stub()
            })

            after(function() {
                this.configGetStub.restore()
            })

            beforeEach(function() {
                MiddleWareHelper.addCorsHeaders(() => {}, this.resMock, this.nextStub)
            })

            it('it should have called next', function() {
                expect(this.nextStub).to.have.been.called
            })

            it('it should  have called res.setHeader', function() {
                expect(this.resMock.setHeader).to.have.been.called
            })
        })
    })
})
