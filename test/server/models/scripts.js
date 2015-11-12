var assert = require('assert');
var Script = require('../../../server/models/Scripts');

describe('Scripts Model Tests', function() {
    var _scriptId;

    beforeEach(function(done) {
        Script.addScript('code', 'testScript').then(function(result) {
            _scriptId = result._doc._id;
            done();
        });
    });

    afterEach(function(done) {
        Script.deleteScript(_scriptId).then(function() {
            done();
        })
    });

    it('should get all scripts', function() {
        return Script.getAllScripts().then(function(result) {
            assert(result.length > 0);
        });
    });

    it('should get individual script', function() {
        return Script.getScript(_scriptId).then(function(result) {
            assert.deepEqual(result._doc._id, _scriptId);
        });
    });

    it('should change script data', function() {
        return Script.postScript(true, _scriptId, 'test', 'code').then(function(result) {
            assert.deepEqual(result._id, _scriptId);
        });
    });
});
