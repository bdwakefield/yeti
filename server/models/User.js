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

var config = require('../config/index');
var mongoose = require('mongoose');
var UserSchema = require('./UserSchema');
var User = mongoose.model(config.collections.users, UserSchema);
var Q = require('q');
var _ = require('lodash');
var crypt = require('../lib/crypt');

User.verify = function(passWord, hash) {
    return crypt.decrypt(passWord, hash);
};

User.getAllUsers = function() {
    var deferred = Q.defer();
    User.find({}, function(err, users) {
        if (err) return err;
        deferred.resolve(_.map(users, function(result) {
            return {
                _id: result._id,
                username: result.username,
                email: result.email
            }
        }));
    });

    return deferred.promise;
};

module.exports = User;