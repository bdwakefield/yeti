var assert = require('assert');
var Post = require('../../../server/models/Post');
var crypt = require('../../../server/lib/crypt');
var User = require('../../../server/models/User');
var mongoose = require('mongoose');

describe('Post Model Tests', function() {
    var _postId;
    var _userId;

    beforeEach(function(done) {
        User.create({
            username: 'testUser',
            email: 'test@email.com',
            hash: crypt.crypt('password')
        }).then(function(result) {
            _userId = result._doc._id;
            Post.addPost('testPost', mongoose.Types.ObjectId()).then(function(result) {
                _postId = result._doc._id;
                done();
            });
        });
    });

    afterEach(function(done) {
        Post.deletePost(_postId).then(function() {
            done();
        });
    });

    it('should get posts', function() {
        return Post.getAllPosts().then(function(result) {
            assert(result.length > 0);
        });
    });

    it('should get individual post', function() {
        return Post.getPost(_postId).then(function(result) {
            assert.deepEqual(result._id, _postId);
        });
    });

    it('should edit post data', function() {
        return Post.postPost(_postId, 'test', 'blah').then(function(result) {
            assert.deepEqual(result._id, _postId);
        });
    });

    it('should get categories', function() {
        return Post.postPost(_postId, 'test', 'blah').then(function() {
            return Post.getCategories().then(function (result) {
                assert.equal(result[0], 'blah');
            });
        });
    });
});
