var request = require('supertest');
var app = require('../../../app');
var Script = require('../../../server/models/Scripts');

var _scriptName = 'route-test-script';
var _scriptId;

describe('Script Route Tests', function() {
    beforeEach(function(done) {
        request(app)
            .post('/api/scripts/addScript')
            .send({
                scriptType: 'code',
                scriptName: _scriptName
            })
            .expect(200)
            .expect(function(result) {
                _scriptId = result.body._id;
            })
            .end(done);
    });

    afterEach(function(done) {
        request(app)
            .post('/api/scripts/deleteScript')
            .send({
                scriptId: _scriptId
            })
            .expect(200)
            .end(done);
    });

    it('should get scripts', function(done) {
        request(app)
            .get('/api/scripts/')
            .expect(200)
            .expect(function(result) {
                var body = result.body;
                if (body.length > 0) {
                    return true;
                } else {
                    throw new Error('Error');
                }
            })
            .end(done);
    });

    it('should get created script', function(done) {
        request(app)
            .get('/api/scripts/' + _scriptId)
            .expect(200)
            .expect(function(result) {
                var body = result.body;
                if (body._id === _scriptId) {
                    return true;
                } else {
                    throw new Error('Error');
                }
            })
            .end(done);
    });

    it('should modify script', function(done) {
        request(app)
            .post('/api/scripts/')
            .send({
                styleId: _scriptId,
                enabled: true,
                styleContent: 'test',
                styleType: 'code'
            })
            .expect(200)
            .end(done);
    });
});
