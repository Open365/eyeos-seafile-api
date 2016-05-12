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
var SeafileAuth = require('../src/lib/SeafileAuth');

suite('SeafileAuth', function() {
    var sut;


    suite('login', function () {

        test('check should return an auth token', function(done) {

            sut = new SeafileAuth(settings.seafileAdmin.email, settings.seafileAdmin.password);

            sut.login(function (error, body) {
                if(error) {
                    return done(new Error(error));
                }

                if(!body.token) {
                    return  done(new Error('No token returned'));
                }
                done();
            });
        });

        test('check should return an error when credentials are wrong', function(done) {
            sut = new SeafileAuth('inventedFakeUser@example.org', 'myWrongPass');
            sut.login(function (error) {
                if(error) {
                    return done();
                }
                return done(new Error('Should return an error.'));
            });
        });

        suite('invalid url error', function () {
            var originalServerUrl;
            setup(function () {
                originalServerUrl = settings.seafileServerUrl;
                settings.seafileServerUrl = 'aBadUrl';
            });
            teardown(function () {
                settings.seafileServerUrl = originalServerUrl;
            });
            test('check should return an error when wrong server url is set', function(done) {

                sut = new SeafileAuth(settings.seafileAdmin.email, settings.seafileAdmin.password);
                sut.login(function (error) {
                    var expectedErrorMsg = 'Error: Invalid URI "aBadUrl/api2/auth-token/"';
                    if(error && error.toString() == expectedErrorMsg ) {
                        return done();
                    }
                    return done(new Error('Should return a "invalid server url error".'));
                });
            });
        });

        suite.skip('throttle requests', function (){

            test('when doing multiple logins quickly should return a throttle error', function (done) {
                var numLogins = 0;
                var loginCb =  function (error) {
                    numLogins ++;
                    console.log('Num logins done: ', numLogins);
                    if (error) {
                        if (error && error.name === 'ThrottledRequest') {
                            done();
                            return;
                        }
                        done(new Error(error));
                        return;
                    }
                    login();
                };
                var login = function () {
                    var auth = new SeafileAuth(settings.seafileAdmin.email, settings.seafileAdmin.password);
                    auth.login(loginCb);
                };
                login();

            })
        });
    });

});
