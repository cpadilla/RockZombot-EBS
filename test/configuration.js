process.env.ENVIRONMENT = 'test'
const chai = require('chai')
const { expect, should } = require('chai')
const sinon = require('sinon')
const sinonChai = require('sinon-chai')
const chaiPromise = require('chai-as-promised')
const supertest = require('supertest')
const { app } = require('../src/app')

global.expect = expect
global.sinon = sinon
global.request = supertest(app)

should()
chai.use(sinonChai)
chai.use(chaiPromise)




