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