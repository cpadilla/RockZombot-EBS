const SqlString = require('mysql/lib/protocol/SqlString')

/**
 * @author Rúben Gomes <gomesruben21@gmail.com>
 * @classdesc Defines a MySqlUtils static class. Responsible layer to provide mysql utility functions.
 */
class MySqlUtils {
    /**
     * Utility function to parsed named parameters on mysql queries.
     * @static
     *
     * @param {String} query Specifies the query to be executed.
     * @param {Object} params Specifies the params that will be used on the query.
     *
     * @returns {String} The query with the named parameters parsed.
     */
    static namedParametersEscape(query, params) {
        if (!params) { return query }
        const regexExpressions = [
            { regex: /::(\w+)/g, esc: SqlString.escapeId },
            { regex: /:(\w+)/g, esc: SqlString.escape }
        ]
        regexExpressions.forEach(opt => {
            query = query.replace(opt.regex, (text, key) => {
                if (params.hasOwnProperty(key)) { return opt.esc(params[key]) }
                return text
            })
        })
        return query
    }

    /**
     * Utility function to wrap the connection.query mysql function and returns a promise with the resolved rows value or error logic instead invoking the connection.query function.
     * @static
     *
     * @param {!Object} opts Specifies the options for the query wrapper
     * @param {!Object} connection Specifies the mysql connection.
     *
     * @returns {Function} An wrapper function that will returns a promise with the resolved rows values or a rejected error logic invoking the connection.query function.
     */
    static queryWrapper({ connection }) {
        return (sql, params) => {
            return new Promise((resolve, reject) => {
                connection.query(sql, params, (err, rows) => {
                    if (err) { return reject(err) }
                    resolve(rows)
                })
            })
        }
    }
}

module.exports = exports = MySqlUtils
