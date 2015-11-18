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
var inq = require('inquirer');
var favicon = require('serve-favicon');
var _ = require('lodash');
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

utils.readConfig().then(function(result) {
    config = result;
}).then(function() {
    return buildQuestions(config);
}).then(function(questions) {
    if (questions.length > 0) {
        inq.prompt(questions, function (answers) {
            config.port = +answers.nodePort;
            config.dbServer = 'mongodb://' + answers.dbServer;
            config.dbPort = +answers.dbPort;
            config.dbDatabase = answers.dbDatabase;
            utils.writeConfig(config).then(function() {
                connectDb();
            });
        });
    } else {
        connectDb();
    }
});

function buildQuestions(config) {
    var questions = [];
    if (!config.port) {
        questions.push(structureQuestion(
            'input',
            'nodePort',
            'What port do you want the server to run on?',
            function(answer) {
                if (answer <= 1024) {
                    return 'You can not use a port below port 1024 as a non-root user.';
                }
                return true;
            }
        ));
    }
    if (!config.dbServer) {
        questions.push(structureQuestion(
            'input',
            'dbServer',
            'What is the address of your mongo server?',
            function(answer) {
                if (!answer) {
                    return 'Must use a valid IP or hostname.';
                }
                return true;
            }
        ));
    }
    if (!config.dbPort) {
        questions.push(structureQuestion(
            'input',
            'dbPort',
            'What is the port of your mongo server?',
            function(answer) {
                if (!answer.match(/^[0-9]*$/)) {
                    return 'Must use a valid port.';
                }
                return true;
            }
        ));
    }
    if (!config.dbDatabase) {
        questions.push(structureQuestion(
            'input',
            'dbDatabase',
            'What is the name of the database would you like to use?',
            function(answer) {
                if (!answer) {
                    return 'Must provide a database to use.';
                }
                return true;
            }
        ));
    }

    return questions;
}

function structureQuestion(type, name, message, validateFn) {
    return {
        type: type,
        name: name,
        message: message,
        validate: validateFn
    };
}

function connectDb() {
    db.connect().then(function () {
        checkAndCreateUser();
    }).catch(function (err) {
        console.log('ERROR: Could not connect to mongo server, please correct this in the configuration file and check to make sure NODE_ENV environment variable is defined.\n' + err.name + ': ' + err.message);
        process.exit();
    });
}

function checkAndCreateUser() {
    User.getAllUsers().then(function (result) {
        if (result.length === 0) {
            var questions = [
                structureQuestion(
                    'input',
                    'username',
                    'What user name do you want to use?',
                    function(answer) {
                        if (answer.length < 5) {
                            return 'You must enter a valid username';
                        }
                        return true;
                    }),
                structureQuestion(
                    'input',
                    'email',
                    'What is your email address?',
                    function(answer) {
                        if (!answer.match(/\S+@\S+/)) {
                            return 'You must enter a valid email';
                        }
                        return true;
                    }),
                structureQuestion(
                    'password',
                    'password',
                    'Please enter a password\n (Password must be 8 characters with at least 1 number and 1 special character)\n',
                    function(answer) {
                        if (!answer.match(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,}$/)) {
                            return 'Password must be 8 characters with at least 1 number and 1 special character'
                        }
                        return true;
                    })
            ];
            inq.prompt(questions, function (answers) {
                User.create({
                    username: answers.username,
                    email: answers.email,
                    hash: crypt.crypt(answers.password)
                }).then(function (result) {
                    console.log('Created user ' + answers.username);
                    startServer();
                });
            });
        } else {
            startServer();
        }
    }).catch(function (err) {
        console.log(err);
    });
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

    app.use(express.static(path.join(__dirname, 'client')));
    app.use(favicon(path.join(__dirname, 'client', 'images', 'favicon.ico')));
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

    app.use(function (req, res, next) {
        var err = new Error('Not Found: ' + req.url);
        err.status = 404;
        next(err);
    });
}

module.exports = app;
