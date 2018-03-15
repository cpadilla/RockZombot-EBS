const Connection = require('../connection')

/**
 * @author Rúben Gomes <gomesruben21@gmail.com>
 * @classdesc Defines a MySqlConnection class. Responsible layer for the mysql connection into db.
 * @extends Connection
 */
class MySqlConnection extends Connection {
    /**
     * @constructor
     * @param {!Object} opts Specifies the options for the connection instance.
     * @param {?String} [opts.name='mysqlConnection'] Specifies the name of the connection.
     * @param {!Object} [opts.user] Specifies the user to use in connection.
     * @param {?String} [opts.pass] Specifies the password to use in the connection.
     * @param {?String} [opts.db] Specifies the database name to use in the connection.
     * @param {?String} [opts.dbHost] Specifies the host to use for the connection.
     * @param {!Boolean} [opts.insecureAuth=true] Specifies the host to use for the connection.
     */
    constructor({ name, username, pass, db, dbHost, insecureAuth }) {
        super({ name: name || 'mysqlConnection', username, pass, db, dbHost, insecureAuth })
    }

    /**
     * Gets the mysql connection.
     *
     * @returns {Connection} The mysql connection.
     */
    getConnection() {
        return this.create()
    }
}

module.exports = exports = MySqlConnection
