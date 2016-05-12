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
var sinon = require('sinon');
var settings = require('../src/lib/settings');

var SeafileUser = require('../src/lib/SeafileUser');
var SeafileAdmin = require('../src/lib/SeafileAdmin');
var seafileAdmin = require('./InitAdminSession');

suite('SeafileUser', function() {
    var sut,
        testUser;

    suiteSetup(function(done) {
        createTestUser(function (err, newUser) {
            if(!err){
                testUser = newUser;
                sut = new SeafileUser(testUser.email, testUser.password);
            } else {
                throw new Error('Unable to create test user');
            }
            done();
        });
    });

    suite('Library', function () {
        var toCleanRepoId;

        suite('Default Library', function () {
            var defaultLibRepoId;

            suite('createDefaultLibrary', function () {
                test('should return callback with default library data', function (done) {
                    sut.createDefaultLibrary(function (err, data) {
                        assert.isDefined(data.repo_id);
                        defaultLibRepoId = data.repo_id;
                        done();
                    });
                });
            });

            suite('getDefaultLibrary', function () {
                test('should return callback with default library data', function (done) {
                    sut.getDefaultLibrary(function (err, data) {
                        assert.isDefined(data.repo_id);
                        assert.equal(defaultLibRepoId, data.repo_id);
                        done();
                    });
                });
            });
        });

        suite('createLibrary', function () {
            test('should return callback with library data', function (done) {
                var fakeFolderName = 'fakeFolder';
                var params = {
                    name: fakeFolderName
                };
                sut.createLibrary(params, function (err, data) {
                    assert.isDefined(data.repo_id);
                    assert.equal(data.email, testUser.email.toLowerCase());
                    assert.equal(data.repo_name, fakeFolderName);
                    toCleanRepoId = data.repo_id;
                    done();
                });
            });
        });

        suite('listLibraries', function () {
            var testLibrary, defaultLibrary;

            setup(function () {
                testLibrary = getFakeTestLibrary();
                defaultLibrary = getFakeDefaultTestLibrary();
            });

            test("when called returns an array with the user's libraries", function (done){
                sut.listLibraries(function (err, data) {
                    var libsToCompare = [data[0], data[1], testLibrary, defaultLibrary];
                    libsToCompare.forEach(deleteNonConstantLibFields);
                    assert.sameDeepMembers(data, [defaultLibrary, testLibrary]);
                    done();
                });
            });

            test("when called and theres an error should return the error", function (done){
                var testError = 'a test error';
                sinon.stub(sut, 'init').yields(testError);
                sut.listLibraries(function (err) {
                    sut.init.restore();
                    assert.equal(err, testError);
                    done();
                });
            });

        });

        suite('deleteLibrary', function () {
            test("when called and there's no error should return true", function (done){
                sut.deleteLibrary({repoId: toCleanRepoId}, function (err, data) {
                    if(!err) {
                        assert.isTrue(data);
                        return done();
                    }
                    return done(new Error(err));
                });
            });

        });

    });

    suite('File', function () {
        var toCleanLibraryData;
        suiteSetup(function (done){
            var params = {
                name: 'TestFileSuiteFakeFolder'
            };
            sut.createLibrary(params, function (err, data) {
                toCleanLibraryData = data;
                done();
            });
        });

        suiteTeardown(function (done) {
            sut.deleteLibrary({repoId: toCleanLibraryData.repo_id}, done);
        });

        suite('createFile', function () {
            test('should return true if successfully created', function (done) {
                var params = {
                    repoId: toCleanLibraryData.repo_id,
                    pathToFile: '/testingFile.txt'
                };
                sut.createFile(params, function (err, data) {
                    if(!err) {
                        assert.isTrue(data);
                        return done();
                    }
                    return done(new Error(err));
                });
            });

            test('should return an error when something is wrong', function (done) {
                var params = {
                    repoId: toCleanLibraryData.repo_id,
                    pathToFile: 'noSlashAthTheBeginning.txt'
                };
                sut.createFile(params, function (err) {
                    if(err) {
                        return done();
                    }
                    return done(new Error(err));
                });
            });


        });

        suite('createFileShareLink', function () {
            test('should return callback with link data', function (done) {
                var params = {
                    repoId: toCleanLibraryData.repo_id,
                    pathToFile: '/testingFile.txt'
                };
                sut.createFileShareLink(params, function (err, data) {
                    if(!err) {
                        assert.isDefined(data.shareLink);
                        return done();
                    }
                    return done(new Error(err));
                });
            });
        });

    });


    function createTestUser (callback) {
        var newUser = {
            email: 'myTestNewUser@example.org',
            password: 'tested'
        };
        seafileAdmin.createAccount(newUser, function (err){
            callback(err, newUser);
        });
    }

    function getFakeTestLibrary () {
        return {
            "desc": "",
            "encrypted": false,
            "id": "6d1536bb-cd24-44b2-96d4-c39c32b36ce8",
            "mtime": 1457950206,
            "mtime_relative": "<time datetime=\"2016-03-14T18:10:06\" is=\"relative-time\" title=\"Mon, 14 Mar 2016 18:10:06 +0800\" >1 minute ago</time>",
            "name": "fakeFolder",
            "owner": "mytestnewuser@example.org",
            "permission": "rw",
            "root": "0000000000000000000000000000000000000000",
            "size": 0,
            "size_formatted": "0 bytes",
            "type": "repo",
            "virtual": false
        }
    }

    function getFakeDefaultTestLibrary () {
        return {
            "desc": "My Library",
            "encrypted": false,
            "id": "28993336-c358-416c-8f49-6fe7d5f0eac7",
            "mtime": 1458637705,
            "mtime_relative": "<time datetime=\"2016-03-22T17:08:25\" is=\"relative-time\" title=\"Tue, 22 Mar 2016 17:08:25 +0800\" >2 minutes ago</time>",
            "name": "My Library",
            "owner": "mytestnewuser@example.org",
            "permission": "rw",
            "root": "520881dec14c19e6c3a90736c5c785b6303a291f",
            "size": 0,
            "size_formatted": "0 bytes",
            "type": "repo",
            "virtual": false
        }
    }

    function deleteNonConstantLibFields(lib) {
        delete lib.mtime_relative;
        delete lib.mtime;
        delete lib.root;
        delete lib.id;
        delete lib.size;
        delete lib.size_formatted;
        return lib;
    }

});
