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
var View = require('../models/View');

router.get('/edit', function(req, res) {
    View.getViewsForEdit().then(function(result) {
        res.json(result);
    });
});

router.get('/:viewId', function(req, res) {
    View.getView(req.params.viewId).then(function(result) {
        res.json(result);
    });
});

router.get('/edit/:viewId', function(req, res) {
    View.getViewForEdit(req.params.viewId).then(function(result) {
        res.json(result);
    });
});

router.post('/', function(req, res) {
    View.postView(req.body.viewId, req.body.viewContent, req.body.viewRoute, req.body.viewIsDefault).then(function(result) {
        res.json(result);
    });
});

router.post('/addView', function(req, res) {
    View.addView(req.body.viewName).then(function(result) {
        res.json(result);
    });
});

router.post('/deleteView', function(req, res) {
    View.deleteView(req.body.viewId).then(function (result) {
        res.json(result);
    });
});

module.exports = router;