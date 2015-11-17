exports.config = {
    seleniumAddress: 'http://localhost:4444/wd/hub',
    specs: ['protractor-test.js'],
    onPrepare: function() {
        var disableNgAnimate = function() {
            angular.module('disableNgAnimate', []).run(function($animate) {
                $animate.enabled(false);
            });
            browser.addMockModule('disableNgAnimate', disableNgAnimate);
        }
    }
};