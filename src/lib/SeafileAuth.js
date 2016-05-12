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

var settings = require('./settings');
var log2out = require('log2out');
var request = require('request');
var errors = require('./Errors/errors');

function SeafileAuth (email, password) {
    this.logger = log2out.getLogger('SeafileAuth');
    this.token = null;
    this.email = email;
    this.password = password;
}

/**
 *
 * @param callback(error, data)
 * @returns {token: d94de8968954b544aa08d71424a1a0a6c0f54775}
 */
SeafileAuth.prototype.login = function(callback) {
    var self = this;
    var options = {
        url: settings.seafileServerUrl+'/api2/auth-token/',
        method: 'POST',
        json: {
            username: this.email,
            password: this.password
        }
    };
    request(options, function (error, response, body) {
        if (error) {
            callback(error);
            return;
        }
        if(body && body.token) {
            self.token = body.token;
            callback(error, body);
            return;
        }
        if (body.detail && body.detail.indexOf('throttled') !== -1) {
            var authError = new errors.ThrottledRequest(body.detail);
            callback(authError, null);
            return;
        }
        callback(new Error('Unable to login with given username and password'));
        return;

    });
};

SeafileAuth.prototype.isAuthenticated = function () {
    return (this.token !== null);
};

module.exports = SeafileAuth;
