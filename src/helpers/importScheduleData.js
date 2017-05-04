import * as fs from 	'fs';
import * as path from 'path';

const proTrackScheduleData 			= (__dirname + '/../../data/sampleSchedule.xml');

const baseDirectory 						= (__dirname + '/../../data');
const backupDataDirectoryPath 	= (__dirname + '/../../data/backupScheduleData/');
const currentDataDirectoryPath 	= (__dirname + '/../../data/currentScheduleData/');

let tptKidsSchedule = '',
		tptMainSchedule = '',
		tptLifeSchedule = '',
		tptMNOSchedule	= '';

// Check to make sure a backup schedule data directory exists
// If not, create one
function verifyBackupDirectoryPath(directoryPath) {
	if (fs.existsSync(backupDataDirectoryPath) === true) {
		console.log('Backup directory exists.');
	} else {
		fs.mkdir(backupDataDirectoryPath, function() {
			console.log('Backup directory created.');
		});
	}
}

// Check to make sure a current schedule data directory exists
// If not, create one
function verifyDataDirectoryPath(directoryPath) {
	if (fs.existsSync(currentDataDirectoryPath) === true) {
		console.log('Current data directory exists.');
	} else {
		fs.mkdir(currentDataDirectoryPath, function() {
			console.log('Current data directory created.');
		});
	}
}

// Add leading 0 to integers less than 10
function leadingZero(num) {
	if (num < 10) {
		return num = '0' + num;
	} else {
		return num;
	}
}

// Get the current date to append to schedule file
function getCurrentDate() {
	let currentDate = new Date(),
			hh = leadingZero(currentDate.getHours()),
			mi = leadingZero(currentDate.getMinutes()),
			mm = leadingZero(currentDate.getMonth() + 1),
			dd = leadingZero(currentDate.getDate()),
			yy = currentDate.getFullYear(),
			formattedDateString = 'proTrackData-' + yy + mm + dd + '-' + hh + ':' + mi + '.xml';

	return formattedDateString;
}

// Get schedule file names from the data directory
function getFileNames(scheduleFilePath, fn) {
	
	fs.readdir(scheduleFilePath, function(error, files) {
		var scheduleFiles = [];
		if (error) {
			fn(error, undefined);
		} else {
			
			files.map(function(file) {
				return path.join(scheduleFilePath, file);
			})
			.filter(function(file) {
				if (path.extname(file) === '.xml') {
    			return fs.statSync(file).isFile();
    		}
			})
			.forEach(function (file) {
        return scheduleFiles.push(file);
			});
		}
		return fn(undefined, scheduleFiles);
	});
}

getFileNames(baseDirectory, function(error, files) {
	tptKidsSchedule = files[0];
	tptMainSchedule = files[3];
	tptLifeSchedule = files[4];
	tptMNOSchedule	= files[2];
});

// Move schedule data files to the read / current directory
function moveScheduleDataToReadDirectory(scheduleData, fn) {
	let currentDate = getCurrentDate();

	if (fs.existsSync(proTrackScheduleData) === true) {
		fs.readFile(proTrackScheduleData, function(error, data) {
			if (error) {
				fn(error, undefined);
			} else {
				fs.writeFile(currentDataDirectoryPath + currentDate, data, function(error) {
					if (error) {
						fn(error, undefined);
					} else {
						console.log('New schedule data file created.');
					}
				});
			}
			fn(undefined, data);
		});
	}
}

// Move schedule data files to backup directory
function moveScheduleDataToBackupDirectory(scheduleData, fn) {
	let currentDate = getCurrentDate();

	if (fs.existsSync(proTrackScheduleData) === true) {
		fs.readFile(proTrackScheduleData, function(error, data) {
			if (error) {
				fn(error, undefined);
			} else {
				fs.writeFile(backupDataDirectoryPath + currentDate, data, function(error) {
					if (error) {
						fn(error, undefined);
					} else {
						console.log('New schedule data file created.');
					}
				});
			}
			fn(undefined, data);
		});
	}
}

// verifyBackupDirectoryPath(backupDataDirectoryPath);
// verifyDataDirectoryPath(currentDataDirectoryPath);

// moveScheduleDataToReadDirectory(proTrackScheduleData, function(error, removeScheduleFile) {
// 	if (error) {
// 		console.log(error);
// 	}
// 	fs.unlink(proTrackScheduleData, function(error) {
// 		if (error) {
// 			console.log(error);
// 		}
// 		console.log('File removed!');
// 	})
// });

export { moveScheduleDataToReadDirectory };
export { moveScheduleDataToBackupDirectory };
export { getFileNames };
