var Q = require('q');
var User = require('../../server/models/User');
var Block = require('../../server/models/Block');
var Post = require('../../server/models/Post');
var Script = require('../../server/models/Scripts');
var Style = require('../../server/models/Style');
var View = require('../../server/models/View');

var promises = [
    User.find({}).remove(),
    Block.find({}).remove(),
    Post.find({}).remove(),
    Script.find({}).remove(),
    Style.find({}).remove(),
    View.find({}).remove()
];

before(function(done) {
    Q.all(promises).then(function() {
        done();
    });
});