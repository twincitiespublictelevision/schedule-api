
import * as fs 		from 'fs';
import * as http 	from 'http';
import * as https from 'https';
import Api 				from './api';
import {
	databaseConnectionError,
	databaseConnection
} from './database';

// App Constants

const app = new Api();

// HTTPS Constants
const httpsPrivateKey  = fs.readFileSync(process.env.HTTPS_PRIVATEKEY, 'utf8');
const httpsCertificate = fs.readFileSync(process.env.HTTPS_CERTIFICATE, 'utf8');
const httpsCredentials = {key: httpsPrivateKey, cert: httpsCertificate};

// Server Connection

const server 	= (process.env.ENABLE_TLS_SSL === 'true') ? https.createServer(httpsCredentials, app.express) : http.createServer(app.express);
const port 		= (process.env.ENABLE_TLS_SSL === 'true') ? normalizePort(process.env.HTTPS_SERVER_PORT) : normalizePort(process.env.HTTP_SERVER_PORT);

// DB Connection

databaseConnectionError();
databaseConnection();

// HTTP Server Connection

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

function normalizePort(val) {
	let port = (typeof val === 'string') ? parseInt(val, 10) : val;

	if (port && isNaN(port)) {
		return port;
	} else if (port >= 0) {
			return port;
	} else {
			return process.env.DEFAULT_PORT;
	}
}

function onError(error) {
	if (error.syscall !== 'listen') {
		throw error;
	}

	let bind = (typeof port === 'string') ? `Pipe ${port}` : `Port ${port.toString()}`;

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
	let addr = server.address();
	let bind = (typeof addr === 'string') ? `pipe ${addr}` : `port ${addr.port}`;
	console.log(`Listening on ${bind}`);
}
