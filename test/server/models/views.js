var assert = require('assert');
var View = require('../../../server/models/View');

describe('View Model Tests', function() {
    var _viewId;
    beforeEach(function(done) {
        View.addView(new Date().getTime()).then(function(result) {
            _viewId = result._doc._id;
            done();
        });
    });

    afterEach(function(done) {
        View.deleteView(_viewId).then(function() {
            done();
        })
    });

    it('should get views for edit', function() {
        return View.getViewsForEdit().then(function(result) {
            assert(result.length > 0);
        });
    });

    it('should get view by id for edit', function() {
        return View.getViewForEdit(_viewId).then(function(result) {
            assert.deepEqual(result._id, _viewId);
        });
    });
});
