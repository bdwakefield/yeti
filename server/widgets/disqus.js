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

var _ = require('lodash');
var Q = require('q');

module.exports = {
    export: function(caller) {
        var output = '<div id="disqus_thread"></div>' +
            '<script>' +
            'var disqus_config = function () {' +
            //'this.page.url = "' + caller.title.replace(' ','') + '";' +
            'this.page.identifier = "' + caller._id.toString() + '";' +
            '};' +
            '(function() {' +
            'var d = document, s = d.createElement("script");' +
            's.src = "//thomrichardsonblog.disqus.com/embed.js";' +
            's.setAttribute("data-timestamp", +new Date());' +
            '(d.head || d.body).appendChild(s);' +
            '})();' +
            '</script>;';
        return Q(output);
    }
};
