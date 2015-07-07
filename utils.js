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
        opts['@rid'] = new Orientjs.RID(opts['@rid']);
    }

    if (_.has(opts, 'select')) {
        delete opts.select;
    }

    return opts;
};