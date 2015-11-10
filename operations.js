/**
 * Author Malindu Warapitiya
 */

/* global require, module */


var _ = require('underscore');
var cargoUtils = require('./utils');
var CargoError = require('./error');
var async = require('async');
var Q = require('q');
var inherits = require('util').inherits;
var _models = {};
var _db = {};
var klasses = [];


/**
 * Create the common operations and return the object
 * @param db
 * @param opts
 * @returns {{}}
 */
module.exports = function (db, opts) {

    var d = Q.defer();

    /**
     * Check options object hasProperty call DEFINE
     */
    if (!_.has(opts, "define")) {
        throw new CargoError("DEFINE_PROPERTY_EMPTY", 'PARAM_TYPE_INVALID');
    }


    /**
     * Check options object's DEFINE property is a function
     */
    if (!_.isFunction(opts.define)) {
        throw new CargoError("DEFINE_PROPERTY_EMPTY", 'PARAM_TYPE_INVALID');
    }


    /**
     * Check the sync options exists
     */
    if (_.has(opts, "sync")) {

        async.series({
                collection: function (callback) {

                    db.class.list()
                        .then(function (classes) {

                            _.each(classes, function (item) {
                                klasses.push(item.name);
                            });

                            callback(null, classes);
                        });
                }
            },
            function (err) {

                //Async completed

                if (err) {
                    CargoError("CONNECTION_ERROR", err);
                }


                /**
                 * Assign all the operations to the "_db" object
                 * @param schema
                 * @param properties
                 * @returns {Operations}
                 */
                _db.define = function (schema, properties) {

                    if (_.has(opts, "sync")) {
                        new bootstrap(db, opts.sync, schema, properties);
                    }

                    return new Operations(schema, db);
                };

                /**
                 * Main DEFINE function execution
                 * This is where really operations get assigns
                 */
                opts.define(_db, _models);


                /**
                 * Sub Property record
                 */
                var record = new Extras(db);

                /**
                 * Returns the models with the operations
                 */

                d.resolve({
                    models: _models,
                    record: record
                });

            });

    } else {

        /**
         * Assign all the operations to the "_db" object
         * @param schema
         * @param properties
         * @returns {Operations}
         */
        _db.define = function (schema, properties) {

            return new Operations(schema, db);
        }

        /**
         * Main DEFINE function execution
         * This is where really operations get assigns
         */
        opts.define(_db, _models);


        /**
         * Sub Property record
         */
        var record = new Extras(db);

        d.resolve({
            models: _models,
            record: record
        });

    }

    return d.promise;

}


/**
 * Operation Class
 * @param schema
 * @param db
 * @constructor
 */
var Operations = function (schema, db) {
    this.originalKlass = schema;
    this.klass = schema;
    this.db = db;
    this.selectClause = '';
    this.setClause = '';
    this.list = {};
    this.mapString = null;
    this.limitCount = null;
    this.orderString = null;

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
 * From method chain
 * @param from
 * @returns {Operations}
 */
Operations.prototype.from = function (from) {
    this.klass = from;
    return this;
};


/**
 * Clear memory values
 * @param from
 * @returns {Operations}
 */
Operations.prototype.flush = function () {
    this.klass = _.clone(this.originalKlass);
    this.selectClause = '';
    this.setClause = '';
    this.list = {};
    this.mapString = null;
    this.limitCount = null;
    this.orderString = null;
    return this;
};


/**
 * Clear memory values
 * @param from
 * @returns {Operations}
 */
Operations.prototype.create = function () {
    return new Operations(this.originalKlass, this.db);
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
 * @param record
 * @returns {Operations}
 */
Operations.prototype.addList = function (record) {
    this.mapString = 'UPDATE ' + record + ' ADD ';
    return this;
};

/**
 * Remove list method chain
 * @param record
 * @returns {Operations}
 */
Operations.prototype.removeList = function (record) {
    this.mapString = 'UPDATE ' + record + ' REMOVE ';
    return this;
};

/**
 * Remove list method chain
 * @param record
 * @returns {Operations}
 */
Operations.prototype.order = function (order) {
    this.orderString = order;
    return this;
};

/**
 * Browse operation
 * @param opts
 * @returns {*}
 */
Operations.prototype.browse = function (opts) {

    opts = typeof opts !== 'undefined' ? opts : {};

    var fetch = typeof opts._fetch !== 'undefined' ? opts._fetch : -1;

    opts = removeProperty(opts, '_fetch');

    if (!_.isEmpty(opts) && !_.isEmpty(this.selectClause) && !_.isNull(this.limitCount)) {

        return this.db.select(this.selectClause).from(this.klass).where(opts).limit(this.limitCount).fetch({'*': fetch}).all();

    } else if (!_.isNull(this.limitCount)) {

        if (_.isNull(this.selectClause)) {
            return this.db.select().from(this.klass).fetch({'*': fetch}).limit(this.limitCount).all();
        } else {

            if (!_.isNull(this.orderString)) {
                return this.db.select(this.selectClause).from(this.klass).fetch({'*': fetch}).limit(this.limitCount).order(this.orderString).all();
            }

            return this.db.select(this.selectClause).from(this.klass).fetch({'*': fetch}).limit(this.limitCount).all();
        }

    }

    if (_.isEmpty(opts) && _.isEmpty(this.selectClause)) {

        return this.db.select().from(this.klass).fetch({'*': fetch}).all();

    } else if (!_.isEmpty(opts) && _.isEmpty(this.selectClause)) {

        return this.db.select().from(this.klass).where(opts).fetch({'*': fetch}).all();

    } else if (_.isEmpty(opts) && !_.isEmpty(this.selectClause)) {

        return this.db.select(this.selectClause).from(this.klass).fetch({'*': fetch}).all();

    } else if (!_.isEmpty(opts) && !_.isEmpty(this.selectClause)) {

        return this.db.select(this.selectClause).from(this.klass).where(opts).fetch({'*': fetch}).all();
    }

};


/**
 * Reads Operation
 * @param opts
 * @returns {*}
 */
Operations.prototype.read = function (opts) {

    opts = typeof opts !== 'undefined' ? opts : {};

    var fetch = typeof opts._fetch !== 'undefined' ? opts._fetch : -1;

    opts = removeProperty(opts, '_fetch');

    if (_.isEmpty(this.selectClause)) {
        return this.db.select('*').from(this.klass).where(opts).fetch({'*': fetch}).one();
    } else {
        return this.db.select(this.selectClause).from(this.klass).where(opts).fetch({'*': fetch}).one();
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

    return this.db.query(this.mapString + list);

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
 * Delete single record operation
 * @param opts
 * @returns {*}
 */
Operations.prototype.delete = function (opts) {

    opts = cargoUtils.resolve(opts);

    return this.db.delete().from(this.klass).where(opts).limit(1).scalar();

};


/**
 * Delete all records operation
 * @param opts
 * @returns {*}
 */
Operations.prototype.deleteAll = function (opts) {

    opts = cargoUtils.resolve(opts);

    return this.db.delete().from(this.klass).where(opts).all();

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
 * @param string
 * @returns {*}
 */
Operations.prototype.query = function (string) {

    if (_.isString(string)) {
        return this.db.query(string);
    } else {
        throw new CargoError("QUERY_ERROR", 'PARAM_TYPE_INVALID');
    }

};


/**
 * Bootstrap function
 * @param database
 * @param sync
 * @param klass
 * @param properties
 */
function bootstrap(database, sync, klass, properties) {

    /**
     * CREATEOREXISTS
     */
    if (_.isEqual(1, sync)) {

        if (!_.contains(klasses, klass)) {

            async.series({

                    /**
                     * Creates the class in database
                     * @param callback
                     */
                    classCreate: function (callback) {

                        database.class.create(klass)
                            .then(function (value) {
                                console.log('Created class:', value.name);

                                if (!_.isEmpty(properties)) {

                                    var props = [];

                                    _.each(_.pairs(properties), function (item) {

                                        props.push({
                                            name: item[0],
                                            type: item[1].type
                                        });

                                    });

                                    value.property.create(props).then(function () {
                                        console.log('Properties created:', props);
                                        callback(null, true);
                                    }, function (error) {
                                        callback(error);
                                    });

                                }
                            });

                    }
                },
                function (err, results) {
                    if (err) {
                        CargoError("CONNECTION_ERROR", err);
                    }

                    return true;
                });

        } else {
            console.log('Existing class:', klass);
        }


    } else if (_.isEmpty(2, sync)) {

        async.series({

                /**
                 * Drop a class in database
                 * @param callback
                 */
                classDrop: function (callback) {

                    database.class.drop(klass)
                        .then(function (value) {
                            callback(null, true);
                        }, function (error) {
                            callback(error);
                        });
                },

                /**
                 * Create a class in database
                 * @param callback
                 */
                classCreate: function (callback) {

                    database.class.create(klass)
                        .then(function () {

                            if (!_.isEmpty(properties)) {

                                var props = [];

                                _.each(_.pairs(properties), function (item) {

                                    props.push({
                                        name: item[0],
                                        type: item[1].type
                                    });

                                });

                                value.property.create(props).then(function () {
                                    console.log('Property created.');
                                    callback(null, true);
                                }, function (error) {
                                    callback(error);
                                });

                            }

                        });

                }
            },
            function (err, results) {
                if (err) {
                    CargoError("CONNECTION_ERROR", err);
                }

                if (results.classDrop && results.classCreate) {
                    console.log('Dropped and Created :', klass);
                }

                return true;
            });
    }

}

/**
 * Extras Functions
 * @param db
 * @constructor
 */
var Extras = function (db) {

    this.db = db;
    this.id = "";
}


/**
 * Set RID
 * @param rid
 * @returns {Extras}
 * @constructor
 */
Extras.prototype.RID = function (rid) {
    this.id = rid;
    return this;
};


/**
 * General get from RID
 * @param opts
 * @returns {*}
 */
Extras.prototype.get = function (rid) {

    if (_.isString(rid)) {
        return this.db.record.get(rid);
    } else {
        throw new CargoError("UNDEFINE_PROPERTY_TYPE", 'TYPE_ERROR');
    }
};


/**
 * General delete from RID
 * @param opts
 * @returns {*}
 */
Extras.prototype.delete = function (rid) {

    if (_.isString(rid)) {
        return this.db.record.delete(rid);
    } else {
        throw new CargoError("UNDEFINE_PROPERTY_TYPE", 'TYPE_ERROR');
    }
};


/**
 * General Update from RID
 * @param opts
 * @returns {*}
 */
Extras.prototype.update = function (opts) {

    opts = cargoUtils.resolve(opts);
    return this.db.update(this.id).set(opts).one();

};


/**
 * Remove Fatch plan property
 * @param opts
 */
function removeProperty(opts, prop) {

    if (_.has(opts, prop)) {
        delete opts[prop]
    }

    return opts;
}