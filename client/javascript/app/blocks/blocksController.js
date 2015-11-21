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

app.controller('blocksController', [
    '$rootScope',
    '$scope',
    '$state',
    '$stateParams',
    '$http',
    '$timeout',
    '$mdDialog',
    '$mdBottomSheet',
    'loaderService',
    'blockService',
    'postService',
    '$mdToast',
    function(
        $rootScope,
        $scope,
        $state,
        $stateParams,
        $http,
        $timeout,
        $mdDialog,
        $mdBottomSheet,
        loaderService,
        blockService,
        postService,
        $mdToast
    ) {
        $scope.model = {
            blockType: 'blog'
        };

        var editor = $('div#editor');

        $scope.$on('$stateChangeSuccess', function(event, toState) {
            if (toState.name === 'blocksDefault' || toState.name === 'blocks') {
                initLoad($stateParams.blockId || null);
            }
        });

        $scope.saveBlock = function() {
            var postData = {
                blockId: $scope.model.currentBlockId
            };

            if ($scope.model.currentBlock.type === 'content') {
                postData.blockContent = editor.froalaEditor('html.get');
            } else if ($scope.model.currentBlock.type === 'blog') {
                postData.numPosts = $scope.model.blockSettings.numToDisplay;
                postData.displayTitles = $scope.model.blockSettings.displayTitles;
                postData.displayedCategories = $scope.model.blockSettings.displayedCategories;
            } else if ($scope.model.currentBlock.type === 'expert') {
                postData.blockContent = $scope.model.currentBlock.content;
            }

            $http({
                method: 'POST',
                url:    '/api/blocks',
                data: postData
            }).success(function(result) {
                if (result === 204) {
                    $mdToast.show(
                        $mdToast.simple()
                            .content('Block Saved!')
                            .position('bottom right')
                            .hideDelay(3000)
                    );
                }
            }).error(function(err) {
                throw new Error(err);
            });
        };

        $scope.deleteBlock = function(ev) {
            var confirm = $mdDialog.confirm()
                .title('Are you sure you want to delete this view?')
                .content('This cannot be reversed!')
                .targetEvent(ev)
                .ok('Delete')
                .cancel('Cancel');
            $mdDialog.show(confirm).then(function() {
                $http({
                    method: 'POST',
                    url: '/api/blocks/deleteBlock',
                    data: {
                        blockId: $scope.model.currentBlockId
                    }
                }).success(function (result) {
                    if (result) {
                        initLoad();
                    }
                }).error(function (err) {
                    throw new Error(err);
                });
            });
        };

        $scope.gotoBlock = function(id) {
            buildBlock(id || $scope.model.currentBlockId);
        };

        $scope.toggle = function (item, list) {
            var idx = list.indexOf(item);
            if (idx > -1) list.splice(idx, 1);
            else list.push(item);
        };

        $scope.exists = function (item, list) {
            return list.indexOf(item) > -1;
        };

        $scope.addBlock = function() {
            $http({
                method: 'POST',
                url: '/api/blocks/addBlock',
                data: {
                    blockType: $scope.model.blockType,
                    blockName: $scope.model.blockName
                }
            }).then(function(result) {
                $mdDialog.hide();
                if (result && result.data._id) {
                    initLoad(result.data._id);
                    $mdBottomSheet.hide();
                    $scope.model.blockType = 'blog';
                    $scope.model.blockName = '';
                }
            }).catch(function(err) {
                console.log(err);
            });
        };

        $scope.showConfirm = function(ev) {
            $mdDialog.show({
                templateUrl: '/javascript/app/blocks/addBlockModal.html',
                parent: angular.element(document.body),
                scope: $scope,
                preserveScope: true,
                targetEvent: ev,
                clickOutsideToClose: true
            });
        };

        $scope.showBottomSheet = function(ev) {
            $mdBottomSheet.show({
                templateUrl: '/javascript/app/blocks/addBlockBottomSheet.html',
                scope: $scope,
                preserveScope: true,
                clickOutsideToClose: true,
                targetEvent: ev
            });
        };

        $scope.isSelectedType = function(type) {
            return $scope.model.blockType === type ? 'md-raised' : '';
        };

        $scope.selectType = function(type) {
            $scope.model.blockType = type;
        };

        $scope.aceLoaded = function(editor) {
            editor.setTheme("ace/theme/github");
            editor.getSession().setMode("ace/mode/html");
        };

        function initLoad(blockId) {
            loaderService.show();

            postService.getPostCategories().then(function(result) {
                $scope.model.postCategories = result;
            }).then(function() {
                blockService.getBlocks(true).then(function (result) {
                    $scope.model.blocks = result;
                    blockService.setSelectedBlockId(blockId || result[0]._id);
                    $scope.model.currentBlockId = blockService.getSelectedBlockId();

                    buildBlock(blockId || null);
                    loaderService.hide();
                });
            });
        }

        function buildBlock(id) {
            var currentBlock = blockService.getBlockById(id || blockService.getSelectedBlockId());
            $scope.model.currentBlock = currentBlock;

            if (currentBlock.type === 'blog') {
                $scope.model.blockSettings = {
                    numToDisplay: currentBlock.numPosts,
                    displayTitles: currentBlock.displayTitles,
                    displayedCategories: currentBlock.displayedCategories || []
                };
            } else if (currentBlock.type === 'content') {
                editor.froalaEditor({
                    toolbarButtons: ['fullscreen', 'bold', 'italic', 'underline', 'strikeThrough', 'subscript', 'superscript', 'fontFamily', 'fontSize', '|', 'color', 'emoticons', 'inlineStyle', 'paragraphStyle', '|', 'paragraphFormat', 'align', 'formatOL', 'formatUL', 'outdent', 'indent', '-', 'insertLink', 'insertImage', 'insertVideo', 'insertFile', 'insertTable', '|', 'quote', 'insertHR', 'undo', 'redo', 'clearFormatting', 'selectAll', 'html']
                });
                editor.froalaEditor('html.set', currentBlock.content);
            }

            $timeout(function() {
                var froalaLabel = $("div:contains('Unlicensed Froala Editor')");
                froalaLabel[froalaLabel.length-1].style.visibility='hidden';
            }, 350);
        }

        $scope.$on('saveKey', function(pressed) {
            if (pressed) {
                $scope.saveBlock();
            }
        });
    }]);