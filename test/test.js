var assert = require("assert");
var cargo = require("../index.js");

describe('Cargo Sync Enum', function () {

    it("should display One", function () {
        assert.equal(1, cargo.sync.CREATEOREXISTS);
    });

    it("should display Two", function () {
        assert.equal(2, cargo.sync.DROPANDCREATE);
    })
});