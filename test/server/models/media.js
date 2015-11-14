var assert = require('assert');
var Media = require('../../../server/models/Media');
var fs = require('fs');

describe('Media Model Tests', function() {
    it('should get media list', function() {
        Media.getMediaList().then(function(result) {
            assert(result.length > 0);
        });
    });

    it('should get media list for editor', function() {
        Media.getMediaEditorList().then(function(result) {
            assert(result.length > 0);
        });
    });
});
