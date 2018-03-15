/**
 * Defines auth controller
 * @author Rúben Gomes <gomesruben21@gmail.com>
 */

// TODO: refactor
const axios = require('axios')
const querystring = require('querystring');
const { StringUtils } = require('../utils')
const config = require('../configuration')
const stateKey = config.get('SPOTIFY_STATE_KEY')
const client_id = config.get('SPOTIFY_CLIENT_ID')
const client_secret = config.get('SPOTIFY_CLIENT_SECRET')
const redirect_uri = config.get('SPOTIFY_REDIRECT_URI')

// your application requests authorization
const scope = 'user-read-private user-read-email playlist-read-private playlist-read-collaborative playlist-modify-public playlist-modify-private user-library-read user-top-read user-modify-playback-state user-read-currently-playing';


module.exports = { login, loginCallback, refreshToken }

/**
* @api {get} /auth/login Logins into spotify account 
* @apiDescription Get all versions for a specific versions.
* @apiGroup Versions
* @apiVersion 0.0.1
*
* @apiUse defaultSuccessProperties
* @apiUse defaultErrorProperties
*
* @apiUse defaultErrorExample
*/
function login(req, res, next) {
    const state = StringUtils.generateRandomString(16);
    res.cookie(stateKey, state);
    const query = querystring.stringify({ response_type: 'code', client_id: clientId, scope, redirect_uri: redirectUri, state })
    res.redirect(`https://accounts.spotify.com/authorize?${query}`)
}

/**
* @api {get} /auth/callback Logins into spotify account 
* @apiDescription Get all versions for a specific versions.
* @apiGroup Versions
* @apiVersion 0.0.1
*
* @apiUse defaultSuccessProperties
* @apiUse defaultErrorProperties
*
* @apiUse defaultErrorExample
*/
function loginCallback(req, res, next) {

    // your application requests refresh and access tokens
    // after checking the state parameter
    const { cookies = {}, query: { code = null, state = null } } = req
    const storedState = cookies[stateKey] || null
  
    if (state === null || state !== storedState) { return res.redirect(`/#${querystring.stringify({error: 'state_mismatch'})}`) }
    
    res.clearCookie(stateKey);
    var authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    form: {
        code: code,
        redirect_uri: redirect_uri,
        grant_type: 'authorization_code'
    },
    headers: {
        'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
    },
    json: true
    };
  
      request.post(authOptions, function(error, response, body) {
        if (!error && response.statusCode === 200) {
  
          var access_token = body.access_token,
              refresh_token = body.refresh_token;
  
          var options = {
            url: 'https://api.spotify.com/v1/me',
            headers: { 'Authorization': 'Bearer ' + access_token },
            json: true
          };
  
          // use the access token to access the Spotify Web API
          request.get(options, function(error, response, body) {
            console.log(body);
          });
  
          // we can also pass the token to the browser to make requests from there
          res.redirect('/#' +
            querystring.stringify({
              access_token: access_token,
              refresh_token: refresh_token
            }));
        } else {
          res.redirect('/#' +
            querystring.stringify({
              error: 'invalid_token'
            }));
        }
      });
    }
  });

 function refreshToken(req, res, next) {

    // requesting access token from refresh token
    var refresh_token = req.query.refresh_token;
    var authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      headers: { 'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64')) },
      form: {
        grant_type: 'refresh_token',
        refresh_token: refresh_token
      },
      json: true
    };
  
    request.post(authOptions, function(error, response, body) {
      if (!error && response.statusCode === 200) {
        var access_token = body.access_token;
        res.send({
          'access_token': access_token
        });
      }
    });
  });
