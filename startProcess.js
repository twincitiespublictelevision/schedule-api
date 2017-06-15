let util 	=	require('util');
let env 	= require('dotenv');
let spawn = require('child_process').spawn;

let moveFile 		= require('./build/moveSaveDeleteFile');
let handleFile 	= require('./build/parseFileSaveData');

env.config({path: '/Users/tingram/Dev_Workspace/Projects/JavaScript/scheduleAPIv2/.env'});

// Launch API, listen on StandardOut for messages.

const launchApi = spawn('node', ['build/index.js'], {
	stdio: ['pipe', 'pipe', 'pipe', 'ipc']
});

launchApi.stdin.on('data', (data) => {
	console.log(`stdin of Schedule API, PID ${launchApi.pid}: \n${data}\n`);
});

launchApi.stdout.on('data', (data) => {
	console.log(`stdout of Schedule API, PID ${launchApi.pid}: \n${data}\n`);
});

launchApi.stderr.on('data', (data) => {
	if (data !== null) {
		console.log(`spawn error from Schedule API PID ${launchApi.pid}: \n${data.toString()}`);
	} else {
		console.log(`stderr from Schedule API PID ${launchApi.pid}: ${data}`);
	}
});

launchApi.on('close', (code) => {
	console.log(`Schedule API PID ${launchApi.pid} exited with a code of ${code}.\n`);
});

// Launch directory monitor on WATCH_DIR, listen on Standard In for messages.

const watchBaseDir = spawn('node', ['build/processScheduleData.js'], {
	stdio: ['pipe', 'pipe', 'pipe', 'ipc']
});

watchBaseDir.stdin.on('data', (data) => {
	console.log(`stdin of Watch Base Directory, PID ${watchBaseDir.pid}: \n${data}\n`);
});

watchBaseDir.stdout.on('data', (data) => {
	console.log(`stdout of Watch Base Directory, PID ${watchBaseDir.pid}: \n${data}\n`);
});

watchBaseDir.stderr.on('data', (data) => {
	if (data !== null) {
		console.log(`Spawn error from Watch Base Directory PID ${watchBaseDir.pid}: \n${data.toString()}`);
	} else {
		console.log(`stderr from Watch Base Directory, PID ${watchBaseDir.pid}: ${data}`);
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

// Launch directory monitor on WORKING_DIR, listen on Standard In for messages.

const watchWorkingDir = spawn('node', ['build/watchWorkingDir.js'], {
	stdio: ['pipe', 'pipe', 'pipe', 'ipc']
});

watchWorkingDir.stdin.on('data', (data) => {
	console.log(`stdin of Watch Work Directory, PID ${watchWorkingDir.pid}: \n${data}\n`);
});

watchWorkingDir.stdout.on('data', (data) => {
	console.log(`stdout of Watch Work Directory, PID ${watchWorkingDir.pid}: \n${data}\n`);
});

watchWorkingDir.stderr.on('data', (data) => {
	if (data !== null) {
		console.log(`Spawn error from Watch Work Directory PID ${watchWorkingDir.pid}: \n${data.toString()}`);
	} else {
		console.log(`stderr from Watch Working Directory, PID ${watchWorkingDir.pid}: ${data}`);
	}
});

watchWorkingDir.on('message', (message) => {
	console.log('Watch Work Directory: File arrived; Will now parse and extract data, then send to DB.\n');
	if(message.start === true) {
		handleFile(message.file);
	}
});

watchWorkingDir.on('close', (code) => {
	console.log(`Watch Work Directory PID ${watchWorkingDir.pid} exited with a code of ${code}\n`);
});
