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
var Scripts = require('../models/Scripts');
var cache = require('../lib/cache');

router.get('/', function(req, res, next) {
    Scripts.getAllScripts().then(function(result) {
        res.json(result);
    });
});

router.get('/:scriptId', function(req, res, next) {
    Scripts.getScript(req.params.scriptId).then(function(result) {
        res.json(result);
    });
});

router.post('/', function(req, res, next) {
    Scripts.postScript(req.body.enabled, req.body.scriptId, req.body.scriptContent, req.body.scriptType).then(function (result) {
        cache.flush();
        res.json(204);
    });
});

router.post('/addScript', function(req, res, next) {
    Scripts.addScript(req.body.scriptType, req.body.scriptName).then(function (result) {
        res.json(result._doc);
    });
});

router.post('/deleteScript', function(req, res, next) {
    Scripts.deleteScript(req.body.scriptId).then(function (result) {
        res.json(204);
    });
});

module.exports = router;