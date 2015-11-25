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

app.controller('scriptsController', [
    '$rootScope',
    '$scope',
    '$state',
    '$stateParams',
    '$http',
    'loaderService',
    'scriptService',
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
        scriptService,
        viewService,
        $mdDialog,
        $mdToast,
        localStorageService
    ) {
        $scope.model = {
            selectedViews: [],
            scripts: []
        };

        $scope.model.options = {
            allowedContent: true,
            extraPlugins: 'save'
        };

        $scope.$on('$stateChangeSuccess', function(event, toState) {
            if (toState.name === 'scriptsDefault' || toState.name === 'scripts') {
                var scriptId = localStorageService.get('scriptId');
                initLoad(scriptId || null);
            }
        });

        function initLoad(scriptId) {
            loaderService.show();

            scriptService.getScripts(true).then(function (result) {
                $scope.model.scripts = result;
                if (!scriptId) {
                    buildScript($scope.model.scripts[0]._id);
                    $scope.model.currentScript = scriptService.getScriptById($scope.model.scripts[0]._id);
                    $scope.model.currentScriptId = $scope.model.scripts[0]._id;
                } else {
                    buildScript(scriptId);
                    $scope.model.currentScript = scriptService.getScriptById(scriptId);
                    $scope.model.currentScriptId = scriptId;
                }

                viewService.getViews().then(function(views) {
                    $scope.model.views = views;
                    $scope.model.selectedViews = $scope.model.currentScript.appliedTo;
                    loaderService.hide();
                });
            });
        }

        function buildScript(id) {
            var currentScript = scriptService.getScriptById(id || scriptService.getSelectedScriptId());
            $scope.model.currentScript = currentScript;
            $scope.model.selectedViews = $scope.model.currentScript.appliedTo;
            $scope.model.scriptType = currentScript.type;
        }

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

        $scope.saveScript = function() {
            $http({
                method: 'POST',
                url:    '/api/scripts',
                data: {
                    enabled: $scope.model.currentScript.enabled,
                    scriptId: $scope.model.currentScriptId,
                    scriptContent: $scope.model.currentScript.content,
                    scriptType: $scope.model.currentScript.type,
                    appliedTo: $scope.model.selectedViews
                }
            }).success(function(result) {
                if (result === 204) {
                    $mdToast.show(
                        $mdToast.simple()
                            .content('Script Saved!')
                            .position('bottom right')
                            .hideDelay(3000)
                    );
                }
            }).error(function(err) {
                throw new Error(err);
            });
        };

        $scope.gotoScript = function(scriptId) {
            localStorageService.set('scriptId', scriptId || $scope.model.currentScriptId);
            buildScript(scriptId || $scope.model.currentScriptId);
        };

        $scope.deleteScript = function(ev) {
            var confirm = $mdDialog.confirm()
                .title('Are you sure you want to delete this script?')
                .content('This cannot be reversed!')
                .targetEvent(ev)
                .ok('Delete')
                .cancel('Cancel');
            $mdDialog.show(confirm).then(function() {
                $http({
                    method: 'POST',
                    url: '/api/scripts/deleteScript',
                    data: {
                        scriptId: $scope.model.currentScriptId
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

        $scope.addScript = function() {
            $http({
                method: 'POST',
                url: '/api/scripts/addScript',
                data: {
                    scriptType: $scope.model.scriptType,
                    scriptName: $scope.model.scriptName
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
                templateUrl: '/javascript/app/scripts/addScriptModal.html',
                scope: $scope,
                preserveScope: true,
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true
            });
        };

        $scope.$on('saveKey', function(pressed) {
            if (pressed) {
                $scope.saveScript();
            }
        });
}]);
