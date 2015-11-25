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

app.controller('stylesController', [
    '$rootScope',
    '$scope',
    '$state',
    '$stateParams',
    '$http',
    'loaderService',
    'styleService',
    'viewService',
    '$mdDialog',
    '$mdToast',
    'localStorageService',
    function(
        $rootScope,
        $scope,
        $state,
        $stateParams,
        $http,
        loaderService,
        styleService,
        viewService,
        $mdDialog,
        $mdToast,
        localStorageService
    ) {
        $scope.model = {
            selectedViews: [],
            styles: []
        };

        $scope.model.options = {
            allowedContent: true,
            extraPlugins: 'save'
        };

        $scope.$on('$stateChangeSuccess', function(event, toState) {
            if (toState.name === 'stylesDefault' || toState.name === 'styles') {
                var styleId = localStorageService.get('styleId');
                initLoad(styleId || null);
            }
        });

        function initLoad(styleId) {
            loaderService.show();

            styleService.getStyles(true).then(function (result) {
                $scope.model.styles = result;
                if (!styleId) {
                    buildStyle($scope.model.styles[0]._id);
                    $scope.model.currentStyle = styleService.getStyleById($scope.model.styles[0]._id);
                    $scope.model.currentStyleId = $scope.model.styles[0]._id;
                } else {
                    buildStyle(styleId);
                    $scope.model.currentStyle = styleService.getStyleById(styleId);
                    $scope.model.currentStyleId = styleId;
                }

                viewService.getViews().then(function(views) {
                    $scope.model.views = views;
                    $scope.model.selectedViews = $scope.model.currentStyle.appliedTo;
                    loaderService.hide();
                });
            });
        }

        function buildStyle(id) {
            var currentStyle = styleService.getStyleById(id || styleService.getSelectedStyleId());
            $scope.model.currentStyle = currentStyle;
            $scope.model.selectedViews = $scope.model.currentStyle.appliedTo;
            $scope.model.styleType = currentStyle.type;
        }

        $scope.saveStyle = function() {
            $http({
                method: 'POST',
                url:    '/api/styles',
                data: {
                    enabled: $scope.model.currentStyle.enabled,
                    styleId: $scope.model.currentStyleId,
                    styleContent: $scope.model.currentStyle.content,
                    styleType: $scope.model.currentStyle.type,
                    appliedTo: $scope.model.selectedViews
                }
            }).success(function(result) {
                if (result === 204) {
                    $mdToast.show(
                        $mdToast.simple()
                            .content('Stylesheet Saved!')
                            .position('bottom right')
                            .hideDelay(3000)
                    );
                }
            }).error(function(err) {
                throw new Error(err);
            });
        };

        $scope.gotoStyle = function(styleId) {
            localStorageService.set('styleId', styleId || $scope.model.currentStyleId);
            buildStyle(styleId || $scope.model.currentStyleId);
        };

        $scope.toggleView = function(view) {
            var idx = $scope.model.selectedViews.indexOf(view);
            if (~idx) {
                $scope.model.selectedViews.splice(idx, 1);
            } else {
                $scope.model.selectedViews.push(view);
            }
        };

        $scope.viewExists = function(view) {
            return ~$scope.model.selectedViews.indexOf(view);
        };

        $scope.deleteStyle = function(ev) {
            var confirm = $mdDialog.confirm()
                .title('Are you sure you want to delete this style?')
                .content('This cannot be reversed!')
                .targetEvent(ev)
                .ok('Delete')
                .cancel('Cancel');
            $mdDialog.show(confirm).then(function() {
                $http({
                    method: 'POST',
                    url: '/api/styles/deleteStyle',
                    data: {
                        styleId: $scope.model.currentStyleId
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

        $scope.aceLoaded = function(editor) {
            editor.setTheme("ace/theme/github");
            editor.getSession().setMode("ace/mode/css");
        };

        $scope.addStyle = function() {
            $http({
                method: 'POST',
                url: '/api/styles/addStyle',
                data: {
                    styleType: $scope.model.styleType,
                    styleName: $scope.model.styleName
                }
            }).then(function(result) {
                $mdDialog.hide();
                initLoad(result.data._id);
            }).catch(function(err) {
                console.log(err);
            });
        };

        $scope.showConfirm = function(ev) {
            $mdDialog.show({
                templateUrl: '/javascript/app/styles/addStyleModal.html',
                scope: $scope,
                preserveScope: true,
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true
            });
        };

        $scope.$on('saveKey', function(pressed) {
            if (pressed) {
                $scope.saveStyle();
            }
        });
}]);
