var assert = require('assert');
var crypt = require('../../../server/lib/crypt');
var User = require('../../../server/models/User');

describe('User Model Tests', function() {
    var _userId;

    beforeEach(function(done) {
        User.create({
            username: 'testUser',
            email: 'test@email.com',
            hash: crypt.crypt('password')
        }).then(function(result) {
            _userId = result._doc._id;
            done();
        });
    });

    afterEach(function(done) {
        User.find({
            _id: _userId
        }).remove().exec(function () {
            done();
        });
    });

    it('should verify user', function() {
        return User.findOne({ username: 'testUser' }).then(function(result) {
            assert(User.verify('password', result.hash));
        });
    });

    it('should get all users', function() {
        return User.getAllUsers().then(function(result) {
            assert(result.length > 0);
        });
    });
});
