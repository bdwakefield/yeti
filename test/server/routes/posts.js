var request = require('supertest');
var app = require('../../../app');
var Post = require('../../../server/models/Post');

var _postName = 'route-test-post';
var _postId;

describe('Post Route Tests', function() {
    beforeEach(function(done) {
        request(app)
            .post('/api/posts/addPost')
            .send({
                postName: _postName,
                postType: 'content'
            })
            .expect(200)
            .expect(function(result) {
                _postId = result.body._id;
            })
            .end(done);
    });

    afterEach(function(done) {
        request(app)
            .post('/api/posts/deletePost')
            .send({
                postId: _postId
            })
            .expect(200)
            .end(done);
    });

    it('should get posts', function(done) {
        request(app)
            .get('/api/posts/')
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

    it('should get post categories', function(done) {
        Post.postPost(_postId, 'test', 'test').then(function() {
            request(app)
                .get('/api/posts/categories')
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
    });

    it('should get created post', function(done) {
        request(app)
            .get('/api/posts/' + _postId)
            .expect(200)
            .expect(function(result) {
                var body = result.body;
                if (body._id === _postId) {
                    return true;
                } else {
                    throw new Error('Could not fetch views');
                }
            })
            .end(done);
    });

    it('should modify blog post post', function(done) {
        request(app)
            .post('/api/posts/')
            .send({
                postId: _postId,
                numPosts: 15,
                displayTitles: true,
                displayedCategories: 'test'
            })
            .expect(200)
            .end(done);
    });

    it('should modify content post post', function(done) {
        request(app)
            .post('/api/posts/')
            .send({
                postId: _postId,
                postContent: 'content'
            })
            .expect(200)
            .end(done);
    });
});
