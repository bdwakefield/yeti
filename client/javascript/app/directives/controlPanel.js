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

app.directive('controlPanel', ['$timeout', function($timeout) {
    return {
        restrict: 'E',
        link: function(scope) {
            var snapper = new Snap({
                element: document.getElementById('page-content-wrapper'),
                disable: 'right',
                maxPosition: 500,
                transitionSpeed: 1,
                easing: 'ease'
            });

            var hoverTimer;

            scope.startHover = function() {
                hoverTimer = $timeout(function() {
                    scope.toggleMenu()
                }, 500);
            };

            scope.endHover = function() {
                $timeout.cancel(hoverTimer);
            };

            scope.toggleMenu = function() {
                if (snapper.state().state === 'left') {
                    snapper.close();
                } else {
                    snapper.open('left');
                }
                $timeout.cancel(hoverTimer);
            };

            scope.closeMenu = function() {
                if (snapper.state().state === 'left') {
                    snapper.close();
                }
                $timeout.cancel(hoverTimer);
            };
        }
    };
}]);

