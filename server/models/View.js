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
var cache = require('../lib/cache');
var mongoose = require('mongoose');
var ViewSchema = require('./ViewSchema');
var View = mongoose.model(config.collections.views, ViewSchema);
var blocks = require('./Block');
var Q = require('q');
var _ = require('lodash');

View.getView = function(view, params) {
    var deferred = Q.defer();
    var ObjectId = mongoose.Types.ObjectId;

    if (view) {
        var cachedView = (params && params.action !== 'blog') ? cache.get(view) : undefined;

        if (cachedView) {
            deferred.resolve(cachedView);
        } else {
            View.findOne({"_id": ObjectId(view)}).lean().exec(function (err, result) {
                if (err) console.log(err);

                var bodyContent = {
                    body: {
                        content: ''
                    }
                };
                parseView(result.content, params).then(function (result) {
                    bodyContent.body.content = result;
                    bodyContent.id = view;

                    if (params && params.action !== 'blog') {
                        cache.set(view, result);
                    }
                    deferred.resolve(result);
                });
            });
        }
    } else {
        deferred.resolve({body:{content:'No default view or view does not exist.'}});
    }

    return deferred.promise;
};

View.getDefaultViewId = function() {
    var deferred = Q.defer();
    var cachedViewId = cache.get('defaultViewId');

    if (cachedViewId) {
        deferred.resolve(cachedViewId);
    } else {
        View.findOne({
            default: true
        }).lean().exec(function (err, result) {
            if (err) console.log(err);

            if (result) {
                cache.set('defaultViewId', result._id.toString());
                deferred.resolve(result._id.toString());
            } else {
                deferred.resolve(null);
            }
        });
    }

    return deferred.promise;
};

View.getViewForEdit = function(view) {
    var ObjectId = mongoose.Types.ObjectId;
    return View.findOne({_id:ObjectId(view)}).lean().exec();
};

View.getViewsForEdit = function() {
    return View.find({}).lean().exec().then(function(result) {
        return _.map(result, function(view) {
            return {
                id: view._id,
                content: view.content || '<h1>Please add a block to get started with this view.</h1>',
                defaultView: view.default,
                title: view.title,
                route: view.route
            };
        });
    });
};

View.postView = function(viewId, viewContent, viewRoute, viewIsDefault) {
    return clearAllDefaultViews(viewIsDefault).then(function() {
        return updateView(viewId, viewContent, viewRoute, viewIsDefault).then(function() {
            cache.flush();
            return 204;
        });
    });
};

View.addView = function(viewName) {
    var view = new View({
        title: viewName,
        route: '/' + viewName,
        content: '',
        default: false
    });
    return view.save();
};

View.deleteView = function(viewId) {
    return View.find({_id:viewId}).remove().then(function(result) {
        cache.flush();
        return result;
    });
};

View.getRoutes = function() {
    var deferred = Q.defer();
    View.find({}, function(err, views) {
        if (err) return err;

        deferred.resolve(_.map(views, function(view) {
            return {
                _id: view._id,
                route: view.route
            }
        }));
    });
    return deferred.promise;
};

function clearAllDefaultViews(viewIsDefault) {
    if (viewIsDefault) {
        return View.update({}, {
            default: false
        }, {
            multi: true
        }).exec();
    } else {
        return new Q.resolve();
    }
}

function updateView(viewId, viewContent, viewRoute, viewIsDefault) {
    return View.findOneAndUpdate({
        _id: viewId
    },{
        $set: {
            default: viewIsDefault,
            route: viewRoute,
            content: viewContent
        }
    }).exec();
}

function parseView(content, params) {
    var deferred = Q.defer();
    var promises = [];
    var filteredBlogsShown = false;

    var reg = /\{\{\-([\s\S]*?)\}\}/gm;

    var matches = content.match(reg);

    if (matches) {
        matches.forEach(function (match) {
            var innerDeferred = Q.defer();
            var blockId = match.replace(/\{\{\-|\}\}/g, '');
            blocks.getBlock(blockId, params).then(function (result) {
                // The following safeguards against blog post blocks posting for every single one on the page in the case of a filter selected by the user
                // ie: There are 4 blog post blocks on the post and user clicks a category, this prevents it from showing matching posts times four
                if (
                    (result.type !== 'blog') ||
                    (params && params.action === 'blog' && result.type === 'blog' && !filteredBlogsShown) ||
                    (params && params.action !== 'blog')
                ) {
                    filteredBlogsShown = (params && params.action === 'blog' && result.type === 'blog');
                    innerDeferred.resolve(result);
                } else {
                    innerDeferred.resolve();
                }
            });
            promises.push(innerDeferred.promise);
        });

        Q.all(promises).then(function (result) {
            deferred.resolve(_(result).omit(_.isUndefined).value());
        });
    } else {
        deferred.resolve(content);
    }
    return deferred.promise;
}

module.exports = View;