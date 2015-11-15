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

app.factory('postService', [
    '$q',
    '$http',
    function(
        $q,
        $http
    ) {
        var postService = {};
        var posts;
        var selectedPostId;

        postService.setSelectedPostId = function(postId) {
            selectedPostId = postId;
        };

        postService.getSelectedPostId = function() {
            return selectedPostId;
        };

        postService.setPosts = function() {
            return fetchPosts();
        };

        postService.getPosts = function(cacheBuster) {
            if (!posts || cacheBuster) {
                return fetchPosts().then(function(result) {
                    return posts;
                });
            } else {
                return $q.when(posts);
            }
        };

        postService.getPostById = function(postId) {
            return _.find(posts, {
                _id: postId
            });
        };

        function fetchPosts() {
            return $http.get('/api/posts').then(function (result) {
                posts = result.data;
                return posts;
            }).catch(function (err) {
                console.log(err);
            });
        }

        return postService;
}]);