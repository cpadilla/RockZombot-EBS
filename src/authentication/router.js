/**
 * Defines auth routes for RockZombot-EBS
 * @author Rúben Gomes <gomesruben21@gmail.com>
 */

const express = require('express')
const controller = require('./controller')
const router = new express.Router()

exports.routes = () => {
    router.get('/login', controller.login)
    router.get('/callback', controller.loginCallback)
    router.get('/refresh_token', controller.refreshToken)

    return router
}
