# Cargo

Cargo is an API for [OrientDB] operations build on top of [Express].

Cargo support few amount of operations including BREAD at the moment. Cargo is build on top of [Orientjs]

  - Browse
  - Read
  - Edit
  - Add
  - Delete
  - Count
  - Count
  - Query
  - Map

## Usage

#### Installation
Install via npm.

```sh
$ npm install cargojs
```

### Configuring the client.
```js
var cargo = require('cargojs');

var configuration = {
    host: 'localhost',
    port: 2424,
    user: 'root',
    password: 'root',
    database: 'sample'
};

app.use(Cargo.express(configuration, {

    define: function (db, models) {
        models.User = db.define("User", {});
    }
}));
```

###Use Cargo operations

####+ Browse | Return an array of records
```js
exports.browseUsers = function(req, res) {
    req.models.user.browse({
            'status': 'active'
        }).then(function(users)) {
            console.log(users);
        },
        function(error) {
            console.error(error)
        });
};
```

####+ READ | Return a single record
```js
exports.readUser = function(req, res) {
    req.models.user.read({
            'status': 'active'
        }).then(function(user)) {
            console.log(user);
        },
        function(error) {
            console.error(error)
        });
};
```

####+ Edit | Update reocrds
```js
exports.editUser = function(req, res) {
    req.models.user.set({
            'name': 'Ryan'
        }).edit({
            'status': 'active'
        }).then(function(user)) {
            console.log(user);
        },
        function(error) {
            console.error(error)
        });
};
```

####+ Add | Add a reocrd
```js
exports.addUser = function(req, res) {
    req.models.user.add({
            'name': 'Ryan',
            'lastName': 'Cooper',
            'status': 'active'
        }).then(function(user)) {
            console.log(user);
        },
        function(error) {
            console.error(error);
        });
};
```

####+ Delete | Delete a reocrd
```js
exports.deleteUser = function(req, res) {
    req.models.user.delete({
            'name': 'Ryan'
        }).then(function(user)) {
            console.log(user);
        },
        function(error) {
            console.error(error);
        });
};
```

####+ Count | Count reocrds in class
```js
exports.countUsers = function(req, res) {
    req.models.user.count().then(function(total)) {
            console.log(total);
        },
        function(error) {
            console.error(error);
        });
};
```

####+ Map | Add link to record
```js
exports.linkUsers = function(req, res) {

    var client = req.cargo.RID('#1:5');
    var link = req.cargo.RID('#2:3');

    req.models.user.addLink(client).map({
            'project': link
        }).then(function(updatedCount)) {
            console.log(updatedCount);
        },
        function(error) {
            console.error(error);
        });
};
```

####+ Query | Custom query
```js
exports.queryUsers = function(req, res) {

    var sql = 'SELECT * FROM User'

    req.models.user.query(sql).then(function(result)) {
            console.log(result);
        },
        function(error) {
            console.error(error);
        });
};
```

### Version
1.0.0


### Development

Want to contribute? Great! Pull-requests are welcome

### Todo's

* Remove [Orientjs] and be standalone.
* Add more operations like Create classes | Add properties etc...
* Custom operations.

License
----
[MIT]


[OrientDB]:http://orientdb.com/
[Express]:http://expressjs.com/
[Orientjs]:https://github.com/orientechnologies/orientjs
[MIT]:https://github.com/warapitiya/Cargo/blob/master/LICENSE