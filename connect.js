/**
 * Author Malindu Warapitiya
 */


/**
 * Orientjs, OrientDB official driver for Nodejs
 * @type {OrientDB|exports|module.exports}
 */
var Orientojs = require('orientjs');

/**
 * Underscore, Functional programming made easy
 * @type {UnderscoreStatic}
 * @private
 */
var _ = require('underscore');

/**
 * Cargo, Error handling class
 * @type {CargoError|exports|module.exports}
 */
var CargoError = require('./error');


/**
 * Cargo, Connection function for orientjs
 * @param opts
 * @returns {*}
 */
module.exports = function (opts) {

    //Validation of the Cargo options objects
    if (_.isString(opts)) {
        return new CargoError("CONNECTION_PROPERTY_EMPTY", 'PARAM_TYPE_INVALID');
    } else if (_.isObject(opts)) {
        propertyCheck(opts);
    }

    //Connect to the Database using Oriento
    var server;
    server = Orientojs({
        host: opts.host,
        port: opts.port,
        username: opts.user,
        password: opts.password
    });

    var db = server.use(opts.database);
    console.info('Using database from Cargo: ' + db.name);

    return db;

};

/**
 * Check the properties of the {options} object
 * @param opts
 */
function propertyCheck(opts) {

    var properties = ['host', 'port', 'user', 'password', 'database'];

    _.each(properties, function (prop, index) {

        if (!opts.hasOwnProperty(prop)) {
            throw new CargoError("CONNECTION_PROPERTY_EMPTY", 'PARAM_TYPE_INVALID');
        }

        if (!_.isEqual(properties[index], 'port') && !_.isString(opts[prop])) {
            throw new CargoError("CONNECTION_PROPERTY_TYPE_INVALID", 'PARAM_TYPE_INVALID');
        }

        if (_.isEqual(properties[index], 'port') && !_.isNumber(opts.port)) {
            throw new CargoError("CONNECTION_PROPERTY_TYPE_INVALID", 'PARAM_TYPE_INVALID');
        }

    });

};