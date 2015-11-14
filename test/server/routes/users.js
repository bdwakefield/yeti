var request = require('supertest-as-promised');
var app = require('../../../app');
var User = require('../../../server/models/User');
var crypt = require('../../../server/lib/crypt');

describe('User Route Tests', function() {
    var _userId;

    beforeEach(function(done) {
        request(app)
            .post('/api/users/register/')
            .send({
                username: 'testUser',
                email: 'test@email.com',
                password: 'password'
            })
            .expect(200)
            .expect(function(result) {
                _userId = result.body._id;
            })
            .end(done);
    });

    afterEach(function(done) {
        deleteUser(_userId).then(function() {
            done();
        });
    });

    it('should get all users', function(done) {
        request(app)
            .get('/api/users/')
            .expect(200)
            .end(done);
    });

    it('should create new user and delete it', function(done) {
        return request(app)
            .post('/api/users/')
            .send({
                username: 'testUser2',
                password: 'pass'
            })
            .expect(200)
            .expect(function(result) {
                var body = result.body;
                if (body._id && body.username === 'testUser2') {
                    return body._id;
                } else {
                    throw new Error('Error');
                }
            })
            .then(function(result) {
                request(app)
                    .post('/api/users/delete/' + result.body._id)
                    .expect(200)
                    .end(done);
            });
    });

    it('should verify user', function(done) {
        request(app)
            .post('/api/users/verify')
            .send({
                username: 'testUser',
                password: 'password'
            })
            .expect(200)
            .expect(function(result) {
                var body = result.body;
                if (body.token && body.success) {
                    return true;
                } else {
                    throw new Error('Error');
                }
            })
            .end(done);
    });

    it('should fail to verify user', function(done) {
        request(app)
            .post('/api/users/verify')
            .send({
                username: 'testUser',
                password: 'badpass'
            })
            .expect(401)
            .end(done);
    });

    it('should verify token', function(done) {
        return request(app)
            .post('/api/users/verify')
            .send({
                username: 'testUser',
                password: 'password'
            })
            .expect(200)
            .then(function(result) {
                return request(app)
                    .post('/api/users/verifyToken')
                    .send({
                        token: result.body.token
                    })
                    .expect(200);
            })
            .then(function(result) {
                if (result.status === 200) {
                    done();
                } else {
                    throw new Error('Error');
                }
            });
    });

    it('should reject token', function(done) {
        return request(app)
            .post('/api/users/verify')
            .send({
                username: 'testUser',
                password: 'password'
            })
            .expect(200)
            .then(function() {
                return request(app)
                    .post('/api/users/verifyToken')
                    .send({
                        token: 'badtoken'
                    })
                    .expect(401);
            })
            .then(function(result) {
                if (result.status === 401) {
                    done();
                } else {
                    throw new Error('Error');
                }
            });
    });

    it('should change password', function(done) {
        return request(app)
            .post('/api/users/changepass')
            .send({
                username: 'testUser',
                oldpassword: 'password',
                newpassword: 'newpass'
            })
            .expect(200)
            .end(done);
    });

    it('should fail to change password because of bad password', function(done) {
        return request(app)
            .post('/api/users/changepass')
            .send({
                username: 'testUser',
                oldpassword: 'badpass',
                newpassword: 'newpass'
            })
            .expect(401)
            .end(done);
    });
});

function deleteUser(userId) {
    return User.find({
        _id: userId
    }).remove().exec();
}