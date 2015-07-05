/**
 * Author Malindu Warapitiya
 */

var Orientjs = require('orientjs'),
    _ = require('underscore');

exports.resolve = function (opts) {

    if (_.isEmpty(opts)) {
        return {};
    }

    if (_.has(opts, '@rid')) {
        opts['@rid'] = new Oriento.RID(opts['@rid']);
    }

    if (_.has(opts, 'select')) {
        delete opts.select;

        return opts;
    }
};

exports.selects = function (opts) {

    if (_.has(opts, 'select')) {

        var _select = '';

        if (_.isArray(opts.select)) {

            _.each(opts.select, function (prop) {
                _select = _select + prop + ',';
            });

            _select = _select.substring(0, _select.length - 1);

            return _select.trim();

        } else if (_.isString(opts.select)) {
            return opts.select.trim();
        }
    }
    return '';
};