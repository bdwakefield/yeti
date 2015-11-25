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
var fs = require('fs');
var Styles = require('../models/Style');
var Scripts = require('../models/Scripts');
var View = require('../models/View');
var Block = require('../models/Block');
var Posts = require('../models/Post');
var Uglify = require("uglify-js");
var inq = require('inquirer');
var Q = require('q');
var _ = require('lodash');
var crypt = require('./crypt');
var User = require('../models/User');

var utils = {};
var env = process.env.NODE_ENV || 'default';

utils.buildDbPath = function() {
    return this.readConfig().then(function(config) {
        return util.format('%s:%s/%s', config.dbServer, config.dbPort, config.dbDatabase);
    });
};

utils.obfuscateJs = function(code) {
    var ast = Uglify.parse(code);
    var compress = Uglify.Compressor();
    ast.figure_out_scope();
    ast = ast.transform(compress);
    ast.figure_out_scope();
    ast.compute_char_frequency();
    ast.mangle_names();
    return Uglify.minify(ast.print_to_string(), {fromString: true}).code;
};

utils.buildPage = function(viewId, params) {
    var bodyContent;

    return Styles.getAllStyles().then(function(result) {
        var styleContent = '<style>';
        var linkContent = '';
        _.each(result, function(style) {
            if (style.enabled && ~style.appliedTo.indexOf(viewId.toString())) {
                var code = style.content;

                if (style.type === 'code') {
                    styleContent += code;
                } else if (style.type === 'link') {
                    linkContent += '<link rel="stylesheet" href="' + code + '">';
                }
            }
        });
        styleContent += '</style>';
        return linkContent + styleContent;
    }).then(function(styleContent) {
        var content = {
            styleContent: styleContent,
            scriptsContent: ''
        };
        return Scripts.getAllScripts().then(function (result) {
            var codeContent = '<script>';
            var linkContent = '';
            _.each(result, function (script) {
                if (script.enabled && ~script.appliedTo.indexOf(viewId.toString())) {
                    var code = script.content;

                    if (script.type === 'code') {
                        codeContent += utils.obfuscateJs(code);
                    } else if (script.type === 'link') {
                        linkContent += '<script src="' + code + '"></script>';
                    }
                }
            });

            codeContent += '</script>';
            content.scriptsContent = linkContent + codeContent;

            return content;
        });
    }).then(function(content) {
        return View.getView(viewId, params).then(function (result) {
            bodyContent = result;
            return {
                title: bodyContent.title,
                bodyContent: bodyContent,
                styleContent: content.styleContent.replace(/\n/g, ''),
                scriptsContent: content.scriptsContent
            };
        });
    });
};

utils.readConfig = function() {
    return Q(JSON.parse(fs.readFileSync(__dirname + '/../config/' + env + '.json')));
};

utils.writeConfig = function(config) {
    return Q(fs.writeFileSync(__dirname + '/../config/' + env + '.json', JSON.stringify(config, null, 4)));
};

utils.checkAndCreateUser = function() {
    var deferred = Q.defer();
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
                }).then(function(result) {
                    console.log('Created user');
                    deferred.resolve(result);
                });
            });
        } else {
            deferred.resolve();
        }
    }).catch(function (err) {
        deferred.reject(err);
    });

    return deferred.promise;
};

utils.buildQuestions = function(config) {
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
};

utils.insertSampleData = function() {
    var sampleBlock = fs.readFileSync(__dirname + '/../views/sample/sampleBlock.html', 'utf8');
    var sampleStyle = fs.readFileSync(__dirname + '/../views/sample/sample.css', 'utf8');
    var sampleScript = fs.readFileSync(__dirname + '/../views/sample/sample.js', 'utf8');
    var blockId;

    return Block.addBlock('Sample Block', 'content').then(function(result) {
        blockId = result._doc._id;
        return Block.postBlock({
            blockId: blockId,
            blockContent: sampleBlock
        });
    }).then(function() {
        View.addView('Sample View').then(function(result) {
            return View.postView(result._doc._id, '{{-' + blockId + '}}', '/sample', true);
        });
    }).then(function() {
        Styles.addStyle('code', 'Sample Style').then(function(result) {
            return Styles.postStyle(true, result._doc._id, sampleStyle, 'code');
        });
    }).then(function() {
        Scripts.addScript('code', 'Sample Script').then(function(result) {
            return Scripts.postScript(true, result._doc._id, sampleScript, 'code');
        })
    }).catch(function(err) {
        return Q.reject(err);
    })
};

function structureQuestion(type, name, message, validateFn) {
    return {
        type: type,
        name: name,
        message: message,
        validate: validateFn
    };
}

module.exports = utils;