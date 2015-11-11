var assert = require('assert');
var View = require('../../../server/models/View');

describe('View Model Tests', function() {
    var _viewId;
    beforeEach(function(done) {
        View.addView(new Date().getTime()).then(function(result) {
            _viewId = result._doc._id;
            View.postView(_viewId, '{{1}}', '/test', false).then(function() {
                done();
            });
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

    it('should get view by id', function() {
        return View.getView(_viewId).then(function(result) {
            assert.deepEqual(result._id, _viewId);
        });
    });

    it('should get view without id and return view does not exist', function() {
        return View.getView().then(function(result) {
            assert.equal(result.body.content, 'No default view or view does not exist.');
        });
    });

    it('should change view content', function() {
        return View.postView(_viewId, 'test', '/test', true).then(function(result) {
            assert.equal(result, 204);
        });
    });

    it('should not get default view ID', function() {
        return View.getDefaultViewId().then(function (result) {
            assert.equal(result, null);
        });
    });

    it('should get default view ID', function() {
        return View.postView(_viewId, 'test', '/test', true).then(function() {
            return View.getDefaultViewId().then(function (result) {
                assert.deepEqual(result._id, _viewId);
            });
        });
    });

    it('should get all view routes', function() {
        return View.getRoutes().then(function (result) {
            assert(result.length > 0);
        });
    });
});
