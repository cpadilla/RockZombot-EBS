const locales = require('../locales')

/**
 * @author Rúben Gomes <gomesruben21@gmail.com>
 * @classdesc Defines a Runner class. Responsible layer for the transactions into db.
 */
class Runner {
    /**
     * @constructor
     * @param {!Object} opts Specifies the options for the runner constructor.
     * @param {!String} [opts.name='runner'] Specifies the name to attached to the runner.
     * @param {!Object} opts.user Specifies the current user.
     * @param {!Object} [opts.logger=Logger] Specifies the logger to use.
     * @param {!Object} opts.connection Specifies the connection to use.
     */
    constructor({ name, connection }) {
        this.name = name || 'runner'
        this.connection = connection
        this.locales = locales.get() // can be extendable if we have a user with the language attached and passed as parameter
    }

    /**
     * Runs a request for the database.
     * @param {!Object} opts Specifies the options for the run.
     * @param {!Function} opts.delegate Specifies the delegate to be fired.
     * @param {!String} opts.sql Specifies the my sql query to be executed.
     * @param {!Object} [opts.params={}] Specifies the params object for the my sql query.
     * @param {!Number} [opts.attempts=3] Specifies the number of attempts to execute the run method if something goes wrong.
     *
     * @throws An Error if the attempts already passed the limit and the execution wasn't successful or other non expectable error.
     */
    async run({ delegate, sql, params = {}, attempts = 3 }) {
        try {
            const data = await delegate(sql, params)
            this.connection.close()
            return data
        } catch (err) {
            if (err.message === this.locales.theSocketIsClosed) {
                if (--attempts > 0) {
                    await this.run({ delegate, sql, params, attempts })
                } else {
                    this.connection.close()
                    throw err
                }
            } else {
                this.connection.close()
                throw err
            }
        }
    }
}

module.exports = exports = Runner
