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

app.factory('blockService', [
    '$q',
    '$http',
    function(
        $q,
        $http
    ) {
        var blockService = {};
        var blocks;
        var selectedBlockId;

        blockService.setSelectedBlockId = function(blockId) {
            selectedBlockId = blockId;
        };

        blockService.getSelectedBlockId = function() {
            return selectedBlockId;
        };

        blockService.setBlocks = function() {
            return fetchBlocks();
        };

        blockService.getBlocks = function(cacheBuster) {
            if (!blocks || cacheBuster) {
                return fetchBlocks().then(function(result) {
                    return blocks;
                });
            } else {
                return $q.when(blocks);
            }
        };

        blockService.getBlockById = function(blockId) {
            return _.find(blocks, {
                _id: blockId
            });
        };

        function fetchBlocks() {
            return $http.get('/api/blocks').then(function (result) {
                blocks = result.data;
                return blocks;
            }).catch(function (err) {
                console.log(err);
            });
        }

        return blockService;
}]);