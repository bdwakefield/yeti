var express = require('express');
var router = express.Router();
var config = require('../config/index');
var Post = require('../models/Post');
var cache = require('../lib/cache');

router.get('/categories', function(req, res, next) {
    Post.getCategories().then(function(result) {
        res.json(result);
    });
});

router.get('/', function(req, res, next) {
    Post.getAllPosts().then(function(result) {
        res.json(result);
    });
});

router.get('/:postId', function(req, res, next) {
    Post.getPost(req.params.postId).then(function(result) {
        res.json(result);
    });
});

router.post('/', function(req, res, next) {
    Post.postPost(req.body.postId, req.body.postContent, req.body.postCategory).then(function (result) {
        cache.flush();
        res.json(204);
    });
});

router.post('/addPost', function(req, res, next) {
    Post.addPost(req.body.postName, req.body.author).then(function (result) {
        res.json(result._doc);
    });
});

router.post('/deletePost', function(req, res, next) {
    Post.deletePost(req.body.postId).then(function (result) {
        res.json(204);
    });
});

module.exports = router;