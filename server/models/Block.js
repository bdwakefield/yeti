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

var config = require('../config/index');
var mongoose = require('mongoose');
var BlockSchema = require('./BlockSchema');
var Block = mongoose.model(config.collections.blocks, BlockSchema);
var Posts = require('./Post');
var cache = require('../lib/cache');
var Q = require('q');
var _ = require('lodash');
var moment = require('moment');

Block.getAllBlocks = function() {
    return Block.find({}, function(err, views) {
        if (err) return err;
        return views;
    });
};

Block.getBlock = function(block, params) {
    var deferred = Q.defer();
    var ObjectId = mongoose.Types.ObjectId;

    var cachedBlock = (params && params.action !== 'blog') ? cache.get(block) : undefined;

    if (cachedBlock) {
        deferred.resolve(cachedBlock);
    } else {
        Block.findOne({'_id': ObjectId(block)}).lean().exec(function (err, result) {
            if (err) deferred.reject(err);

            var matchedPosts = [];

            if (result.type === 'blog') {
                Posts.getAllPosts().then(function (posts) {
                    var postCount = 0;

                    _.each(posts, function(post) {
                        if (
                            (params.action !== 'blog' && _.includes(result.displayedCategories, post.category)) ||
                            (params.action === 'blog' && (params.cat === post.category || params.author == post.author)) ||
                            (params.action === 'blog' && !params.cat && !params.author && _.includes(result.displayedCategories, post.category))
                        ) {
                            matchedPosts.push(post);
                            postCount++;
                        }
                    });
                    if (!params.cat && !params.author) {
                        var reqPage = params.page || 1;
                        var pageMin = result.numPosts * (reqPage - 1);
                        var pageMax = pageMin + result.numPosts;
                        matchedPosts = matchedPosts.slice(pageMin, pageMax);
                    }

                    if (params.action !== 'blog') {
                        cache.set(block, matchedPosts);
                    }
                    deferred.resolve({
                        posts: matchedPosts,
                        type: 'blog',
                        paging: {
                            pages: Math.ceil(posts.length / result.numPosts),
                            total: posts.length,
                            current: params.page || 1,
                            category: params.cat,
                            author: params.author
                        }
                    });
                });
            } else {
                var bodyContent = result || {body: {content: '<h3>Block ' + block + ' is missing.</h3>'}};

                cache.set(block, bodyContent);
                deferred.resolve(bodyContent);
            }
        });
    }

    return deferred.promise;
};

Block.postBlock = function(args) {
    var deferred = Q.defer();
    var updateInstructions = {};

    if (args.blockContent) {
        updateInstructions = {
                $set: {
                    content: args.blockContent
                }
            };
    }
    if (args.numPosts) {
        updateInstructions = {
                $set: {
                    numPosts: args.numPosts,
                    displayTitles: args.displayTitles,
                    displayedCategories: args.displayedCategories
                }
            };
    }

    Block.findOneAndUpdate({
        _id: args.blockId
    },updateInstructions, {
        safe: true,
        upsert: true,
        new: true
    }, function(err){
        if (err) deferred.reject(err);

        cache.flush();
        deferred.resolve(204);
    });
    return deferred.promise;
};

Block.addBlock = function(blockName, blockType) {
    var deferred = Q.defer();
    var blockObj = {
        title: blockName,
        type: blockType
    };

    if (blockType === 'content' || blockType === 'expert') {
        blockObj.content = '';
    }

    var block = new Block(blockObj);
    block.save(function(err) {
        if (err) deferred.reject(err);
        deferred.resolve(block);
    });

    return deferred.promise;
};

Block.deleteBlock = function(blockId) {
    var deferred = Q.defer();

    Block.find({_id:blockId}).remove().then(function(result) {
        cache.flush();
        deferred.resolve(result);
    });

    return deferred.promise;
};

module.exports = Block;