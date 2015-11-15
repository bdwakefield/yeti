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
var StyleSchema = require('./StyleSchema');
var Style = mongoose.model('Style', StyleSchema, config.collections.styles);
var cache = require('../lib/cache');
var Q = require('q');
var _ = require('lodash');

Style.getAllStyles = function() {
    var cachedStyle = cache.get('allStyle');

    if (cachedStyle) {
        return Q(cachedStyle);
    } else {
        return Style.find().lean().exec(function (err, style) {
            if (err) return err;

            cache.set('allStyle', style);
            return style;
        });
    }
};

Style.getStyle = function(style) {
    var ObjectId = mongoose.Types.ObjectId;

    var cachedStyle = cache.get(style);

    if (cachedStyle) {
        return Q(cachedStyle);
    } else {
        return Style.findOne({"_id": ObjectId(style)}, function (err, result) {
            if (err) return Q.reject(err);

            var bodyContent = result || {body: {content: '<h3>Style ' + style + ' is missing.</h3>'}};
            var cachedStyle = _.find(cache.get('allStyle'), {'_id': ObjectId(style)});
            bodyContent.styleType = _.result(cachedStyle, 'type');
            bodyContent.enabled = _.result(cachedStyle, 'enabled');

            cache.set(style, bodyContent);
            return bodyContent;
        });
    }
};

Style.postStyle = function(enabled, styleId, styleContent, styleType) {
    return Style.findOneAndUpdate({_id: styleId},{
        $set: {
            enabled: enabled,
            type: styleType,
            content: styleContent
        }
    }, {
        safe: true,
        upsert: true,
        new: true
    });
};

Style.addStyle = function(styleType, styleName) {
    var style = new Style({
        enabled: true,
        type: styleType,
        title: styleName,
        content: ''
    });
    return style.save(function(err) {
        if (err) return Q.reject(err);

        cache.flush();
        return style;
    });
};

Style.deleteStyle = function(styleId) {
    return Style.find({_id:styleId}).remove().then(function(result) {
        cache.flush();
        return result;
    });
};

module.exports = Style;