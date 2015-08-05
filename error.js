/**
 * Author Malindu Warapitiya
 */

var codes;

codes = {
    QUERY_ERROR: 1,
    NOT_FOUND: 2,
    NOT_DEFINED: 3,
    NO_SUPPORT: 4,
    MISSING_CALLBACK: 5,
    PARAM_MISMATCH: 6,
    PARAM_TYPE_INVALID: 7,
    CONNECTION_LOST: 10,
    CONNECTION_ERROR: 11,
    TYPE_ERROR: 12,
    BAD_MODEL: 15
};

/**
 * Cargo Error Handling function
 * @param message
 * @param code
 * @param extras
 * @constructor
 */
function CargoError(message, code, extras) {
    Error.call(this);
    Error.captureStackTrace(this, this.constructor);

    this.message = message;
    if (code) {
        this.code = codes[code];
        this.literalCode = code;
        if (!this.code) {
            throw new Error("Invalid error code: " + code);
        }
    }
    if (extras) {
        for (var k in extras) {
            this[k] = extras[k];
        }
    }
}

CargoError.prototype = Object.create(Error.prototype);
CargoError.prototype.constructor = CargoError;
CargoError.prototype.name = 'CargoError';
CargoError.prototype.toString = function () {
    return '[CargoError ' + this.literalCode + ': ' + this.message + ']';
};

CargoError.codes = codes;

module.exports = CargoError;