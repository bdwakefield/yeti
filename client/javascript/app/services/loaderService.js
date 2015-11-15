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

app.factory('loaderService', [
    '$rootScope',
    '$timeout',
    function(
        $rootScope,
        $timeout
    ) {
    var loaderService = {};
    var loaderDelay = 300;
    // loaderService controls the state of the splash screen, if it is hidden again within loaderDelay ms it never shows. Prevents flickering.
    var loaderState;

    loaderService.show = function() {
        loaderState = true;
        $timeout(function() {
            if (loaderState) {
                $rootScope.isLoading = true;
                loaderState = true;
            }
        }, loaderDelay);
    };

    loaderService.hide = function() {
        loaderState = false;
        $rootScope.isLoading = false;
    };

    return loaderService;
}]);