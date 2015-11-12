var assert = require('assert');
var Style = require('../../../server/models/Style');

describe('Style Model Tests', function() {
    var _styleId;

    beforeEach(function(done) {
        Style.addStyle('code', 'testStyle').then(function(result) {
            _styleId = result._doc._id;
            done();
        });
    });

    afterEach(function(done) {
        Style.deleteStyle(_styleId).then(function() {
            done();
        })
    });

    it('should get all styles', function() {
        return Style.getAllStyles().then(function(result) {
            assert(result.length > 0);
        });
    });

    it('should get individual style', function() {
        return Style.getStyle(_styleId).then(function(result) {
            assert.deepEqual(result._doc._id, _styleId);
        });
    });

    it('should change style data', function() {
        return Style.postStyle(true, _styleId, 'test', 'code').then(function(result) {
            assert.deepEqual(result._id, _styleId);
        });
    });
});
