/**
 * Defines all the routes for RockZombot-EBS api
 * @author Rúben Gomes <gomesruben21@gmail.com>
 */

/**
 * @apiDefine defaultSuccessProperties
 *
 * @apiSuccess {Boolean} status true when execution is successful, false when something goes wrong
 * @apiSuccess {String} message A message with the error, an empty string when execution is successful
 */

/**
 * @apiDefine defaultErrorProperties
 * @apiError (Error 500) {Boolean} status true when execution is successful, false when something goes wrong
 * @apiError (Error 500) {String} message A message with the error, an empty string when execution is successful
 * @apiError (Error 500) {Array} data An empty array.
 */

/**
 * @apiDefine defaultErrorExample
 *
 * @apiErrorExample {json} Error Response
 *     HTTP/1.1 500 Server error
 *     {
 *         "status": false,
 *         "message": "Something went wrong",
 *         "data": []
 *     }
 *
 */

const express = require('express')
const authentication = require('../authentication/router')
const spotify = require('../api/spotify/router')
const router = new express.Router()

exports.routes = () => {
    router.use('/auth', authentication.routes())
    router.use('/api/spotify', spotify.routes())

    return router
}

