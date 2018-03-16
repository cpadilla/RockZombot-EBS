/**
 * Defines spotify routes for RockZombot-EBS api example
 * @author Rúben Gomes <gomesruben21@gmail.com>
 */

const express = require('express')
const controller = require('./controller')
const router = new express.Router()

exports.routes = () => {
    router.get('/:song', controller.getSong)

    return router
}
