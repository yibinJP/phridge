"use strict";

var chai = require("chai"),
    when = require("when"),
    chaiAsPromised = require("chai-as-promised"),
    expect = chai.expect,
    phantomFarm = require("../lib/main.js"),
    Phantom = require("../lib/Phantom.js"),
    slow = require("./helpers/slow.js");

chai.config.includeStack = true;
chai.use(chaiAsPromised);

describe("exitAll()", function () {

    it("should exit cleanly all running phantomjs instances", slow(function () {
        var exitted = [];

        return when.all([
                phantomFarm.create(),
                phantomFarm.create(),
                phantomFarm.create()
            ])
            .then(function (p) {
                p[0].childProcess.on("exit", function () { exitted.push(0); });
                p[1].childProcess.on("exit", function () { exitted.push(1); });
                p[2].childProcess.on("exit", function () { exitted.push(2); });

                return phantomFarm.exitAll();
            })
            .then(function () {
                exitted.sort();
                expect(exitted).to.eql([0, 1, 2]);
            });
    }));

});