const _ = require('lodash')

/**
 * @author Rúben Gomes <gomesruben21@gmail.com>
 * @classdesc Defines a StringUtils static class. Responsible layer to provide string utility functions.
 */
class StringUtils {
    /**
     * Check if the value is a valid string.
     * @static
     *
     * @param {!Object} opts Specifies the options object.
     * @param {!any} [opts.value] Specifies the value to be checked.
     *
     * @returns {Boolean} True if is a valid string, else returns false.
     */
    static isValidString({ value } = {}) {
        return !_.isNil(value) && _.isString(value) && !_.isEmpty(value)
    }

    /**
     * Gets the default string value if the current value isn't a valid string.
     * @static
     *
     * @param {!Object} opts Specifies the options object.
     * @param {!any} [opts.value] Specifies the value to be checked.
     * @param {!String} [opts.defaultValue='0'] Specifies the default value.
     *
     * @returns {String} The default string value or the current value if the validation was passed.
     */
    static getDefaultString({ value, defaultValue = '0' } = {}) {
        return StringUtils.isValidString({ value }) ? value : defaultValue
    }

    /**
     * Generates a random string containing numbers and letters
     *
     * @static
     * @param  {number} length The length of the string
     * @return {string} The generated string
     */
    static generateRandomString(length) {
        var text = ''
        var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    
        for (var i = 0; i < length; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length))
        }
        return text
    }

    static encodeString(str) {
        if(str.indexOf(' ') >= 0) { return song.replace(/ /g,"%20") }
        return str
    }
}

module.exports = exports = StringUtils
