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

var app = angular.module('yeti', [
    'ui.router',
    'ngCookies',
    'ngMaterial',
    'wu.masonry',
    'ui.ace',
    'LocalStorageModule'
]);

app.config([
    '$stateProvider',
    '$urlRouterProvider',
    '$mdThemingProvider',
    'localStorageServiceProvider',
    function(
        $stateProvider,
        $urlRouterProvider,
        $mdThemingProvider,
        localStorageServiceProvider
    ) {
        $mdThemingProvider.definePalette('yeti', {
            '50': 'f8f8f8',
            '100': '333333',
            '200': '0d47a1',
            '300': '0d47a1',
            '400': '0d47a1',
            '500': '0d47a1',
            '600': '0d47a1',
            '700': '0d47a1',
            '800': '333333',
            '900': '0d47a1',
            'A100': '0d47a1',
            'A200': '0d47a1',
            'A400': '0d47a1',
            'A700': '0d47a1',
            'contrastDefaultColor': 'light'
        });
        $mdThemingProvider.theme('default')
            .primaryPalette('yeti', {
                'default': '800'
            });

        localStorageServiceProvider
            .setPrefix('yeti');

        $urlRouterProvider.otherwise('/');

        $stateProvider
            .state('home', {
                url:'/',
                templateUrl: '/javascript/app/admin/admin.html',
                controller: 'adminController'
            })
            .state('users', {
                url:'/users',
                templateUrl: '/javascript/app/users/users.html',
                controller: 'userController'
            })
            .state('login', {
                url:'/login',
                templateUrl: '/javascript/app/login/login.html',
                controller: 'loginController'
            })
            .state('changepass', {
                url:'/changepass',
                templateUrl: '/javascript/app/changepass/changepass.html',
                controller: 'changepassController'
            })
            .state('views', {
                url:'/views',
                templateUrl: '/javascript/app/views/views.html',
                controller: 'viewsController',
                params: {
                    viewId: { value: null }
                }
            })
            .state('blocks', {
                url:'/blocks',
                templateUrl: '/javascript/app/blocks/blocks.html',
                controller: 'blocksController',
                params: {
                    blockId: { value: null }
                }
            })
            .state('posts', {
                url:'/posts',
                templateUrl: '/javascript/app/posts/posts.html',
                controller: 'postsController',
                params: {
                    postId: { value: null }
                }
            })
            .state('styles', {
                url:'/styles',
                templateUrl: '/javascript/app/styles/styles.html',
                controller: 'stylesController',
                params: {
                    styleId: { value: null }
                }
            })
            .state('scripts', {
                url:'/scripts',
                templateUrl: '/javascript/app/scripts/scripts.html',
                controller: 'scriptsController',
                params: {
                    scriptId: { value: null }
                }
            })
            .state('gallery', {
                url:'/gallery',
                templateUrl: '/javascript/app/gallery/gallery.html',
                controller: 'galleryController'
            })
}])
.run([
    '$rootScope',
    '$state',
    'userService',
    function(
        $rootScope,
        $state,
        userService
    ) {
        $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState) {
            $state.previous = fromState;
            $rootScope.current = toState.name.charAt(0).toUpperCase() + toState.name.slice(1);

            userService.refreshAuth().catch(function() {
                $state.go('login');
            });
        });
}]);


var dragSource;

function dragLeave(div, event) {
    div.style.opacity = 1;
}
function dragOver(div, event) {
    div.style.opacity = 0.3;
    event.preventDefault();
}
function dragStart(div, event) {
    dragSource = div;
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('text/html', div.innerHTML);
}
function dragDrop(div, event) {
    div.style.opacity = 1;
    if (event.stopPropogation) {
        event.stopPropogation();
    }

    if (dragSource != div) {
        var oldId = dragSource.id;
        dragSource.innerHTML = div.innerHTML;
        dragSource.id = div.id;
        div.id = oldId;
        div.innerHTML = event.dataTransfer.getData('text/html');
    }

    return false;
}
function deleteBlock(div) {
    var viewContent = '';
    _.forEach(document.getElementById('viewEditor').childNodes, function(block) {
        if (block.id !== div) {
            viewContent += '{{-' + block.id + '}}\n';
        }
    });
    angular.element($('#viewEditor')).scope().deleteBlock(viewContent);
}
function editBlock(blockId) {
    angular.element($('#viewEditor')).scope().editBlock(blockId);
}

$(document).on('keydown', function(e) {
    if (e.metaKey && e.which === 83) {
        e.preventDefault();
        angular.element($('#mainBody')).scope().saveKeyPressed();
        return false;
    }
});
