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

var _ = require('lodash');
var Q = require('q');
var Posts = require('../models/Post');

module.exports = {
    export: function() {
        var deferred = Q.defer();
        var output = '<div id="blog-posts-categories"><span id="blog-posts-categories-title">Top Categories</span>';
        output += '<ul id="blog-posts-categories-items">';
        Posts.getCategories().then(function(categories) {
            _.forEach(categories.slice(0,5), function(category) {
                var correctedCategory = (category.length > 25) ? category.substr(0, 25) + '...' : category;
                output += processPost('<a href="?action=blog&cat=' + category + '">' + correctedCategory + '</a>');
            });
            output += '</ul></div>';
            deferred.resolve(output);
        });
        return deferred.promise;
    }
};

function processPost(post) {
    return '<li>' + post + '</li>';
}