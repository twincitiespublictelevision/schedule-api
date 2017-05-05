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

// Check to make sure a given directory exists
// If not, create it
function verifyDirectoryPath(directoryPath) {
	if (fs.existsSync(directoryPath) === true) {
		console.log('%s directory exists.', directoryPath);
	} else {
		fs.mkdir(directoryPath, function(error) {
			if (error) {
				console.log(error);
			}
			console.log('%s directory created.', directoryPath);
		});
	}
}

/**
 * Add leading 0 to integers less than 10
 * @param {number} num
 */
function leadingZero(num) {
	if (num < 10) {
		return num = '0' + num;
	} else {
		return num;
	}
}

/**
 * Gets the current date, returns a formatted string
 * Format is yyyymmdd-hh:min
 * @returns {String} formattedDateString
 */
function getCurrentDate() {
	let currentDate = new Date(),
			hh = leadingZero(currentDate.getHours()),
			mi = leadingZero(currentDate.getMinutes()),
			mm = leadingZero(currentDate.getMonth() + 1),
			dd = leadingZero(currentDate.getDate()),
			yy = currentDate.getFullYear(),
			formattedDateString = '-' + yy + mm + dd + '-' + hh + ':' + mi;

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
function moveScheduleDataFile(sourceFilePath, destinationPath, fn) {
	let currentDate = getCurrentDate();
	let currentFile = path.parse(sourceFilePath);

	if (fs.existsSync(sourceFilePath) === true) {
		fs.readFile(sourceFilePath, function(error, data) {
			if (error) {
				fn(error, undefined);
			} else {
				fs.writeFile(destinationPath + currentFile.name + currentDate + currentFile.ext, data, function(error) {
					if (error) {
						fn(error, undefined);
					} else {
						console.log('Success! %s moved to %s.', currentFile.name, destinationPath);
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
						console.log('Success! %s moved to %s.', sourceFilePath, destinationPath);
					}
				});
			}
			fn(undefined, data);
		});
	}
}

verifyDirectoryPath(backupDataDirectoryPath);
verifyDirectoryPath(currentDataDirectoryPath);

// moveScheduleDataFile(proTrackScheduleData, backupDataDirectoryPath, function(error, confirmation) {
// 	if (error) {
// 		console.log(error);
// 	}
// 		console.log('File removed.');
// 	});

// moveScheduleDataFile(proTrackScheduleData, currentDataDirectoryPath, function(error, removeScheduleFile) {
// 	if (error) {
// 		console.log(error);
// 	}
// 	fs.unlink(proTrackScheduleData, function(error) {
// 		if (error) {
// 			console.log(error);
// 		}
// 		console.log('File removed');
// 	})
// });


export { moveScheduleDataFile };
export { moveScheduleDataToBackupDirectory };
export { getFileNames };
