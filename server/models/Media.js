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
var MediaSchema = require('./MediaSchema');
var img = require('imagemagick');
var path = require('path');
var fs = require('fs');
var Media = mongoose.model(config.collections.media, MediaSchema);
var Q = require('q');
var _ = require('lodash');

Media.getMediaList = function() {
    var deferred = new Q.defer();
    fs.readdir(path.resolve(__dirname, '../../client/images/'), function(err, files) {
        if (err) deferred.reject(err);
        var fileList = [];
        _.each(files, function(file) {
            if (_.includes(config.imageTypes, path.extname(file).replace('.',''))) {
                fileList.push(file);
            }
        });
        deferred.resolve(fileList);
    });
    return deferred.promise;
};

Media.getMediaEditorList = function() {
    var deferred = new Q.defer();
    fs.readdir(path.resolve(__dirname, '../../client/images/'), function(err, files) {
        if (err) deferred.reject(err);
        var fileList = [];
        _.each(files, function(file) {
            if (_.includes(config.imageTypes, path.extname(file).replace('.',''))) {
                fileList.push({
                    url: '/images/' + file,
                    thumb: '/images/thumbs/thumb_' + file,
                    tag: file
                });
            }
        });
        deferred.resolve(fileList);
    });
    return deferred.promise;
};

/* istanbul ignore next */
(Media.postMedia = function(fileName, mediaData) {
    var fullImagePath = path.resolve(__dirname, '../../client/images/' + fileName);
    var smallImagePath = path.resolve(__dirname, '../../client/images/thumbs/thumb_' + fileName);
    var deferred = new Q.defer();
    fs.writeFile(fullImagePath, mediaData, function(err) {
        if (err) deferred.reject(err);
        var media = new Media({
            file_name: fileName
        });
        resizeImage(fullImagePath, smallImagePath)
            .then(function() {
                media.save(function (err) {
                    if (err) deferred.reject(err);
                    deferred.resolve();
                });
            });
    });
    return deferred.promise;
}());

/* istanbul ignore next */
(Media.deleteMedia = function(fileName) {
    var fullImagePath = path.resolve(__dirname, '../../client/images/' + fileName);
    var smallImagePath = path.resolve(__dirname, '../../client/images/thumbs/thumb_' + fileName);

    var deferred = new Q.defer();
    fs.unlink(fullImagePath, function(err) {
        if (err) deferred.reject(err);
        fs.unlink(smallImagePath, function(err) {
            if (err) deferred.reject(err);
            deferred.resolve();
        });
    });
    return deferred.promise;
}());

/* istanbul ignore next */
function resizeImage(srcImg, destImg) {
    var deferred = new Q.defer();
    img.resize({
        srcPath: srcImg,
        dstPath: destImg,
        width: 250
    }, function(err, stdout) {
        if (err) return deferred.reject(err);
        return deferred.resolve(stdout);
    });

    return deferred.promise;
}

module.exports = Media;