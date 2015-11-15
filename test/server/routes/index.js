var request = require('supertest-as-promised');
var app = require('../../../app');
var View = require('../../../server/models/View');

var _viewId;

describe('Index Route Tests', function() {
    beforeEach(function(done) {
        View.addView('testView').then(function(result) {
            _viewId = result._doc._id;
            View.postView(_viewId, 'test', '/test', true).then(function() {
                done();
            });
        });
    });

    afterEach(function(done) {
        View.deleteView(_viewId).then(function() {
            done();
        });
    });

    it('should get default route', function(done) {
        request(app)
            .get('/')
            .expect(200)
            .expect(function(result) {
                var body = result.text;
                if (body) {
                    return true;
                } else {
                    throw new Error('Could not fetch views');
                }
            })
            .end(done);
    });

    it('should get default route', function(done) {
        View.addView('testView2').then(function(result) {
            _viewId = result._doc._id;
            View.postView(_viewId, 'test2', '/test2', true).then(function() {
                request(app)
                    .get('/test2')
                    .expect(200)
                    .expect(function(result) {
                        var body = result.text;
                        if (body) {
                            return true;
                        } else {
                            throw new Error('Could not fetch views');
                        }
                    })
                    .end(done);
            });
        });
    });
});
