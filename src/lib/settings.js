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

var settings = {
	seafileServerUrl: process.env.SEAFILE_SERVER_URL || 'https://proxy.service.consul/sync',
	seafileAdmin: {
		email: process.env.SEAFILE_ADMIN_EMAIL || 'eyeos@eyeos.com',
		password: process.env.SEAFILE_ADMIN_PASSWORD || 'eyeos'
	}
};
/*
 * I hate the 'request' library
 * @see https://github.com/request/request/issues/418 it seems that the f*cking
 * request library doesn't handle very well the validation of certs if you
 * don't want to do so (there are cases where the option 'rejectUnauthorized'
 * or 'strictSSL' don't work properly, so the only 100% working solution is to
 * disable certificate validate at the PROCESS level.  This means that all
 * processes (services) that use this library will have certificate checking
 * disabled if the seafileServerUrl settings points to an https endpoint.
 *
 * BIG FUCKING DEAL.
 * TODO: CHANGE THE request LIBRARY FOR SOMETHING THAT WORKS
 */
if (settings.seafileServerUrl.substr(0, 6) === 'https:') {
	process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;
}

module.exports = settings;
