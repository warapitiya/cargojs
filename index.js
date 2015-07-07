/**
 * Author Malindu Warapitiya
 */

    
var CargoConnect = require('./connect'),
    CargoBread = require('./operations'),
    CargoOptions = require('./options'),
    _models = {},
    _options = {};

exports.express = function (config, opts) {
    opts = opts || {};

    //Connect to the database
    var db = CargoConnect(config);

    _models = CargoBread(db, opts);

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