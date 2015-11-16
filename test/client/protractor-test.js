var fs = require('fs');
Utils = {

    /**
     * @name screenShotDirectory
     * @description The directory where screenshots will be created
     * @type {String}
     */
    screenShotDirectory: './',

    /**
     * @name writeScreenShot
     * @description Write a screenshot string to file.
     * @param {String} data The base64-encoded string to write to file
     * @param {String} filename The name of the file to create (do not specify directory)
     */
    writeScreenShot: function (data, filename) {
        var stream = fs.createWriteStream(this.screenShotDirectory + filename);

        stream.write(new Buffer(data, 'base64'));
        stream.end();
    }

};

var _userName = 'thom';
var _password = 'pass';

describe('Protractor Tests', function() {
    it('should login and go to home screen', function() {
        browser.get('http://localhost:3000/admin/');

        element(by.model('inputUser')).sendKeys(_userName);
        element(by.model('inputPassword')).sendKeys(_password);

        element(by.css('[type="submit"]')).click();

        element(by.binding('current')).getText().then(function(result) {
            expect(result).toBe('YetiJS [Home]');
        });
    });

    it('should navigate to users', function() {
        browser.actions().mouseMove(element(by.css('[id="yetiIcon"]'))).perform();
        element(by.css('[href="/admin/#/users"]')).click();

        element(by.binding('current')).getText().then(function(result) {
            expect(result).toBe('YetiJS [Users]');
        });
    });

    it('should check if we are listed in users', function() {
        element.all(by.repeater('user in userList')).then(function(users) {
            users[0].element(by.binding('user.username')).getText().then(function(result) {
                expect(result).toBe(_userName);
            });
        });
    });
        //browser.takeScreenshot().then(function (png) {
        //    Utils.writeScreenShot(png, 'test.png');
        //});
});
