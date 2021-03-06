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

var fs = require('fs');
var path = require('path');
var express = require('express');
var router = express.Router();
var View = require('../models/View');
var Styles = require('../models/Style');
var Scripts = require('../models/Scripts');
var utils = require('../lib/utils');
var _ = require('lodash');

// Default view for root index page
router.get('/', function(req, res, next) {
    var defaultViewId;

    View.getDefaultViewId().then(function(result) {
        defaultViewId = result;
        utils.buildPage(defaultViewId).then(function(result){
            res.render('index', result);
        });
    });
});

// All custom defined routes by the user
router.get('/*', function(req, res) {
    var params = req.query;
        View.getRoutes().then(function (result) {
            var reqRoute = _.find(result, {'route': '/' + req.params[0]});
            if (reqRoute) {
                utils.buildPage(reqRoute._id, params).then(function (result) {
                    res.render('index', result);
                });
            } else {
                res.render('index', {
                    bodyContent: '404 Route Not Found.'
                });
            }
        });
});

module.exports = router;