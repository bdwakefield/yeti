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

app.controller('userController', [
    '$rootScope',
    '$scope',
    '$q',
    '$http',
    '$state',
    '$cookies',
    '$mdDialog',
    'loaderService',
    function(
        $rootScope,
        $scope,
        $q,
        $http,
        $state,
        $cookies,
        $mdDialog,
        loaderService
    ) {
        $scope.$on('$stateChangeSuccess', function(event, toState) {
            if (toState.name === 'users') {
                loaderService.show();

                getUsers().then(function (result) {
                    $scope.userList = result.data;

                    loaderService.hide();
                }).catch(function (err) {
                    console.log(err);
                });
            }
        });

        $scope.changePass = function(userName, oldPassword, newPassword) {
            return $http({
                method: 'POST',
                url:    '/api/users/changepass',
                data: {
                    username:   userName,
                    oldpassword: oldPassword,
                    newpassword: newPassword
                }
            }).success(function(result) {
                return result;
            }).error(function(err) {
                return err;
            });
        };

        $scope.userSubmit = function() {
            $http({
                method: 'POST',
                url:    '/api/users/register',
                data: {
                    firstRun: true,
                    username: $scope.inputUsername,
                    password: $scope.inputPassword,
                    email: $scope.inputEmail
                }
            }).success(function(result) {
                $scope.verifyUser($scope.inputUsername, $scope.inputPassword).then(function(result) {
                    if (result.data.success) {
                        $mdDialog.hide();
                        $state.go($state.current, {}, {reload: true});
                    }
                });
            }).error(function(err) {
                throw new Error(err);
            });
        };

        $scope.deleteUser = function(ev, id) {
            var confirm = $mdDialog.confirm()
                .title('Are you sure you want to delete this user?')
                .content('This cannot be reversed!')
                .targetEvent(ev)
                .ok('Delete')
                .cancel('Cancel');
            $mdDialog.show(confirm).then(function() {
                $http({
                    method: 'POST',
                    url:    '/api/users/delete/' + id
                }).success(function() {
                    $state.go($state.current, {}, {reload: true});
                }).error(function(err) {
                    throw new Error(err);
                });
            }, function() {
            });
        };

        $scope.showConfirm = function(ev) {
            $mdDialog.show({
                templateUrl: '/javascript/app/users/addUserModal.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true
            });
        };

            $scope.saveKeyPressed = function() {
                $scope.$broadcast('saveKey', true);
            };

        function getUsers() {
            return $http.get('/api/users').then(function(result) {
                return result;
            }).catch(function(err) {
                return err;
            });
        }
}]);
