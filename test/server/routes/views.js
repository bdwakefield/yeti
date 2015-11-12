var request = require('supertest');
var app = require('../../../app');
var View = require('../../../server/models/View');

var _viewName = 'route-test-view';
var _viewId;

describe('View Route Tests', function() {
    it('should add a view', function(done) {
        request(app)
            .post('/api/views/addView')
            .send({
                viewName: _viewName
            })
            .expect(200)
            .expect(function(result) {
                var body = result.body;
                if (body.title === _viewName && body.route === '/' + _viewName && body._id) {
                    _viewId = body._id;
                    return true;
                } else {
                    throw new Error('Could not fetch views');
                }
            })
            .end(done);
    });

    it('should get views editing', function(done) {
        request(app)
            .get('/api/views/edit/')
            .expect(200)
            .expect(function(result) {
                var body = result.body;
                if (body.length > 0) {
                    return true;
                } else {
                    throw new Error('Could not fetch views');
                }
            })
            .end(done);
    });

    it('should get created view', function(done) {
        request(app)
            .get('/api/views/' + _viewId)
            .expect(200)
            .expect(function(result) {
                var body = result.body;
                if (body._id) {
                    return true;
                } else {
                    throw new Error('Could not fetch views');
                }
            })
            .end(done);
    });

    it('should get created view for editing', function(done) {
        request(app)
            .get('/api/views/edit/' + _viewId)
            .expect(200)
            .expect(function(result) {
                var body = result.body;
                if (body._id) {
                    return true;
                } else {
                    throw new Error('Could not fetch views');
                }
            })
            .end(done);
    });

    it('should change view content', function(done) {
        request(app)
            .post('/api/views/')
            .send({
                viewId: _viewId,
                viewRoute: '/test',
                viewIsDefault: true
            })
            .expect(200)
            .expect(function(result) {
                var body = result.body;
                if (body === 204) {
                    return true;
                } else {
                    throw new Error('Could not fetch views');
                }
            })
            .end(done);
    });

    it('should delete the view it created', function(done) {
        request(app)
            .post('/api/views/deleteView')
            .send({
                viewId: _viewId
            })
            .expect(200)
            .end(done);
    });
});
