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
var Style = require('../models/Style');
var cache = require('../lib/cache');

router.get('/', function(req, res, next) {
    Style.getAllStyles().then(function(result) {
        res.json(result);
    });
});

router.get('/:styleId', function(req, res, next) {
    Style.getStyle(req.params.styleId).then(function(result) {
        res.json(result);
    });
});

router.post('/', function(req, res, next) {
    Style.postStyle(req.body.enabled, req.body.styleId, req.body.styleContent, req.body.styleType).then(function (result) {
        cache.flush();
        res.json(204);
    });
});

router.post('/addStyle', function(req, res, next) {
    Style.addStyle(req.body.styleType, req.body.styleName).then(function (result) {
        res.json(result._doc);
    });
});

router.post('/deleteStyle', function(req, res, next) {
    Style.deleteStyle(req.body.styleId).then(function (result) {
        res.json(204);
    });
});

module.exports = router;