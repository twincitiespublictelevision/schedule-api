# schedule-api
[![CircleCI](https://circleci.com/gh/twincitiespublictelevision/schedule-api.svg?style=svg)](https://circleci.com/gh/twincitiespublictelevision/schedule-api)

`schedule-api` is an API that preforms two main functions, parsing and saving Myers ProTrack schedule information and providing endpoints that expose the transformed data.

---

## Requirements

1. [Node](https://nodejs.org/) - schedule-api is built in JavaScript and runs on [Node](https://nodejs.org/en/). As such, you will need to have it installed to run the API.  The [NPM](https://www.npmjs.com) command line tool is bundled with Node, so once installed you'll have access to it as well.
2. [MongoDB](https://www.mongodb.com/) - schedule-api uses [MongoDB](https://www.mongodb.com/) to store schedule data and associated information.  You will need an instance of Mongo setup and properly configured to use this API.

## Installation

1. `git clone https://github.com/twincitiespublictelevision/schedule-api.git`
2. Run `npm install` to install the project dependencies
4. Set up a directory for the watch, working, and backup directories
5. Set up a directory / files for the server and application logs
6. Run `npm run build` to create the initial build / transpile of the project
7. Set up MongoDB and add collection name and authentication info to the `.env` file.
 * The API supports authenticating with the username and password as options vs. in the connection string.
 * Ensure the database connection is using TSL/SSL if the HTTPS config option is set to `true`.
8. Create a config file based on the `.example.env` file (see the [Configuration](#configuration-options) section below).
 * e.g. `$ cp .example.env .env`
9. Launch the server / API using `npm start`

## Tests

There is currently a single testing framework in place for the server side code.  If needed, it can also be used for client side tests as well.

#### Jest

[Jest](https://facebook.github.io/jest/) is used for server side testing.

The test suite is run using `npm test`.

## Builds

The build framework used in this project is [Gulp](http://gulpjs.com).

Running `gulp build` will compile all the JavaScript and begin watching the project for changes.


## Configuration Options

A sample config file is supplied in `.example.env`

### General

| Option             | Value                                                |
| ------------------ | ---------------------------------------------        |
| WATCH_DIR          | Path to the directory where initial files are placed |
| WORKING_DIR        | Path to the directory where the files are processed  |
| BACKUP_DIR         | Path to the directory where backup files are stored  |

### Server Connection

| Option             | Value                                                |
| ------------------ | ---------------------------------------------        |
| DEFAULT_PORT       | The default port the http server will listen on      |
| HTTP\_SERVER_PORT   | Port the http server will listen on                  |
| HTTPS\_SERVER_PORT  | Port the https server will listen on                 |
| HTTPS_PRIVATEKEY    | Path to the directory where the private key file is saved |
| HTTPS_CERTIFICATE   | Path to the directory where the certificate file is saved |
| ENABLE\_TLS_SSL      | True / False - Option to enable or disable a secure connection     |
| HTTPS\_SERVER_PORT  | Port the https server will listen on                 |
| HTTPS\_SERVER_PORT  | Port the https server will listen on                 |

### Database

These are the values required to connect to the MongoDB instance

| Option      | Value                                    |
| --------    | --------                                 |
| DB_HOST     | Host address for the DB                  |
| DB_PORT     | Port number for the DB, default is 27017 |
| DB_NAME     | Name of the database (collection)        |
| DB_USERNAME | Username for the database                |
| DB_PASSWORD | Password for the database                |

### Logging

| Option     | Value                   |
| --------   | ----------------        |
| ACCESS_LOG | Path to server log file |
| ERROR_LOG  | Path to error log file  |
| APP\_LOG\_LEVEL     | App error log level  |
| SERVER\_LOG\_LEVEL  | Server error log level  |

#### Error Severity

App level logging is not yet implemented.  The format will match the following.
```
* emergency: System is unusable
* alert:     Action must be taken immediately
* critical:  Critical conditions
* error:     Error conditions
* warning:   Warning conditions
* notice:    Normal but significant condition
* info:      Informational message
* debug:     Debug-level messages
```

Server level logging.  This is provided by the [Morgan library](https://github.com/expressjs/morgan).

```
* combined:		Standard Apache COMBINED log output.
* common: 		Standard Apache COMMON log output.
* dev:			Concise output colored by response status for development use.
* short:		Shorter than default, also including response time.
* tiny:			The minimal output
```

## Usage

The schedule-api preforms two main functions, parsing and saving Myers ProTrack schedule information and providing endpoints that expose the transformed data.

When launched, the schedule-api begins watching a set of directories for changes.

The `WATCH_DIR` is where ProTrack schedule files originate.  When a new file arrives, it is copied to the `WORKING_DIR`as well as the `BACKUP_DIR`.

When files arrive in the `WORKING_DIR`, they are parsed and converted from XML to JSON.  Once the data has been converted to JSON, individual schedule objects are extracted and transformed into an `airing`.

These individual `airings` are then saved off to the database and made available via various endpoints.

---

### Licensing

`schedule-api` is licensed under the Apache License, Version 2.0. See [LICENSE](LICENSE.md) for the full license text.
