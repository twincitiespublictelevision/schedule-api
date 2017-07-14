
import * as util from 'util';
import * as child_process from 'child_process';

import { moveFile } from './helpers/fileInOut';
import { parseFileSaveData } from './parseFileSaveData';

let spawn = child_process.spawn;

// Launch API, listen on StandardOut for messages.

const launchApi = spawn('node', ['build/index.js'], {
	stdio: ['pipe', 'pipe', 'pipe', 'ipc']
});

launchApi.stdin.on('data', (data) => {
	console.log(`STDIN of Schedule API, PID ${launchApi.pid}: \n${data}\n`);
});

launchApi.stdout.on('data', (data) => {
	console.log(`STDOUT of Schedule API, PID ${launchApi.pid}: \n${data}\n`);
});

launchApi.stderr.on('data', (data) => {
	if (data !== null) {
		console.log(`spawn error from Schedule API PID ${launchApi.pid}: \n${data.toString()}`);
	} else {
		console.log(`STDERR from Schedule API PID ${launchApi.pid}: ${data}`);
	}
});

launchApi.on('close', (code) => {
	console.log(`Schedule API PID ${launchApi.pid} exited with a code of ${code}.\n`);
});

// Launch directory monitor on WATCH_DIR, listen on Standard In for messages.

const watchBaseDir = spawn('node', ['build/watchBaseDir.js'], {
	stdio: ['pipe', 'pipe', 'pipe', 'ipc']
});

watchBaseDir.stdin.on('data', (data) => {
	console.log(`STDIN of Watch Base Directory, PID ${watchBaseDir.pid}: \n${data}\n`);
});

watchBaseDir.stdout.on('data', (data) => {
	console.log(`STDOUT of Watch Base Directory, PID ${watchBaseDir.pid}: \n${data}\n`);
});

watchBaseDir.stderr.on('data', (data) => {
	if (data !== null) {
		console.log(`Spawn error from Watch Base Directory PID ${watchBaseDir.pid}: \n${data.toString()}`);
	} else {
		console.log(`STDERR from Watch Base Directory, PID ${watchBaseDir.pid}: ${data}`);
	}
});

watchBaseDir.on('message', (message) => {
	if(message.start === true) {
		console.log('Watch Base Directory: File arrived; Will now move, save, and then delete.\n');
		moveFile(message.file);
	} else {
		console.log(`Watch Base Directory PID ${watchBaseDir.pid} received unexpected message, ${message}\n`);
	}
});

watchBaseDir.on('close', (code) => {
	console.log(`Watch Base Directory PID ${watchBaseDir.pid} exited with a code of ${code}.\n`);
});

watchBaseDir.on('uncaughtException', (error) => {
  console.log(`Watch Base Directory PID ${watchBaseDir.pid} exiting; Uncaught exception. \n${error}.\n`);
});

watchBaseDir.on('ReferenceError', (error) => {
  console.log(`Watch Base Directory PID ${watchBaseDir.pid} exiting; Reference error. \n${error}.\n`);
});

// Launch directory monitor on WORKING_DIR, listen on Standard In for messages.

const watchWorkingDir = spawn('node', ['build/watchWorkingDir.js'], {
	stdio: ['pipe', 'pipe', 'pipe', 'ipc']
});

watchWorkingDir.stdin.on('data', (data) => {
	console.log(`STDIN of Watch Working Directory, PID ${watchWorkingDir.pid}: \n${data}\n`);
});

watchWorkingDir.stdout.on('data', (data) => {
	console.log(`STDOUT of Watch Working Directory, PID ${watchWorkingDir.pid}: \n${data}\n`);
});

watchWorkingDir.stderr.on('data', (data) => {
	if (data !== null) {
		console.log(`Spawn error from Watch Working Directory PID ${watchWorkingDir.pid}: \n${data.toString()}`);
	} else {
		console.log(`STDERR from Watch Working Directory, PID ${watchWorkingDir.pid}: ${data}`);
	}
});

watchWorkingDir.on('message', (message) => {
	console.log('Watch Work Directory: File arrived; Will now parse and extract data, then send to DB.\n');
	if(message.start === true) {
		parseFileSaveData(message.file);
	}
});

watchWorkingDir.on('close', (code) => {
	console.log(`Watch Working Directory PID ${watchWorkingDir.pid} exited with a code of ${code}\n`);
});

watchWorkingDir.on('uncaughtException', (error) => {
  console.log(`Watch Working Directory PID ${watchWorkingDir.pid} exiting; Uncaught exception. \n${error}.\n`);
});

watchWorkingDir.on('ReferenceError', (error) => {
  console.log(`Watch Working Directory PID ${watchWorkingDir.pid} exiting; Reference error. \n${error}.\n`);
});
