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

var _userName = 'demo';
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

    it('should add a user', function() {
        element(by.css('[ng-click="showConfirm($event)"]')).click();

        element(by.model('inputUsername')).sendKeys('testUser');
        element(by.model('inputEmail')).sendKeys('test@user.com');
        element(by.model('inputPassword')).sendKeys('pass');

        element(by.css('[ng-click="userSubmit()"]')).click();

        element.all(by.repeater('user in userList')).then(function(users) {
            users[1].element(by.binding('user.username')).getText().then(function(result) {
                expect(result).toBe('testUser');
            });
        });
    });

    it('should delete added user', function() {
        element.all(by.repeater('user in userList')).then(function(users) {
            users[1].element(by.css('[ng-click="deleteUser($event, user._id)"]')).click();
            browser.getAllWindowHandles().then(function(handles) {
                browser.switchTo().window(handles[0]).then(function() {
                    element(by.css('[ng-click="dialog.hide()"]')).click();
                    browser.waitForAngular();
                    browser.getAllWindowHandles().then(function(handles) {
                        browser.switchTo().window(handles[0]);
                    });
                });
            });
        });
    });

    it('should verify user deleted', function() {
        element.all(by.repeater('user in userList')).then(function(users) {
            users[0].element(by.binding('user.username')).getText().then(function(result) {
                expect(result).toBe(_userName);
            });
            expect(users[1]).toBe(undefined);
        });
    });

    function screenShot() {
        browser.takeScreenshot().then(function (png) {
            Utils.writeScreenShot(png, 'test.png');
        });
    }
});
