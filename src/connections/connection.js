const mysql = require('mysql')
const config = require('../configuration')
const { user, password, database, host } = config.get('CLIENT_DB')
const { MySqlUtils } = require('../utils/index')

/**
 * @author Rúben Gomes <gomesruben21@gmail.com>
 * @classdesc Defines a Connection class. Responsible layer for the connection into db.
 */
class Connection {
    /**
     * @constructor
     * @param {!Object} opts Specifies the options for the connection instance.
     * @param {?String} [opts.name] Specifies the name of the connection.
     * @param {!Object} [opts.user] Specifies the user to use in connection.
     * @param {?String} [opts.pass] Specifies the password to use in the connection.
     * @param {?String} [opts.db] Specifies the database name to use in the connection.
     * @param {?String} [opts.dbHost] Specifies the host to use for the connection.
     * @param {!Boolean} [opts.insecureAuth=true] Specifies the host to use for the connection.
     */
    constructor({ name, username = user, pass = password, db = database, dbHost = host, insecureAuth = true }) {
        this.name = name || 'connection'
        this.user = username
        this.password = pass
        this.database = db
        this.host = dbHost
        this.insecureAuth = insecureAuth
        this.connection = {}
    }

    /**
     * Creates a mysql connection instance.
     *
     * @returns {Connection} The mysql connection
     */
    create() {
        this.connection = mysql.createConnection({
            host: this.host,
            user: this.user,
            password: this.password,
            database: this.database,
            insecureAuth: this.insecureAuth
        })

        this.connection.config.queryFormat = MySqlUtils.namedParametersEscape
        this.connect()

        return this.connection
    }

    /**
     * Connects the mysql connection to the db.
     */
    connect() {
        this.connection.connect()
        this.connection.on('error', err => {
            if (err.code === 'PROTOCOL_CONNECTION_LOST') { this.close() }
        })
    }

    /**
     * Closes the connection.
     */
    close() {
        this.connection.end()
    }
}

module.exports = exports = Connection
