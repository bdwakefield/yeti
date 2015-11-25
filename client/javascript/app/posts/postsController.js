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

app.controller('postsController', [
    '$rootScope',
    '$scope',
    '$state',
    '$http',
    '$mdDialog',
    '$cookies',
    'loaderService',
    'postService',
    '$mdToast',
    '$timeout',
    'localStorageService',
    function(
        $rootScope,
        $scope,
        $state,
        $http,
        $mdDialog,
        $cookies,
        loaderService,
        postService,
        $mdToast,
        $timeout,
        localStorageService
    ) {
        var editor = $('div#editor');
        $scope.model = {};
        $scope.model.posts = [];

        $scope.$on('$stateChangeSuccess', function(event, toState) {
            if (toState.name === 'postsDefault' || toState.name === 'posts') {
                var postId = localStorageService.get('postId');
                initLoad(postId || null);
            }
        });

        function initLoad(postId) {
            loaderService.show();

            postService.getPostCategories().then(function(result) {
                $scope.model.postCategories = result;
            }).then(function() {
                postService.getPosts(true).then(function (result) {
                    $scope.model.posts = result;
                    if (!postId) {
                        buildPost($scope.model.posts[0]._id);
                        $scope.model.currentPost = postService.getPostById($scope.model.posts[0]._id);
                        $scope.model.currentPostId = $scope.model.posts[0]._id;
                    } else {
                        buildPost(postId);
                        $scope.model.currentPost = postService.getPostById(postId);
                        $scope.model.currentPostId = postId;
                    }

                    loaderService.hide();
                });
            });
        }

        function buildPost(id) {
            var currentPost = postService.getPostById(id || postService.getSelectedPostId());
            $scope.model.currentPost = currentPost;
            $scope.model.postCategory = currentPost.category;

            editor.froalaEditor({
                toolbarButtons: ['fullscreen', 'bold', 'italic', 'underline', 'strikeThrough', 'subscript', 'superscript', 'fontFamily', 'fontSize', '|', 'color', 'emoticons', 'inlineStyle', 'paragraphStyle', '|', 'paragraphFormat', 'insertLink', 'insertImage', 'insertVideo', 'insertFile', '|', 'align', 'formatOL', 'formatUL', 'outdent', 'indent', '-', 'insertTable', '|', 'quote', 'insertHR', 'undo', 'redo', 'clearFormatting', 'selectAll', 'html'],
                imageManagerLoadURL: '/api/media/editorList',
                imageUploadURL: '/api/media/editorUpload'
            });
            editor.froalaEditor('html.set', currentPost.content);

            $timeout(function() {
                var froalaLabel = $("div:contains('Unlicensed Froala Editor')");
                froalaLabel[froalaLabel.length-1].style.visibility='hidden';
            }, 350);
        }

        $scope.gotoPost = function(postId) {
            localStorageService.set('postId', postId || $scope.model.currentPostId);
            buildPost(postId || $scope.model.currentPostId);
        };

        $scope.savePost = function() {
            $http({
                method: 'POST',
                url:    '/api/posts',
                data: {
                    postId: $scope.model.currentPostId,
                    postContent: editor.froalaEditor('html.get'),
                    postCategory: $scope.model.postCategory
                }
            }).success(function(result) {
                if (result === 204) {
                    $mdToast.show(
                        $mdToast.simple()
                            .content('Post Saved!')
                            .position('bottom right')
                            .hideDelay(3000)
                    );
                }
            }).error(function(err) {
                throw new Error(err);
            });
        };

        $scope.deletePost = function(ev) {
            var confirm = $mdDialog.confirm()
                .title('Are you sure you want to delete this post?')
                .content('This cannot be reversed!')
                .targetEvent(ev)
                .ok('Delete')
                .cancel('Cancel');
            $mdDialog.show(confirm).then(function() {
                $http({
                    method: 'POST',
                    url:    '/api/posts/deletePost',
                    data: {
                        postId: $scope.model.currentPostId
                    }
                }).success(function(result) {
                    if (result) {
                        initLoad();
                    }
                }).error(function(err) {
                    throw new Error(err);
                });
            }, function() {
            });
        };

        $scope.addPost = function() {
            $http({
                method: 'POST',
                url:    '/api/users/verifytoken',
                data: {
                    token: $cookies.get('authToken')
                }
            }).success(function(token) {
                $http({
                    method: 'POST',
                    url: '/api/posts/addPost',
                    data: {
                        postName: $scope.model.postName,
                        author: token.decoded.userId
                    }
                }).then(function(result) {
                    $mdDialog.hide();
                    initLoad(result.data._id);
                }).catch(function(err) {
                    console.log(err);
                });
            });
        };

        $scope.showConfirm = function(ev) {
            $mdDialog.show({
                templateUrl: '/javascript/app/posts/addPostModal.html',
                scope: $scope,
                preserveScope: true,
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true
            });
        };

        $scope.$on('saveKey', function(pressed) {
            if (pressed) {
                $scope.savePost();
            }
        });
}]);