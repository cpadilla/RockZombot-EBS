const config = require('../configuration')
const { HttpStatus } = require('../utils/index')

/**
 * @author Rúben Gomes <gomesruben21@gmail.com>
 * @classdesc Defines a MiddlewareHelper class. Responsible layer to provide middleware helpers.
 */
class MiddlewareHelper {
    /**
     * Json invalid middleware helper.
     *
     * @static
     * @param {!Object} err Specifies the error object that express sends if and error occurs.
     * @param {!Object} req Specifies the request object provided by express framework.
     * @param {!Object} res Specifies the response object provided by express framework.
     * @param {!Function} next Specifies the next express middleware function to be called.
     */
    static jsonInvalid(err, req, res, next) {
        if (!err) { return next() }
        return res.status(HttpStatus.BAD_REQUEST).send(MiddlewareHelper.errorReply({ message: `Error parsing json: ${err.message}` }))
    }

    /**
     * Error reply helper.
     *
     * @static
     * @param {!Object} [opts={}] Specifies the options for the tim error reply helper.
     * @param {!Object} [opts.err={}] Specifies the error object.
     * @param {!String} [opts.message=''] Specifies the message to be sent on the response.
     *
     * @returns {Object} An object containing the status with false as value, message and dat properties.
     */
    static errorReply({ err = {}, message = '' } = {}) {
        return { status: false, message: err.message || message, data: [] }
    }

    /**
     * Data reply helper.
     *
     * @static
     * @param {Object} [data=[]] Specifies the data to be sent on the response.
     *
     * @returns {Object} An object containing the status with true as value, message and dat properties.
     */
    static dataReply(data = []) {
        return { status: true, message: '', data }
    }

    /**
     * Reply provider middleware helper.
     * Creates a closure function in a property named as timReply on response object.
     *
     * @see MiddlewareHelper.dataReply
     * @static
     * @param {!Object} req Specifies the request object provided by express framework.
     * @param {!Object} res Specifies the response object provided by express framework.
     * @param {!Function} next Specifies the next middleware function to be called.
     */
    static replyProvider(req, res, next) {
        res.reply = data => res.json(MiddlewareHelper.dataReply(data))
        next()
    }

    /**
     * Log errors middleware helper.
     * - Only logs the error stack if the environment is 'dev' or 'development'.
     * - Proceeds to the next middleware function calling the next function.
     *
     * @static
     * @param {!Object} err Specifies the error object that express sends if and error occurs.
     * @param {!Object} req Specifies the request object provided by express framework.
     * @param {!Object} res Specifies the response object provided by express framework.
     * @param {!Function} next Specifies the next express middleware function to be called.
     */
    static logErrors(err, req, res, next) {
        const env = config.get('ENVIRONMENT')
        if (env === 'dev' || env === 'development') { console.log(err.stack) }
        next(err)
    }

    /**
     * Error handler middleware helper.
     * - Sends backs a json response with the tim error reply object.
     * - Proceeds to the next middleware function calling the next function.
     * @see MiddlewareHelper.errorReply
     *
     * @static
     * @param {!Object} err Specifies the error object that express sends if and error occurs.
     * @param {!Object} req Specifies the request object provided by express framework.
     * @param {!Object} res Specifies the response object provided by express framework.
     * @param {!Function} next Specifies the next express middleware function to be called.
     */
    static errorHandler(err, req, res, next) {
        res.status(HttpStatus.SERVER_ERROR).send(MiddlewareHelper.errorReply({ err }))
        next()
    }

    /**
     * Add Cors Headers middleware helper.
     *
     * @static
     * @param {!Object} req Specifies the request object provided by express framework.
     * @param {!Object} res Specifies the response object provided by express framework.
     * @param {!Function} next Specifies the next express middleware function to be called.
     */
    static addCorsHeaders(req, res, next) {
        if (!config.get('ADD_CORS_HEADERS')) { return next() }

        res.setHeader('Access-Control-Allow-Origin', '*')
        res.setHeader('Access-Control-Allow-Methods', 'POST,GET,DELETE,PUT,OPTIONS')
        res.setHeader('Access-Control-Allow-Headers', 'Host, Origin, Pragma, Referer, User-Agent, Content-Type, Accept, Accept-Encoding, Accept-Language, Cache-Control, Connection, Content-Length, Content-Type, Authorization, X-Requested-With, Access-Control-Request-Headers, Access-Control-Request-Method')
        res.setHeader('Access-Control-Allow-Credentials', 'true')
        res.setHeader('Access-Control-Max-Age', '1728000')

        next()
    }
}

module.exports = exports = MiddlewareHelper
