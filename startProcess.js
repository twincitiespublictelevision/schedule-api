
let env = require('dotenv');

env.config({path: '/Users/tingram/Dev_Workspace/Projects/JavaScript/scheduleAPIv2/.env'});

let spawn = require('child_process').spawn;

// Launch API, listen on StandardOut for messages.

const launchApi = spawn('node', ['build/index.js']);

launchApi.stdin.on('data', (data) => {
	console.log(`stdin of Schedule API, PID ${launchApi.pid}: \n${data}`);
});

launchApi.stdout.on('data', (data) => {
	console.log(`stdout of Schedule API, PID ${launchApi.pid}: \n${data}`);
});

launchApi.stderr.on('data', (data) => {
	if (data !== null) {
		console.log(`spawn error from Schedule API PID ${launchApi.pid}: \n${data.toString()}`);
	} else {
		console.log(`stderr: ${data}`);
	}
});

launchApi.on('close', (code) => {
	console.log(`Schedule API PID ${launchApi.pid} exited with a code of ${code}`);
});

// Launch File import, listen on StandardOut for messages.

const fileImport = spawn('node', ['build/processScheduleData.js']);

fileImport.stdin.on('data', (data) => {
	console.log(`stdin of File I/O, PID ${fileImport.pid}: \n${data}`);
});

fileImport.stdout.on('data', (data) => {
	console.log(`stdout of File I/O, PID ${fileImport.pid}: \n${data}`);
});

fileImport.stderr.on('data', (data) => {
	if (data !== null) {
		console.log(`Spawn error from File I/O PID ${fileImport.pid}: \n${data.toString()}`);
	} else {
		console.log(`stderr: ${data}`);
	}
});

fileImport.on('close', (code) => {
	console.log(`File I/O PID ${fileImport.pid} exited with a code of ${code}`);
});
