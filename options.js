/**
 * Author Malindu Warapitiya
 */

var Orientjs = require('orientjs');

exports.RID = function (rid) {
    return new Orientjs.RID(rid);
};