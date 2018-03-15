const _ = require('lodash')
const uuid = require('uuid')

/**
 * @author Rúben Gomes <gomesruben21@gmail.com>
 * @classdesc Defines a GenericUtils static class. Responsible layer to provide generic utility functions.
 */
class GenericUtils {
    /**
     * Gets a new uuid.
     * @static
     *
     * @returns {String} The new uuid.
     */
    static getNewId() {
        return uuid.v4().toUpperCase()
    }

    /**
     * Check if the value is null or undefined.
     * @static
     *
     * @param {!Object} opts Specifies the options object.
     * @param {!Object} opts.value Specifies the value to be checked.
     *
     * @returns {Boolean} True if is null or undefined, else returns false.
     */
    static isNil({ value } = {}) {
        return _.isNil(value)
    }

    /**
     * Check if the value is empty.
     * @static
     *
     * @param {!Object} opts Specifies the options object.
     * @param {!Object} opts.value Specifies the value to be checked.
     *
     * @returns {Boolean} True if is empty, else returns false.
     */
    static isEmpty({ value } = {}) {
        return _.isEmpty(value)
    }
}

module.exports = exports = GenericUtils
