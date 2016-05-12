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

var log2out = require('log2out');
var SeafileAPI = require('seafile-api');
var request = require('request');

var settings = require('./settings');
var SeafileAuth = require('./SeafileAuth');

function SeafileAdmin () {
    this.logger = log2out.getLogger('SeafileAdmin');
    this.seafileAuth = new SeafileAuth(settings.seafileAdmin.email, settings.seafileAdmin.password);
    this.seafileAPI = null;
}


SeafileAdmin.prototype.init = function (callback){
    var self = this;
    if (!this.seafileAPI) {
        this.seafileAuth.login(function (error, data) {
            if(error) {
                self.logger.error("Can't init seafile-api lib with admin credentials.", error);
            } else {
                self.seafileAPI = new SeafileAPI(settings.seafileServerUrl, data.token);
            }
            callback(error, data);
        });
    } else {
        callback(null);
    }
};

/**
 *
 * @param params = {
   *                email: required
                    password: required
                 }
 * @param callback = function (err, Boolean data)
 */
SeafileAdmin.prototype.createAccount = function(params, callback) {
    var self = this;
    this.init(function(err) {
        if (!err) {
            self.seafileAPI.createAccount(params, function (err, data) {
                var created = (data === "success");
                callback(err, created);
            });
        } else {
            self.logger.error("Can't create account because it was impossible to init lib with admin credentials", err);
            callback(err);
        }
    });
};

/**
 *
 * @param params = {
 *                  email: required
 *                  password: optional
 *                  note: optional
 *                  storage: optional
 *                  }
 * @param callback(err, Boolean data)
 */
SeafileAdmin.prototype.updateAccount = function(params, callback) {
    var self = this;
    this.init(function(err) {
        if (!err) {
            self.seafileAPI.updateAccount(params, function (err, data) {
                var created = (data === "success");
                callback(err, created);
            });
        } else {
            self.logger.error("Can't create account because it was impossible to init lib with admin credentials", err);
            callback(err);
        }
    });
};

/**
 *
 * @param params = {
 *                  start: optional (default 0)
 *                  limit: optional (default 100)
 *                  scope: optional ['LDAP' || 'DB'](default 'DB')
 *                  }
 * @param callback(err, Array data)
 */
SeafileAdmin.prototype.listAccounts = function(params, callback) {
    var self = this;
    this.init(function(err) {
        if (!err) {
            self.seafileAPI.listAccounts(params, callback);
        } else {
            self.logger.error("Can't list accounts because it was impossible to init lib with admin credentials", err);
            callback(err);
        }
    });
};

module.exports = SeafileAdmin;
