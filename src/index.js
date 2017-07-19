'use strict'

import * as fs from 'fs';
import * as http from 'http';
import * as https from 'https';
import Api from './api';
import {
	databaseConnectionError,
	databaseConnection
} from './database';

// App Constants

const app = new Api();
const DEFAULT_PORT = 3000;
const httpPort = normalizePort(process.env.HTTP_SERVER_PORT);
// const httpServer = http.createServer(app.express);

const httpServer = http.createServer(function (request, response) {
    response.writeHead(301, { 'Location': 'https://0.0.0.0:3443' + request.url });
    response.end();
})

// HTTPS Connection Constants
const httpsPort = httpsNormalizePort(process.env.HTTPS_SERVER_PORT);
const httpsPrivateKey  = fs.readFileSync(process.env.HTTPS_PRIVATEKEY, 'utf8');
const httpsCertificate = fs.readFileSync(process.env.HTTPS_CERTIFICATE, 'utf8');
const httpsCredentials = {key: httpsPrivateKey, cert: httpsCertificate};
const httpsServer = https.createServer(httpsCredentials, app.express);

// DB Connection

databaseConnectionError();
databaseConnection();

// HTTP Server Connection

httpServer.listen(httpPort);
httpServer.on('error', onError);
httpServer.on('listening', onListening);

function normalizePort(val) {
	let httpPort = (typeof val === 'string') ? parseInt(val, 10) : val;

	if (httpPort && isNaN(httpPort)) {
		return httpPort;
	} else if (httpPort >= 0) {
			return httpPort;
	} else {
			return DEFAULT_PORT;
	}
}

function onError(error) {
	if (error.syscall !== 'listen') {
		throw error;
	}

	let bind = (typeof httpPort === 'string') ? `Pipe ${httpPort}` : `Port ${httpPort.toString()}`;

	switch (error.code) {
		case 'EACCESS':
			console.error(`${bind} is already in use.`);
			process.exit(1);
			break
		case 'EADDRINUSE':
      console.error(`${bind} is already in use`);
      process.exit(1);
      break;	
		default:
			throw error;
	}
}

function onListening() {
	let addr = httpServer.address();
	let bind = (typeof addr === 'string') ? `pipe ${addr}` : `port ${addr.port}`;
	console.log(`Listening on ${bind}`);
}

// HTTPS Server Connection

httpsServer.listen(httpsPort);
httpsServer.on('error', httpsOnError);
httpsServer.on('listening', httpsOnListening);

function httpsNormalizePort(val) {
	let httpsPort = (typeof val === 'string') ? parseInt(val, 10) : val;

	if (httpsPort && isNaN(httpsPort)) {
		return httpsPort;
	} else if (httpsPort >= 0) {
			return httpsPort;
	} else {
			return DEFAULT_PORT;
	}
}

function httpsOnError(error) {
	if (error.syscall !== 'listen') {
		throw error;
	}

	let bind = (typeof httpsPort === 'string') ? `Pipe ${httpsPort}` : `Port ${httpsPort.toString()}`;

	switch (error.code) {
		case 'EACCESS':
			console.error(`${bind} is already in use.`);
			process.exit(1);
			break
		case 'EADDRINUSE':
      console.error(`${bind} is already in use`);
      process.exit(1);
      break;
		default:
			throw error;
	}
}

function httpsOnListening() {
	let addr = httpsServer.address();
	let bind = (typeof addr === 'string') ? `pipe ${addr}` : `port ${addr.port}`;
	console.log(`Listening on ${bind}`);
}