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

var config = require('../config/index');
var mongoose = require('mongoose');
var ScriptsSchema = require('./ScriptsSchema');
var Scripts = mongoose.model('Scripts', ScriptsSchema, config.collections.scripts);
var cache = require('../lib/cache');
var Q = require('q');
var _ = require('lodash');

Scripts.getAllScripts = function() {
    var cachedScripts = cache.get('allScripts');

    if (cachedScripts) {
        return Q(cachedScripts);
    } else {
        return Scripts.find().lean().exec(function (err, scripts) {
            if (err) return err;

            cache.set('allScripts', scripts);
            return scripts;
        });
    }
};

Scripts.getScript = function(script) {
    var ObjectId = mongoose.Types.ObjectId;

    var cachedScripts = cache.get(script);

    if (cachedScripts) {
        return Q(cachedScripts);
    } else {
        return Scripts.findOne({"_id": ObjectId(script)}, function (err, result) {
            if (err) return Q.reject(err);

            var bodyContent = result || {body: {content: '<h3>Script ' + script + ' is missing.</h3>'}};
            var cachedScript = _.find(cache.get('allScripts'), {'_id': ObjectId(script)});
            bodyContent.scriptType = _.result(cachedScript, 'type');
            bodyContent.enabled = _.result(cachedScript, 'enabled');

            cache.set(script, bodyContent);
            return bodyContent;
        });
    }
};

Scripts.postScript = function(enabled, scriptId, scriptContent, scriptType) {
    return Scripts.findOneAndUpdate({
        _id: scriptId
    },{
        $set: {
            enabled: enabled,
            type: scriptType,
            content: scriptContent
        }
    }, {
        safe: true,
        upsert: true,
        new: true
    });
};

Scripts.addScript = function(scriptType, scriptName) {
    var scripts = new Scripts({
        enabled: true,
        type: scriptType,
        title: scriptName,
        content: ''
    });
    return scripts.save(function(err) {
        if (err) return Q.reject(err);

        cache.flush();
        return scripts;
    });
};

Scripts.deleteScript = function(scriptId) {
    return Scripts.find({_id:scriptId}).remove().then(function(result) {
        cache.flush();
        return result;
    });
};

module.exports = Scripts;