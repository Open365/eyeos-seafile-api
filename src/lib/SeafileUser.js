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

var settings = require('./settings');
var SeafileAuth = require('./SeafileAuth');
var SeafileRequest = require('./request/SeafileServerRequest');
var errors = require('./Errors/errors');

function SeafileUser (email, password) {
    this.logger = log2out.getLogger('SeafileUser');
    this.seafileAuth = new SeafileAuth(email, password);
    this.seafileRequest = new SeafileRequest(this.seafileAuth);
    this.email = email;
}


SeafileUser.prototype.init = function (callback){
    var self = this;
    if (!this.seafileAuth.token) {
        this.seafileAuth.login(function (error, data) {
            if(error) {
                self.logger.error("Can't init seafile-api lib with user credentials.", error);
            }
            callback(error, data);
        });
    } else {
        callback(null);
    }
};


/**
 * listLibraries
 * @param callback(err, data)
 * @returns {*[]}
 */
SeafileUser.prototype.listLibraries = function(callback) {
    var self = this;
    this.logger.debug("Going to list libraries: ");

    this.init(function (err) {
        if (err) {
            callback(err);
        } else {
            var options = {
                url: settings.seafileServerUrl+'/api2/repos/',
                method: 'GET'
            };

            self.seafileRequest.request(options, function (error, response, body) {
                if(error) {
                    callback(new Error("Can't retrieve list of libraries"));
                } else {
                    callback(error, body);
                }
            });
        }
    });
};


/**
 * createLibrary
 * @param params = {
 *          name: String
 * }
 * @param callback(err, data)
 */
SeafileUser.prototype.createLibrary = function (params, callback) {
    var self = this;
    this.logger.debug("Going to create library: ", params);

    this.init(function (err) {
        if (err) {
            callback(err);
        } else {
            var options = {
                url: settings.seafileServerUrl+'/api2/repos/',
                method: 'POST',
                form: {
                    "name": params.name
                }
            };
            self.seafileRequest.request(options, function (error, response, body) {
                if(error) {
                    self.logger.error("Cant' create library: ", error);
                    callback(new Error("Can't create library: " + error));
                } else {
                    self.logger.debug("Created library successfully: ", params);
                    callback(error, body);
                }
            });
        }
    });
};

/**
 * deleteLibrary
 * @param params = {
 *          repoId: String
 * }
 * @param callback(err, data)
 */
SeafileUser.prototype.deleteLibrary = function (params, callback) {
    var self = this;
    this.logger.debug("Going to delete library: ", params);

    this.init(function (err) {
        if (err) {
            callback(err);
        } else {
            var options = {
                url: settings.seafileServerUrl+'/api2/repos/'+params.repoId+'/',
                method: 'DELETE'
            };

            var messages = {
                error: "Cant' delete library",
                success: "Library deleted successfully"
            };

            self.seafileRequest.request(options, handleCallback.bind(self, callback, messages));

        }
    });
};

/**
 * createDefaultLibrary
 * @param callback(err, data)
 * callback data: {
                "repo_id": "691b3e24-d05e-43cd-a9f2-6f32bd6b800e",
                "exists": true
            }
 */
SeafileUser.prototype.createDefaultLibrary = function (callback) {
    this.logger.debug("Going to create default library for user ", this.email);

    var messages = {
        error: "Cant' create default library: ",
        success: "Created default library for user %s returned successfully "
    };
    callMethodOnDefaultLib.call(this, 'POST', messages, callback);
};


/**
 * getDefaultLibrary
 * @param callback(err, data)
 * callback data: {
                "repo_id": "691b3e24-d05e-43cd-a9f2-6f32bd6b800e",
                "exists": true
            }
 */
SeafileUser.prototype.getDefaultLibrary = function (callback) {
    this.logger.debug("Going to get default library for user ", this.email);
    var messages = {
        error: "Cant' get default library: ",
        success: "Get default library for user %s returned successfully "
    };
    callMethodOnDefaultLib.call(this, 'GET', messages, callback);
};


function callMethodOnDefaultLib (method, logMessages, callback) {
    var self = this;

    this.init(function (err) {
        if (err) {
            callback(err);
        } else {
            var options = {
                url: settings.seafileServerUrl+'/api2/default-repo/',
                method: method
            };
            self.seafileRequest.request(options, function (error, response, body) {
                if(error) {
                    self.logger.error(logMessages.error, error);
                    callback(new Error(logMessages.error + error));
                    return;
                }
                self.logger.debug(logMessages.success, self.email);
                callback(error, body);
            });
        }
    });
}

/**
 * createFile
 * @param params = {
 *          repoId: 'dae8cecc-2359-4d33-aa42-01b7846c4b32',
 *          pathToFile: '/foo.c'
 * }
 * @param callback(err, data)
 */
SeafileUser.prototype.createFile = function (params, callback) {
    this.logger.debug("Going to create file: ", params);
    var self = this;

    this.init(function (err) {
        if (err) {
            callback(err);
        } else {
            var options = {
                url: settings.seafileServerUrl+'/api2/repos/'+params.repoId+'/file/?p='+params.pathToFile,
                method: 'POST',
                form: {
                    "operation": "create"
                }
            };

            var messages = {
                error: "Can't create file: ",
                success: "File successfully created: "
            };
            //callback and messages parameters of this bind call, are the first parameters of handleCallback.
            // The other parameters are the ones passed by request.
            self.seafileRequest.request(options, handleCallback.bind(self, callback, messages));
        }
    });
};

/**
 * createFileShareLink
 * @param params = {
 *          repoId: 'dae8cecc-2359-4d33-aa42-01b7846c4b32',
 *          pathToFile: '/foo.c'
 * }
 * @param callback(err, data)
 */
SeafileUser.prototype.createFileShareLink = function (params, callback) {
    this.logger.debug("Going to create fileShareLink: ", params);
    var self = this;

    if(!params.repoId) {
        var error = "Can't create a file share link: No repoId provided";
        this.logger.error(error);
        callback(error);
    }

    this.init(function (err) {
        if (err) {
            callback(err);
        } else {
            var options = {
                url: settings.seafileServerUrl+'/api2/repos/'+params.repoId+'/file/shared-link/',
                method: 'PUT',
                form: {
                    "p": params.pathToFile
                }
            };

            var messages = {
                error: "Can't create file share link: ",
                success: "File share link successfully created: "
            };

            self.seafileRequest.request(options, function (error, response, body) {

                if(error) {
                    handleError.call(this, messages, error, callback);
                } else {
                    var data = {
                        shareLink: response.headers['location']
                    };
                    if (body && body.error_msg) {
                        handleError.call(self, messages, body.error_msg, callback);
                    } else {
                        self.logger.debug(messages.success, data);
                        callback(error, data);
                    }
                }
            });
        }
    });

};


function handleCallback (callback, messages, error, response, body) {
    if(error) {
        handleError.call(this, messages, error, callback);
    } else {
        var data = (response.statusCode === 200 || response.statusCode === 201);
        if (body && body.error_msg) {
            handleError.call(this, messages, body.error_msg, callback);
        } else {
            this.logger.debug(messages.success, body);
            callback(error, data);
        }
    }
}
function handleError (messages, error, callback) {
    this.logger.error(messages.error, error);
    callback(new Error(messages.error + error));
}


module.exports = SeafileUser;
