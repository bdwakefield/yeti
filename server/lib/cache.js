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

var NodeCache = require( "node-cache" );
var cache = new NodeCache();

module.exports = {
    get: key => cache.get(key),
    set: (key, val) => cache.set(key, val),
    del: key => cache.del(key),
    flush: () => cache.flushAll(),
    list: () => cache.keys(),
    stats: () => cache.getStats()
};