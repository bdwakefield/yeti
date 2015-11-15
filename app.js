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
var http = require('http');
var favicon = require('serve-favicon');
var _ = require('lodash');
var config = require('./server/config');
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
var Style = require('./server/models/Style');
var Scripts = require('./server/models/Scripts');

var app = express();
var server = http.createServer(app);

db.connect();

server.listen(config.port);
server.on('error', function (err) {
    console.error(err);
});
server.on('listening', function() {
    console.log(util.format('Listening on port %s in environment \'%s\'.', config.port, process.env.NODE_ENV));
});

app.set('views', path.join(__dirname, 'server/views'));
app.set('view engine', 'jade');
app.use(compress({
    threshold: 0
}));
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'client')));
app.use(favicon(path.join(__dirname,'client','images','favicon.ico')));
app.use('/admin', admin);
app.use('/api/users', users);
app.use('/api/views', views);
app.use('/api/blocks', blocks);
app.use('/api/posts', posts);
app.use('/api/settings', settings);
app.use('/api/media', media);
app.use('/api/styles', styles);
app.use('/api/scripts', scripts);
app.use('/', routes);

//app.locals.pretty = true;

app.use(function(req, res, next) {
    var err = new Error('Not Found: ' + req.url);
    err.status = 404;
    next(err);
});

module.exports = app;
