'use strict';

var config = require('../config/index');
var mongoose = require('mongoose');
var SettingsSchema = require('./SettingsSchema');
var Settings = mongoose.model(config.collections.settings, SettingsSchema);
var Q = require('q');
var cache = require('../lib/cache');
var ObjectId = require('mongodb').ObjectId;

module.exports = Settings;