const axios = require('axios')
const querystring = require('querystring')
const { StringUtils } = require('../utils')
const config = require('../configuration')
const stateKey = config.get('SPOTIFY_STATE_KEY')
const clientId = config.get('SPOTIFY_CLIENT_ID')
const clientSecret = config.get('SPOTIFY_CLIENT_SECRET')
const redirectUri = config.get('SPOTIFY_REDIRECT_URI')
const scope = 'user-read-private user-read-email playlist-read-private playlist-read-collaborative playlist-modify-public playlist-modify-private user-library-read user-top-read user-modify-playback-state user-read-currently-playing'

module.exports = { login, loginCallback, refreshToken }

/**
* @api {get} /auth/login Login
* @apiDescriptionLogins into spotify account
* @apiGroup Auth
* @apiVersion 0.0.1
*
* @apiUse defaultSuccessProperties
* @apiUse defaultErrorProperties
*
* @apiUse defaultErrorExample
*/
function login(req, res, next) {
    const state = StringUtils.generateRandomString(16)
    res.cookie(stateKey, state)
    const query = querystring.stringify({ response_type: 'code', client_id: clientId, scope, redirect_uri: redirectUri, state })
    res.redirect(`https://accounts.spotify.com/authorize?${query}`)
}

/**
* @api {get} /auth/callback Spotify callback
* @apiDescription Receives the callback from spotify account
* @apiGroup Auth
* @apiVersion 0.0.1
*
* @apiUse defaultSuccessProperties
* @apiUse defaultErrorProperties
*
* @apiUse defaultErrorExample
*/
async function loginCallback(req, res, next) {
    // your application requests refresh and access tokens
    // after checking the state parameter
    const { cookies = {}, query: { code = null, state = null } } = req
    const storedState = cookies[stateKey] || null

    if (state === null || state !== storedState) { return res.redirect(`/#${querystring.stringify({error: 'state_mismatch'})}`) }

    res.clearCookie(stateKey)
    const authToken = Buffer.from(`${clientId}:${clientSecret}`).toString('base64')
    const authOptions = {
        url: 'https://accounts.spotify.com/api/token',
        form: { code, redirect_uri: redirectUri, grant_type: 'authorization_code' },
        headers: { 'Authorization': `Basic ${authToken}` }
    }

    const { status, data: body } = await axios(authOptions)
    if (status !== 200) { return res.redirect(`/#${querystring.stringify({ error: 'invalid_token' })}`) }
    if (status === 405) { return res.send(status)}
    // valid
    const { access_token: accessToken, refresh_token: refreshToken } = body
    const options = { url: 'https://api.spotify.com/v1/me', headers: { 'Authorization': `Bearer ${accessToken}` } }
    const { data } = await axios(options)
    console.log(data)

    return res.redirect(`/#${querystring.stringify({ accessToken, refreshToken })}`)
}

/**
* @api {get} /auth/refresh_token/:refreshToken Refresh token
* @apiDescription Refresh the token from spotify account
* @apiGroup Auth
* @apiVersion 0.0.1
* @apiParam {String} refreshToken The refresh token to use.
* @apiUse defaultSuccessProperties
* @apiUse defaultErrorProperties
*
* @apiUse defaultErrorExample
*/
async function refreshToken(req, res, next) {
    // requesting access token from refresh token
    const { refreshToken } = req.query
    const authToken = Buffer.from(`${clientId}:${clientSecret}`).toString('base64')
    var authOptions = {
        url: 'https://accounts.spotify.com/api/token',
        headers: { 'Authorization': `Basic ${authToken}` },
        form: { grant_type: 'refresh_token', refresh_token: refreshToken }
    }

    const { status, data: { access_token: accessToken } } = await axios(authOptions)
    if (status !== 200) { return next() }

    res.send({ accessToken })
}
