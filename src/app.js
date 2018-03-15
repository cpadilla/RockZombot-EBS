/**
 * This is an example of a basic node.js script that performs
 * the Authorization Code oAuth2 flow to authenticate against
 * the Spotify Accounts.
 *
 * For more information, read
 * https://developer.spotify.com/web-api/authorization-guide/#authorization_code_flow
 */
const express = require('express')
const helmet = require('helmet')
const logger = require('morgan')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const config = require('./configuration')
const MiddlewareHelper = require('./middlewares')
const router = require('./routing')
const port = config.get('PORT') || 3000
const env = config.get('ENVIRONMENT')
const app = express()

app.use(helmet())
app.use(MiddlewareHelper.addCorsHeaders)
if (env && (env === 'dev' || env === 'development')) {
    app.use(logger('short'))
}
app.use(express.static(__dirname + '/public'))
app.use(cookieParser());
app.use(bodyParser.json())
app.use(MiddlewareHelper.jsonInvalid)
app.use(MiddlewareHelper.replyProvider)
app.use('/', router.routes())
app.use(MiddlewareHelper.logErrors)
app.use(MiddlewareHelper.errorHandler)

exports.app = app
exports.start = async () => {
    try {
        await app.listen(port)
        console.log(`Connected on port: ${port}`)
    } catch (err) {
        console.log('Something went wrong')
        console.log(err)
    }
}
