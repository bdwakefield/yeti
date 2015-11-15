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

app.factory('scriptService', [
    '$q',
    '$http',
    function(
        $q,
        $http
    ) {
        var scriptService = {};
        var scripts;
        var selectedScriptId;

        scriptService.setSelectedScriptId = function(scriptId) {
            selectedScriptId = scriptId;
        };

        scriptService.getSelectedScriptId = function() {
            return selectedScriptId;
        };

        scriptService.setScripts = function() {
            return fetchScripts();
        };

        scriptService.getScripts = function(cacheBuster) {
            if (!scripts || cacheBuster) {
                return fetchScripts().then(function(result) {
                    return scripts;
                });
            } else {
                return $q.when(scripts);
            }
        };

        scriptService.getScriptById = function(scriptId) {
            return _.find(scripts, {
                _id: scriptId
            });
        };

        function fetchScripts() {
            return $http.get('/api/scripts').then(function (result) {
                scripts = result.data;
                return scripts;
            }).catch(function (err) {
                console.log(err);
            });
        }

        return scriptService;
}]);