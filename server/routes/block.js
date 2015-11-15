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
var Block = require('../models/Block');

router.get('/', function(req, res, next) {
    Block.getAllBlocks().then(function(result) {
        res.json(result);
    });
});

router.get('/:blockId', function(req, res, next) {
    Block.getBlock(req.params.blockId).then(function(result) {
        res.json(result);
    });
});

router.post('/', function(req, res, next) {
    var postArgs = {};
    if (req.body.numPosts) {
        postArgs = {
            blockId: req.body.blockId,
            numPosts: req.body.numPosts,
            displayTitles: req.body.displayTitles,
            displayedCategories: req.body.displayedCategories
        };
    } else {
        postArgs = {
            blockId: req.body.blockId,
            blockContent: req.body.blockContent
        }
    }

    Block.postBlock(postArgs).then(function (result) {
        res.json(result);
    });
});

router.post('/addBlock', function(req, res, next) {
    Block.addBlock(req.body.blockName, req.body.blockType).then(function (result) {
        res.json(result._doc);
    });
});

router.post('/deleteBlock', function(req, res, next) {
    Block.deleteBlock(req.body.blockId).then(function (result) {
        res.json(result);
    });
});

module.exports = router;