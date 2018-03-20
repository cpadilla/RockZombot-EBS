const express = require('express')
const controller = require('./controller')
const router = new express.Router()

exports.routes = () => {
    router.get('/:song', controller.getSong)

    return router
}
