const { MySqlUtils } = require('../../utils')
const Runner = require('../runner')
const { MySqlConnection } = require('../../connections')

/**
 * @author Rúben Gomes <gomesruben21@gmail.com>
 * @classdesc Defines a MySqlRunner class. Responsible layer for the transactions into mysql db.
 * @extends Runner
 */
class MySqlRunner extends Runner {
    /**
     * @constructor
     * @param {!Object} [opts={}] Specifies the options for the mysql runner constructor.
     * @param {!String} [opts.name='mysqlRunner'] Specifies the name to attached to the mysql runner.
     * @param {!Object} [opts.user={}] Specifies the current user.
     * @param {!Object} [opts.user.name] Specifies the name of the user.
     * @param {!Object} [opts.user.pass] Specifies the password of the user.
     * @param {!Object} [opts.user.db] Specifies the database to use.
     * @param {!Object} [opts.user.host] Specifies the host to use.
     * @param {!Object} [opts.connection=MySqlConnection] Specifies the connection to use.
     */
    constructor({ name, user: { name: username, pass, db, host: dbHost } = {}, Connection } = {}) {
        super({ name: name || 'mysqlRunner', connection: Connection || new MySqlConnection({ username, pass, db, dbHost }) })
    }

    /**
     * Executes a transaction to the db.
     * @override
     *
     * @param {!Object} opts Specifies the options for the run execution.
     * @param {!String} opts.sql Specifies the mysql query to be executed.
     * @param {!Object} [opts.param={}] Specifies the params to use in the mysql query.
     * @param {!Number} [opts.attempts=3] Specifies the number of attempts
     *
     * @returns {Object[]} The retrieved data/content from the db based on the mysql query.
     */
    async run({ sql, params, attempts }) {
        const conn = this.connection.getConnection()
        if (!conn) { return }

        const delegate = MySqlUtils.queryWrapper({ connection: conn })
        const content = await super.run({ delegate, sql, params, attempts })
        return content
    }
}

module.exports = exports = MySqlRunner
