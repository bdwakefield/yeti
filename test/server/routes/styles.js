var request = require('supertest');
var app = require('../../../app');
var Style = require('../../../server/models/Style');

var _styleName = 'route-test-style';
var _styleId;

describe('Style Route Tests', function() {
    beforeEach(function(done) {
        request(app)
            .post('/api/styles/addStyle')
            .send({
                styleType: 'code',
                styleName: _styleName
            })
            .expect(200)
            .expect(function(result) {
                _styleId = result.body._id;
            })
            .end(done);
    });

    afterEach(function(done) {
        request(app)
            .post('/api/styles/deleteStyle')
            .send({
                styleId: _styleId
            })
            .expect(200)
            .end(done);
    });

    it('should get styles', function(done) {
        request(app)
            .get('/api/styles/')
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

    it('should get created style', function(done) {
        request(app)
            .get('/api/styles/' + _styleId)
            .expect(200)
            .expect(function(result) {
                var body = result.body;
                if (body._id === _styleId) {
                    return true;
                } else {
                    throw new Error('Error');
                }
            })
            .end(done);
    });

    it('should modify style', function(done) {
        request(app)
            .post('/api/styles/')
            .send({
                styleId: _styleId,
                enabled: true,
                styleContent: 'test',
                styleType: 'code'
            })
            .expect(200)
            .end(done);
    });
});
