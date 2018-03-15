/**
 * This is an example of a basic node.js script that performs
 * the Authorization Code oAuth2 flow to authenticate against
 * the Spotify Accounts.
 *
 * For more information, read
 * https://developer.spotify.com/web-api/authorization-guide/#authorization_code_flow
 */
const express = require('express'); // Express web server framework
const request = require('request'); // "Request" library
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const client_id = 'dfbe0669b7fb4707ad274d0751f3ea90'; // Your client id
const client_secret = 'c903b543827e4676bee7a5ca74388395'; // Your secret
const redirect_uri = 'http://localhost:8888/callback/'; // Your redirect uri
const router = require('./routing')

const app = express();

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
