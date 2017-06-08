
let env = require('dotenv');

env.config({path: '/Users/tingram/Dev_Workspace/Projects/JavaScript/scheduleAPIv2/.env'});

let spawn = require('child_process').spawn;

// Launch API, listen on StandardOut for messages.

const launchApi = spawn('node', ['build/index.js'], {
	stdio: ['pipe', 'pipe', 'pipe', 'ipc']
});

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

// Launch directory monitor on WATCH_DIR, listen on Standard In for messages.

const fileImport = spawn('node', ['build/processScheduleData.js'], {
	stdio: ['pipe', 'pipe', 'pipe', 'ipc']
});

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

fileImport.on('message', (message) => {
	if(message.start === true) {
		fileMoveSaveDelete();
	} else {
		console.log('Received unexpected message.');
	}
});

fileImport.on('close', (code) => {
	console.log(`File I/O PID ${fileImport.pid} exited with a code of ${code}`);
});

// Launch file move, save, delete process

function fileMoveSaveDelete() {
	const moveSaveDeleteFile = spawn('node', ['build/moveSaveDeleteFile.js'], {
		stdio: ['pipe', 'pipe', 'pipe', 'ipc']
	});

	moveSaveDeleteFile.stdout.on('data', (data) => {
		console.log(`stdout of moveSaveDeleteFile, PID ${moveSaveDeleteFile.pid}: \n${data}`);
	});

	moveSaveDeleteFile.stdout.on('message', (message) => {
		moveSaveDeleteFile.disconnect();
	});
}

// Launch directory monitor on WORKING_DIR, listen on Standard In for messages.

const fileParseExtractSendToDb = spawn('node', ['build/watchWorkingDir.js'], {
	stdio: ['pipe', 'pipe', 'pipe', 'ipc']
});

fileParseExtractSendToDb.stdin.on('data', (data) => {
	console.log(`stdin of Parse File, PID ${fileParseExtractSendToDb.pid}: \n${data}`);
});

fileParseExtractSendToDb.stdout.on('data', (data) => {
	console.log(`stdout of Parse File, PID ${fileParseExtractSendToDb.pid}: \n${data}`);
});

fileParseExtractSendToDb.stderr.on('data', (data) => {
	if (data !== null) {
		console.log(`Spawn error from Parse File PID ${fileParseExtractSendToDb.pid}: \n${data.toString()}`);
	} else {
		console.log(`stderr: ${data}`);
	}
});

fileParseExtractSendToDb.on('message', (message) => {
	if(message.start === true) {
		fileParseExtractSend();
	} else {
		console.log('Received unexpected message.');
	}
});

fileParseExtractSendToDb.on('close', (code) => {
	console.log(`Parse File PID ${fileParseExtractSendToDb.pid} exited with a code of ${code}`);
});

// Parse XML file, extracting object and saving it to the DB

function fileParseExtractSend() {
	const parseExtractSend = spawn('node', ['build/parseFileSaveData.js'], {
		stdio: ['pipe', 'pipe', 'pipe', 'ipc']
	});

	parseExtractSend.stdout.on('data', (data) => {
		console.log(`stdout of parseExtractSend, PID ${parseExtractSend.pid}: \n${data}`);
	});

	parseExtractSend.stdout.on('message', (message) => {
		parseExtractSend.disconnect();
	});
}
