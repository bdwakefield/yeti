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

app.controller('adminController', [
    '$rootScope',
    '$scope',
    '$state',
    'viewService',
    function(
        $rootScope,
        $scope,
        $state,
        viewService
    ) {
        $rootScope.isLoading = false;

        $scope.$on('$viewContentLoaded', function() {
            $scope.refreshAuth().catch(function() {
                $state.go('login');
            });
        });

        $scope.$on('$stateChangeSuccess', function() {
            viewService.getViews().then(function(result) {
                $scope.views = result;
                $state.go('views');
            });
        });
}]);