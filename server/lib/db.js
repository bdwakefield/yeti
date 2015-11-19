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

var Q = require('q');
var utils = require('./utils');
var mongoose = require('mongoose');

var connectionOptions = {
    server: {
        socketOptions: {
            keepAlive: 1,
            connectTimeoutMS: 5000
        }
    }
};

module.exports = {
    connect: function() {
        var deferred = Q.defer();

        utils.buildDbPath().then(function(path) {
            mongoose.connect(path, connectionOptions ,function(err) {
                if (err) deferred.reject(err);

                deferred.resolve();
            });
        });

        return deferred.promise;
    },
    connected: function() {
        return mongoose.connection.readyState;
    }
};
