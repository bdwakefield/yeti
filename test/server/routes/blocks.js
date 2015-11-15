var request = require('supertest');
var app = require('../../../app');
var Block = require('../../../server/models/Block');

var _blockName = 'route-test-block';
var _blockId;

describe('Block Route Tests', function() {
    beforeEach(function(done) {
        request(app)
            .post('/api/blocks/addBlock')
            .send({
                blockName: _blockName,
                blockType: 'content'
            })
            .expect(200)
            .expect(function(result) {
                _blockId = result.body._id;
            })
            .end(done);
    });

    afterEach(function(done) {
        request(app)
            .post('/api/blocks/deleteBlock')
            .send({
                blockId: _blockId
            })
            .expect(200)
            .end(done);
    });

    it('should get blocks', function(done) {
        request(app)
            .get('/api/blocks/')
            .expect(200)
            .expect(function(result) {
                var body = result.body;
                if (body.length > 0) {
                    return true;
                } else {
                    throw new Error('Could not fetch views');
                }
            })
            .end(done);
    });

    it('should get created block', function(done) {
        request(app)
            .get('/api/blocks/' + _blockId)
            .expect(200)
            .expect(function(result) {
                var body = result.body;
                if (body._id === _blockId) {
                    return true;
                } else {
                    throw new Error('Could not fetch views');
                }
            })
            .end(done);
    });

    it('should modify blog post block', function(done) {
        request(app)
            .post('/api/blocks/')
            .send({
                blockId: _blockId,
                numPosts: 15,
                displayTitles: true,
                displayedCategories: 'test'
            })
            .expect(200)
            .end(done);
    });

    it('should modify content post block', function(done) {
        request(app)
            .post('/api/blocks/')
            .send({
                blockId: _blockId,
                blockContent: 'content'
            })
            .expect(200)
            .end(done);
    });
});
