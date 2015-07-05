/**
 * Author Malindu Warapitiya
 */


var _ = require('underscore'),
    cargoUtils = require('./utils'),
    _models = {},
    _db = {};

/**
 * Create the common operations and return the object
 * @param db
 * @param opts
 * @returns {{}}
 */
module.exports = function (db, opts) {

    if (!_.isFunction(opts.define)) {
        throw new CargoError("DEFINE_PROPERTY_EMPTY", 'PARAM_TYPE_INVALID');
    }

    _db.define = function (schema, properties) {
        return new Operations(schema, db);
    };

    opts.define(_db, _models);

    return _models

};


/**
 * Operation Class
 * @param schema
 * @param db
 * @constructor
 */
var Operations = function (schema, db) {
    this.klass = schema;
    this.db = db;
    this.selectClause = '';
    this.setClause = '';
    this.list = {};
    this.limitCount = null;
};


/**
 * Select method chain
 * @param selects
 * @returns {Operations}
 */
Operations.prototype.select = function (selects) {
    this.selectClause = selects;
    return this;
};


/**
 * Set method chain
 * @param set
 * @returns {Operations}
 */
Operations.prototype.set = function (set) {
    this.setClause = set;
    return this;
};

/**
 * Set the limit amount
 * @param limit
 * @returns {Operations}
 */
Operations.prototype.limit = function (limit) {
    this.limitCount = limit;
    return this;
};


/**
 * Add list method chain
 * @param list
 * @returns {Operations}
 */
Operations.prototype.addList = function (list) {
    this.addList = list;
    return this;
};


/**
 * Browse operation
 * @param opts
 * @returns {*}
 */
Operations.prototype.browse = function (opts) {

    if (!_.isEmpty(opts) && !_.isEmpty(this.selectClause) && !_.isNull(this.limitCount)) {

        return this.db.select(this.selectClause).from(this.klass).where(opts).limit(this.limitCount).fetch({'*': -1}).all();

    } else if (!_.isNull(this.limitCount)) {

        return this.db.select().from(this.klass).fetch({'*': -1}).limit(this.limitCount).all();
    }

    if (_.isEmpty(opts) && _.isEmpty(this.selectClause)) {

        return this.db.select().from(this.klass).fetch({'*': -1}).all();

    } else if (!_.isEmpty(opts) && _.isEmpty(this.selectClause)) {

        return this.db.select().from(this.klass).where(opts).fetch({'*': -1}).all();

    } else if (_.isEmpty(opts) && !_.isEmpty(this.selectClause)) {

        return this.db.select(this.selectClause).from(this.klass).fetch({'*': -1}).all();

    } else if (!_.isEmpty(opts) && !_.isEmpty(this.selectClause)) {

        return this.db.select(this.selectClause).from(this.klass).where(opts).fetch({'*': -1}).all();
    }

};


/**
 * Reads Operation
 * @param opts
 * @returns {*}
 */
Operations.prototype.read = function (opts) {

    if (_.isEmpty(this.selectClause)) {
        return this.db.select('*').from(this.klass).where(opts).fetch({'*': -1}).one();
    } else {
        return this.db.select(this.selectClause).from(this.klass).where(opts).fetch({'*': -1}).one();
    }

};


/**
 * Edit operation
 * @param opts
 * @returns {*}
 */
Operations.prototype.edit = function (opts) {

    opts = cargoUtils.resolve(opts);
    return this.db.update(this.klass).set(this.setClause).where(opts).scalar();

};


/**
 * Map operation
 * @param opts
 * @returns {*}
 */
Operations.prototype.map = function (opts) {

    var pairsArray = _.pairs(opts),
        list = '';

    _.each(pairsArray, function (prop) {
        list += prop[0] + ' = ' + prop[1];
    });

    return this.db.query('UPDATE ' + this.addList + ' ADD ' + list);

};


/**
 * Add operation
 * @param opts
 * @returns {*}
 */
Operations.prototype.add = function (opts) {

    opts = cargoUtils.resolve(opts);
    return this.db.insert().into(this.klass).set(opts).one();

};

/**
 * Delete operation
 * @param opts
 * @returns {*}
 */
Operations.prototype.delete = function (opts) {

    opts = cargoUtils.resolve(opts);

    return this.db.delete().from(this.klass).where(opts).limit(1).scalar();

};


/**
 * Count Operation
 * @param opts
 * @returns {*}
 */
Operations.prototype.count = function (opts) {

    opts = cargoUtils.resolve(opts);
    return this.db.select('count(*)').from(this.klass).where(opts).scalar();

};


/**
 * Query operation
 * @param opts
 * @returns {*}
 */
Operations.prototype.query = function (string) {

    return this.db.query(string);

};