var assert = require('assert');
var Block = require('../../../server/models/Block');
var Post = require('../../../server/models/Post');
var crypt = require('../../../server/lib/crypt');
var User = require('../../../server/models/User');
var mongoose = require('mongoose');

describe('Block Model Tests', function() {
    var _blockId;
    var _postId;
    var _userId;

    before(function(done) {
        User.create({
            username: 'testUser',
            email: 'test@email.com',
            hash: crypt.crypt('password')
        }).then(function(result) {
            _userId = result._doc._id;
            Post.addPost('Test Post', _userId).then(function(result) {
                _postId = result._doc._id;
                Post.postPost(_postId, 'blah', 'test').then(function() {
                    done();
                });
            });
        });
    });

    after(function(done) {
        Post.deletePost(_postId).then(function() {
            done();
        });
    });

    beforeEach(function(done) {
        Block.addBlock('test', 'content').then(function(result) {
            _blockId = result._doc._id;
            done();
        });
    });

    afterEach(function(done) {
        Block.deleteBlock(_blockId).then(function() {
            done();
        })
    });

    it('should get blocks', function() {
        return Block.getAllBlocks().then(function(result) {
            assert(result.length > 0);
        });
    });

    it('should get created content block', function() {
        return Block.getBlock(_blockId).then(function(result) {
            assert.deepEqual(result._id, _blockId);
        });
    });

    it('should get created blog block', function() {
        var _blogBlockId;
        return Block.addBlock('test', 'blog').then(function(result) {
            _blogBlockId = result._doc._id;
            return Block.postBlock({
                blockId: _blogBlockId,
                numPosts: 10,
                displayTitles: true,
                displayedCategories: 'test'
            }).then(function(result) {
                return Block.getBlock(_blogBlockId).then(function(result) {
                    assert.notEqual(result.content, null);
                });
            });
        });
    });
});
