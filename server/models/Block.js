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
var widgets = require('../lib/widget');
var cache = require('../lib/cache');
var _ = require('lodash');
var moment = require('moment');

Block.getAllBlocks = () => Block.find({}, (err, views) => err ? err : views);

Block.getBlock = (block, params) => {
    return new Promise((resolve, reject) => {
        var ObjectId = mongoose.Types.ObjectId;

        var cachedBlock = (params && params.action !== 'blog') ? cache.get(block) : undefined;

        if (cachedBlock) {
            resolve(cachedBlock);
        } else {
            Block.findOne({'_id': ObjectId(block)}).lean().exec((err, result) => {
                if (err) reject(err);

                var matchedPosts = [];

                if (result.type === 'blog') {
                    Posts.getAllPosts().then(posts => {
                        var postCount = 0;

                        _.each(posts, post => {
                            if (
                                (params.action !== 'blog' && _.includes(result.displayedCategories, post.category)) ||
                                (params.action === 'blog' && (params.cat === post.category || params.author == post.author)) ||
                                (params.action === 'blog' && !params.cat && !params.author && !params.post && _.includes(result.displayedCategories, post.category)) ||
                                (params.action === 'blog' && post._id.toString() === params.post)
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
                        resolve({
                            posts: matchedPosts,
                            type: 'blog',
                            settings: {
                                disqusAccount: config.disqusAccount
                            },
                            paging: {
                                pages: Math.ceil(posts.length / result.numPosts),
                                total: posts.length,
                                current: params.page || 1,
                                category: params.cat,
                                author: params.author,
                                post: params.post
                            }
                        });
                    });
                } else {
                    var bodyContent = widgetify(result) || {body: {content: '<h3>Block ' + block + ' is missing.</h3>'}};
                    resolve(bodyContent);
                    cache.set(block, bodyContent);
                }
            });
        }
    });
};

Block.postBlock = args => {
    return new Promise((resolve, reject) => {
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
        }, updateInstructions, {
            safe: true,
            upsert: true,
            new: true
        }, err => {
            if (err) reject(err);

            cache.flush();
            resolve(204);
        });
    });
};

Block.addBlock = (blockName, blockType) => {
    return new Promise((resolve, reject) => {
        var blockObj = {
            title: blockName,
            type: blockType
        };

        if (blockType === 'content' || blockType === 'expert') {
            blockObj.content = '';
        }

        var block = new Block(blockObj);
        block.save(function (err) {
            if (err) reject(err);
            resolve(block);
        });
    });
};

Block.deleteBlock = blockId => {
    return new Promise((resolve, reject) => {
        Block.find({_id: blockId}).remove().then(result => {
            cache.flush();
            resolve(result);
        });
    });
};

function widgetify(bodyContent) {
    return new Promise((resolve, reject) => {
        var reg = /\{\{\-([\s\S]*?)\}\}/gm;
        var promises = [];

        var matches = bodyContent.content.match(reg);

        if (matches) {
            matches.forEach(match => {
                promises.push(new Promise((resolve, reject) => {
                    var widgetName = match.replace(/\{\{\-|\}\}/g, '');
                    widgets.get(widgetName, bodyContent).then(content => {
                        bodyContent.content = bodyContent.content.replace('{{-' + widgetName + '}}', content);
                        resolve();
                    });
                }));
            });
            Promise.all(promises).then(() => resolve(bodyContent));
        } else {
            resolve(bodyContent);
        }
    });
}

module.exports = Block;