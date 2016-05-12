Eyeos Seafile Api Library
=========================

## Overview

Library used to manage seafile server

## How to use it

### User api:
```javascript

var EyeosSeafileUserApi = require('eyeos-seafile-api').user;
var eyeosSeafileUserApi = new EyeosSeafileUserApi(username, password);

/*
 * @param callback function (err, data)
 */
eyeosSeafileUserApi.listLibraries(callback);

/*
 * @param params {
 *          name: String
   }
 * @param callback function (err, data)
 */
eyeosSeafileUserApi.createLibrary(params, callback);

/*
 * @param params {
 *          repoId: String
   }
 * @param callback function (err, data)
 */
eyeosSeafileUserApi.deleteLibrary(params, callback);


/*
 * @param callback(err, data)
 * callback data: {
                "repo_id": "691b3e24-d05e-43cd-a9f2-6f32bd6b800e",
                "exists": true
            }
 */
 eyeosSeafileUserApi.createDefaultLibrary(callback);

/*
 * @param callback(err, data)
 * callback data: {
                "repo_id": "691b3e24-d05e-43cd-a9f2-6f32bd6b800e",
                "exists": true
            }
 */
 eyeosSeafileUserApi.getDefaultLibrary(callback);


/*
 * @param callback(err, data)
 * callback data: {
                "id": "691b3e24-d05e-43cd-a9f2-6f32bd6b800e",
                "name": 'home',
                "owner": 'mytestnewuser@example.org'
                ...
 */
 eyeosSeafileUserApi.createDefaultEyeosLibrary(callback);

/*
 * @param callback(err, data)
 * callback data: {
                "id": "691b3e24-d05e-43cd-a9f2-6f32bd6b800e",
                "name": "home",
                "owner": "mytestnewuser@example.org",
                ...
            }
 */
 eyeosSeafileUserApi.getDefaultEyeosLibrary(callback);


/*
 * @param params {
 *          repoId: 'dae8cecc-2359-4d33-aa42-01b7846c4b32',
 *          pathToFile: '/foo.c'
   }
 * @param callback function (err, data)
 */
eyeosSeafileUserApi.createFile(params, callback);


/*
 * @param params {
 *          repoId: 'dae8cecc-2359-4d33-aa42-01b7846c4b32',
 *          pathToFile: '/foo.c'
   }
 * @param callback function (err, data)
 */
eyeosSeafileUserApi.createFileShareLink(params, callback);


```

### Admin api:
```javascript

var EyeosSeafileAdminApi = require('eyeos-seafile-api').admin;
var eyeosSeafileAdminApi = new EyeosSeafileAdminApi();

/*
 * @param params {
                email: required
                password: required
                }
 * @param callback function (err, body)
 */
eyeosSeafileAdminApi.createAccount(params, callback);


/*
 * @param params {email: required
                 password: optional
                 note: optional
                 storage: optional
                 }
 * @param callback function (err, body)
 */
eyeosSeafileAdminApi.updateAccount(params, callback);

/*
  * @param params {
  *                  start: optional (default 0)
  *                  limit: optional (default 100)
  *                  scope: optional ['LDAP' || 'DB'](default 'DB')
  *                  }
 * @param callback function (err, accounts)
 */
eyeosSeafileAdminApi.listAccounts(params, callback);

```

### Running tests:
- Start a seafileServer
- Modify settings
- Execute:
```bash
./integration-test.sh
```

## Quick help

* Install modules

```bash
	$ npm install
```

* Check tests

```bash
    $ ./tests.sh
```