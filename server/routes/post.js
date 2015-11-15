/*
 Copyright 2015 YetiJS (Thomas Richardson)

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
 */
'use strict';

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