const { MySqlRunner } = require('../database')

/**
 * @author Rúben Gomes <gomesruben21@gmail.com>
 * @classdesc Defines a MiddlewareHelper class. Responsible layer to instantiate a db model class.
 * @extends MySqlRunner
 */
class Model extends MySqlRunner {
    /**
     * @constructor
     * @param {!Object} opts Specifies the options of the model.
     * @param {!String} opts.name Specifies the name of the model.
     * @param {!Object} opts.Connection Specifies the connection of the model.
     */
    constructor({ name, Connection }) {
        super({ name, Connection })
    }

    /**
     * Gets a list of the model items.
     * @param {!Object} opts Specifies the options for the find method.
     * @param {!String} opts.sql Specifies the my sql query to be executed.
     * @param {!Object} [opts.params={}] Specifies the params object for the my sql query.
     * @param {!Number} [opts.attempts=1] Specifies the number of attempts to execute the run method if something goes wrong.
     *
     * @throws An Error if the attempts already passed the limit and the execution wasn't successful.
     *
     * @returns {Promise<Object[]>} A promise with the models items as resolved value.
     */
    async find({ sql, params = {}, attempts = 1 }) {
        const items = await this.run({ sql, params, attempts })
        return items
    }

    /**
     * Gets a model item.
     * @param {!Object} opts Specifies the options for the find method.
     * @param {!String} opts.sql Specifies the my sql query to be executed.
     * @param {!Object} [opts.params={}] Specifies the params object for the my sql query.
     * @param {!Number} [opts.attempts=1] Specifies the number of attempts to execute the run method if something goes wrong.
     *
     * @throws An Error if the attempts already passed the limit and the execution wasn't successful.
     *
     * @returns {Promise<Object>} An promise with a model item as resolved value.
     */
    async findOne({ sql, params = {}, attempts = 1 }) {
        const [item] = await this.run({ sql, params, attempts })
        return item
    }

    /**
     * Creates a model item.
     * @param {!Object} opts Specifies the options for the find method.
     * @param {!String} opts.sql Specifies the my sql query to be executed.
     * @param {!Object} opts.params Specifies the params object for the my sql query.
     * @param {!Number} [opts.attempts=1] Specifies the number of attempts to execute the run method if something goes wrong.
     *
     * @throws An Error if the attempts already passed the limit and the execution wasn't successful.
     *
     * @returns {Promise<String>} A promise with an empty array.
     */
    async create({ sql, params, attempts = 1 }) {
        await this.run({ sql, params, attempts })
        return []
    }

    /**
     * Updates a model item.
     * @param {!Object} opts Specifies the options for the find method.
     * @param {!String} opts.sql Specifies the my sql query to be executed.
     * @param {!Object} opts.params Specifies the params object for the my sql query.
     * @param {!Number} [opts.attempts=1] Specifies the number of attempts to execute the run method if something goes wrong.
     *
     * @throws An Error if the attempts already passed the limit and the execution wasn't successful.
     *
     * @returns {Promise<Array>} A promise with an empty array.
     */
    async update({ sql, params, attempts = 1 }) {
        await this.run({ sql, params, attempts })
        return []
    }

    /**
     * Removes a model item.
     * @param {!Object} opts Specifies the options for the find method.
     * @param {!String} opts.sql Specifies the my sql query to be executed.
     * @param {!Object} opts.params Specifies the params object for the my sql query.
     * @param {!Number} [opts.attempts=1] Specifies the number of attempts to execute the run method if something goes wrong.
     *
     * @throws An Error if the attempts already passed the limit and the execution wasn't successful.
     *
     * @returns {Promise<Array>} A promise with an empty array.
     */
    async remove({ sql, params, attempts = 1 }) {
        await this.run({ sql, params, attempts })
        return []
    }
}

module.exports = exports = Model
