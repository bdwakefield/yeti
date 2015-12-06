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

app.factory('userService', [
    '$q',
    '$http',
    '$rootScope',
    '$cookies',
    function(
        $q,
        $http,
        $rootScope,
        $cookies
    ) {
        var userService = {};

        userService.verifyUser = function(user, pass) {
            return $http({
                method: 'POST',
                url:    '/api/users/verify',
                data: {
                    username:   user,
                    password:   pass
                }
            }).success(function(result) {
                return result;
            }).error(function(err) {
                return err;
            });
        };

        userService.verifyToken = function(token) {
            return $http({
                method: 'POST',
                url:    '/api/users/verifytoken',
                data: {
                    token: token
                }
            }).success(function(result) {
                return result;
            }).error(function(err) {
                return err;
            });
        };

        userService.logout = function() {
            $cookies.remove('authToken');
            $state.go('login');
        };

        userService.setToken = function(user, token) {
            $cookies.put('authToken', token);
            $rootScope.verified = true;
            $rootScope.user = {
                name: user
            };
        };

        userService.refreshAuth = function() {
            var deferred = $q.defer();

            var tokenCookie = $cookies.get('authToken');

            userService.verifyToken(tokenCookie).then(function (result) {
                if (result.status === 200) {
                    $rootScope.verified = true;
                    $rootScope.user = {
                        name: result.data.decoded.userName
                    };
                    deferred.resolve(true);
                } else {
                    deferred.reject(401);
                }
            }).catch(function(err) {
                deferred.reject(err);
            });

            return deferred.promise;
        };

        return userService;
}]);