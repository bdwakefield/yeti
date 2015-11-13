'use strict';

var config = require('../config/index');
var mongoose = require('mongoose');
var PostSchema = require('./PostSchema');
var Post = mongoose.model(config.collections.posts, PostSchema);
var User = require('./User');
var cache = require('../lib/cache');
var Q = require('q');
var _ = require('lodash');

Post.getAllPosts = function() {
    return Post.find({}).lean().exec(function(err, posts) {
        if (err) return err;

        return User.find().lean().exec(function(err, users) {
            if (err) return err;

            // Todo: Determine why lodash _.each does not contain users in scope (even when passing in this)
            for (var i=0; i<posts.length; i++) {
                posts[i].author = _.result(_.find(users, function(user) {
                    if (posts[i].author) {
                        return user._id.toString() === posts[i].author.toString();
                    }
                }), 'username');
            }

            return posts;
        }, this);
    });
};

Post.getPost = function(post) {
    var ObjectId = mongoose.Types.ObjectId;

    var cachedPost = cache.get(post);

    if (cachedPost) {
        return Q(cachedPost);
    } else {
        return Post.findOne({'_id': ObjectId(post)}).lean().exec(function (err, result) {
            if (err) return Q.reject(err);

            var bodyContent = result || {body: {content: '<h3>Post ' + post + ' is missing.</h3>'}};
            bodyContent.postCategory = result.category;

            cache.set(post, bodyContent);
            return bodyContent;
        });
    }
};

Post.getCategories = function() {
    return Post.find().distinct('category').lean().exec(function(err, posts) {
        if (err) return err;
        return posts;
    });
};

Post.postPost = function(postId, postContent, postCategory) {
    return Post.findOneAndUpdate({_id: postId},{
        $set: {
            content: postContent,
            category: postCategory
        }
    }, {
        safe: true,
        upsert: true,
        new: true
    });
};

Post.addPost = function(postName, author) {
    var post = new Post({
        title: postName,
        author: author,
        content: ''
    });
    return post.save();
};

Post.deletePost = function(postId) {
    return Post.find({_id:postId}).remove().then(function(result) {
        cache.flush();
        return result;
    });
};

module.exports = Post;