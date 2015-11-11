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