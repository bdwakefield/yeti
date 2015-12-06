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

app.controller('loginController', [
    '$rootScope',
    '$scope',
    '$state',
    'userService',
    function(
        $rootScope,
        $scope,
        $state,
        userService
    ) {
        $scope.loginSubmit = function() {
            $scope.loginError = {};
            userService.verifyUser($scope.inputUser, $scope.inputPassword).then(function(result) {
                if (result.data.success) {
                    delete $scope.loginError.message;
                    userService.setToken($scope.inputUser, result.data.token);
                    $state.go($state.previous.name || 'home');
                } else {
                    $scope.loginError.message = 'Username and/or password incorrect.';
                }
            }).catch(function(err) {
                $scope.loginError.message = err.data;
            });
        };
}]);
