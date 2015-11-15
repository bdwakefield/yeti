/*
 Copyright 2015 YetiJS (Thomas Richardson)

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
 */
'use strict';

var inq = require('inquirer');

var questions = [
    {
        type: 'input',
        name: 'username',
        message: 'What user name do you want to use?',
        validate: function(answer) {
            if (answer.length < 5) {
                return 'You must enter a valid username';
            }
            return true;
        }
    },
    {
        type: 'password',
        name: 'password',
        message: 'Please enter a password\n (Password must be 8 characters with at least 1 number and 1 special character)\n',
        validate: function(answer) {
            if (!answer.match(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,}$/)) {
                return 'Password must be 8 characters with at least 1 number and 1 special character'
            }
            return true;
        }
    },
    {
        type: 'checkbox',
        name: 'checkbox_test',
        message: 'Checkbox Test',
        choices: [
            new inq.Separator('First Choices:'),
            {
                name: 'First'
            },
            {
                name: 'Second'
            },
            {
                name: 'Third'
            }
        ],
        validate: function(answer) {
            if (answer.length < 1) {
                return 'You must choose at least one.';
            }
            return true;
        }
    },
    {
        type: 'confirm',
        name: 'test_confirm',
        message: 'Test Confirm'
    }
];

inq.prompt(questions, function(answers) {
    console.log(JSON.stringify(answers));
});