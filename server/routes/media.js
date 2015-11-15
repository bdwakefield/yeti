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

var express = require('express');
var router = express.Router();
var config = require('../config/index');
var Media = require('../models/Media');
var multer  = require('multer');

var upload = multer({
    inMemory: true
});

router.get('/', function(req, res, next) {
    Media.getMediaList().then(function(result) {
        res.json(result);
    });
});

router.get('/editorList', function(req, res, next) {
    Media.getMediaEditorList().then(function(result) {
        res.json(result);
    });
});

router.get('/getImg/:id', function(req, res, next) {
    Media.getMedia(req.params.id).then(function(result) {
        res.writeHead(200, {'Content-Type': 'image/png' });
        res.end(result.media_data.toString('utf-8'), 'binary');
    });
});

router.get('/getThumb/:id', function(req, res, next) {
    Media.getMedia(req.params.id).then(function(result) {
        res.writeHead(200, {'Content-Type': 'image/png' });
        res.end(result.thumbnail_data.toString('utf-8'), 'binary');
    });
});

router.post('/', function(req, res, next) {
    var data = new Buffer(req.body.media_data, 'binary');
    Media.postMedia(req.body.file_name, data).then(function(result) {
        res.json(204);
    }).catch(function(err) {
        res.json(500);
    });
});

router.post('/editorUpload', upload.single('file'), function(req, res, next) {
    var data = new Buffer(req.file.buffer, 'binary');
    Media.postMedia(req.file.originalname, data).then(function(result) {
        res.json({
            link: '/images/' + req.file.originalname
        });
    }).catch(function(err) {
        res.json(500);
    });
});

router.post('/deleteImg', function(req, res, next) {
    Media.deleteMedia(req.body.fileName).then(function() {
        res.json(204);
    }).catch(function(err) {
        res.json(500);
    });
});

module.exports = router;