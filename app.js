#!/usr/bin/env node

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

var util = require('util');
var path = require('path');
var express = require('express');
var cookieParser = require('cookie-parser');
var compress = require('compression');
var bodyParser = require('body-parser');
var cors = require('cors');
var http = require('http');
var inq = require('inquirer');
var favicon = require('serve-favicon');
var _ = require('lodash');
var Q = require('q');
var sassMiddleware = require('node-sass-middleware');
var routes = require('./server/routes/index');
var admin = require('./server/routes/admin');
var users = require('./server/routes/user');
var views = require('./server/routes/view');
var blocks = require('./server/routes/block');
var posts = require('./server/routes/post');
var settings = require('./server/routes/settings');
var media = require('./server/routes/media');
var styles = require('./server/routes/style');
var scripts = require('./server/routes/scripts');
var db = require('./server/lib/db');
var utils = require('./server/lib/utils');
var crypt = require('./server/lib/crypt');
var Style = require('./server/models/Style');
var User = require('./server/models/User');
var Scripts = require('./server/models/Scripts');

var app = express();
var server = http.createServer(app);

var config = {};

var env = process.env.NODE_ENV || 'default';

if (env === 'test') {
    db.connect().then(function() {
        startServer();
    });
} else {
    utils.readConfig().then(function (result) {
        config = result;
    }).then(function () {
        return utils.buildQuestions(config);
    }).then(function (questions) {
        if (questions.length > 0) {
            inq.prompt(questions, function (answers) {
                config.port = +answers.nodePort;
                config.dbServer = 'mongodb://' + answers.dbServer;
                config.dbPort = +answers.dbPort;
                config.dbDatabase = answers.dbDatabase;
                utils.writeConfig(config).then(function () {
                    connectDb().then(function() {
                        utils.insertSampleData().then(function() {
                            startServer();
                        });
                    });
                });
            });
        } else {
            connectDb().then(function() {
                startServer();
            });
        }
    });
}

function connectDb() {
    var deferred = Q.defer();
    db.connect().then(function () {
        utils.checkAndCreateUser().then(function (result) {
            deferred.resolve(result);
        });
    }).catch(function (err) {
        console.log('ERROR: Could not connect to mongo server, please correct this in the configuration file and check to make sure NODE_ENV environment variable is defined.\n' + err.name + ': ' + err.message);
        deferred.reject(err);
        process.exit();
    });
    return deferred.promise;
}

function startServer() {
    server.listen(config.port);
    server.on('error', function (err) {
        console.error(err);
    });
    server.on('listening', function () {
        console.log(util.format('Listening on port %s', config.port));
    });

    app.set('views', path.join(__dirname, 'server/views'));
    app.set('view engine', 'jade');
    app.use(compress({
        threshold: 0
    }));

    app.use(bodyParser.json({limit: '50mb'}));
    app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
    app.use(cookieParser());

    //app.use(favicon(path.join(__dirname, 'client', 'images', 'favicon.ico')));

    app.use(sassMiddleware({
        src: path.join(__dirname, 'server/styles'),
        dest: path.join(__dirname, 'client/app/styles'),
        outputStyle: 'compressed',
        indentedSyntax: true,
        //debug: true,
        prefix:  '/app/styles'
    }));

    app.use('/node_modules', express.static(path.join(__dirname, 'node_modules')));
    app.use('/admin', admin);
    app.get('/admin/*', function(req, res) {
        res.render('admin', {
            layout: 'adminLayout.jade'
        });
    });
    app.use('/api/users', users);
    app.use('/api/views', views);
    app.use('/api/blocks', blocks);
    app.use('/api/posts', posts);
    app.use('/api/settings', settings);
    app.use('/api/media', media);
    app.use('/api/styles', styles);
    app.use('/api/scripts', scripts);
    app.use(express.static(path.join(__dirname, 'client')));
    app.use('/', routes);

    //app.locals.pretty = true;

    app.use(function (req, res, next) {
        var err = new Error('Not Found: ' + req.url);
        err.status = 404;
        next(err);
    });
}

module.exports = app;
