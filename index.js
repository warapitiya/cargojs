/**
 * Author Malindu Warapitiya
 */


var CargoConnect = require('./connect');
var CargoFunctions = require('./operations');
var CargoOptions = require('./options');
var _models = {};
var _options = {};

exports.express = function (config, opts) {
    opts = opts || {};

    //Connect to the database
    var db = CargoConnect(config);

    _models = CargoFunctions(db, opts);

    _options = CargoOptions;

    return function CargoExpressMiddleware(req, res, next) {

        req.models = _models;
        req.cargo = _options;

        if (next === undefined && typeof res === 'function') {
            next = res;
        }

        return next();
    }
};


/**
 * Database bootstrap method
 * @type {{CREATEOREXISTS: number, DROPANDCREATE: number}}
 */
exports.sync = {
    CREATEOREXISTS: 1,
    DROPANDCREATE: 2
};

/**
 * A list of orientdb data types, indexed by their type id.
 * @type {Object}
 */
exports.types = {
    "BOOLEAN": {index: 0, type: 'Boolean'},
    "INTEGER": {index: 1, type: 'Integer'},
    "SHORT": {index: 2, type: 'Short'},
    "LONG": {index: 3, type: 'Long'},
    "FLOAT": {index: 4, type: 'Float'},
    "DOUBLE": {index: 5, type: 'Double'},
    "DATETIME": {index: 6, type: 'Datetime'},
    "STRING": {index: 7, type: 'String'},
    "BINARY": {index: 8, type: 'Binary'},
    "EMBEDDED": {index: 9, type: 'Embedded'},
    "EMBEDDEDLIST": {index: 10, type: 'EmbeddedList'},
    "EMBEDDEDSET": {index: 11, type: 'EmbeddedSet'},
    "EMBEDDEDMAP": {index: 12, type: 'EmbeddedMap'},
    "LINK": {index: 13, type: 'Link'},
    "LINKLIST": {index: 14, type: 'LinkList'},
    "LINKSET": {index: 15, type: 'LinkSet'},
    "LINKMAP": {index: 16, type: 'LinkMap'},
    "BYTE": {index: 17, type: 'Byte'},
    "TRANSIENT": {index: 18, type: 'Transient'},
    "DATE": {index: 19, type: 'Date'},
    "CUSTOM": {index: 20, type: 'Custom'},
    "DECIMAL": {index: 21, type: 'Decimal'},
    "LINKBAG": {index: 22, type: 'LinkBag'},
    "ANY": {index: 23, type: 'Any'}
};