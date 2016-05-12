/*
    Copyright (c) 2016 eyeOS

    This file is part of Open365.

    Open365 is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as
    published by the Free Software Foundation, either version 3 of the
    License, or (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program. If not, see <http://www.gnu.org/licenses/>.
*/

var assert = require('chai').assert;
var settings = require('../src/lib/settings');

var seafileAdmin = require('./InitAdminSession');

suite('SeafileAdmin', function() {
    var sut;

    setup(function() {
        sut = seafileAdmin;
    });



    suite('createAccount', function () {
        test('should create an account into the platform', function (done){
            var newUser = {
                email: 'aNewTestAccount@example.org',
                password: 'fakePass'
            };
            sut.createAccount(newUser, function (err, data) {
                assert.isTrue(data);
                done();
            });
        });
    });

    suite('updateAccount', function () {
        test('should modify the password of the account', function (done){
            var user = {
                email: 'aNewTestAccount@example.org',
                password: 'updatedPassword'
            };
            sut.updateAccount(user, function (err, data) {
                assert.isTrue(data);
                done();
            });
        });
    });


    suite('listAccounts', function () {
        var testUser;
        suiteSetup(function(done) {
            testUser = {email:'pepito@asd.com', password: 'fakepass'};
            sut.createAccount(testUser, function (err, newUser) {
                testUser = newUser;
                done();
            });
        });

        test('should modify the password of the account', function (done){
            var params = {
                start: 0
            };
            sut.listAccounts(params, function (err, data) {
                var accountInList = false;
                for(var i = 0; i < data.length && !accountInList; i++ ){
                    var account = data[i];
                    if(account['email'] === 'pepito@asd.com') {
                        accountInList = true;
                        return done();
                    }
                }
                if (!accountInList) {
                    done(new Error('List account failed'));
                }
            });
        });
    });




});
