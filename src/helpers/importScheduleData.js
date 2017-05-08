import * as fs from 	'fs';
import * as path from 'path';

const baseDirectory 						= (__dirname + '/../../data');
const backupDataDirectoryPath 	= (__dirname + '/../../data/backupScheduleData/');
const currentDataDirectoryPath 	= (__dirname + '/../../data/currentScheduleData/');

/**
 * Verify a given directory path exists,
 * If not, create directory
 * @param {String} directoryPath - path to verify or create
 * @return
 */
function createDirectoryPath(directoryPath) {
	var existsConfirm = '%s directory already exists.', directoryPath;

	if (fs.existsSync(directoryPath) === true) {
		return existsConfirm;
	} else {
		fs.mkdir(directoryPath, function(error) {
			var createdConfirm = '%s directory created.', directoryPath;

			if (error) {
				console.log(error);
			}
			return createdConfirm;
		});
	}
}

/**
 * Verify a given directory path exists,
 * @param {String} directoryPath - path to verify
 * @return {Boolean}
 */
function verifyFilePath(filePath) {
	if (fs.existsSync(filePath) === true) {
		console.log('%s file exists.', filePath);
		return true;
	} else {
		console.log('%s file does not exist!', filePath);
		return false;
	}
}

/**
 * Add leading 0 to integers less than 10,
 * Coerce number to string through concatenation
 * @param {Number} num
 * @return {String}
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
 * Format is YYYYMMDD_HH:mi
 * @returns {String} formattedDateString
 */
function getCurrentDate() {
	let currentDate = new Date(),
			HH 		= leadingZero(currentDate.getHours()),
			mi 		= leadingZero(currentDate.getMinutes()),
			MM 		= leadingZero(currentDate.getMonth() + 1),
			DD 		= leadingZero(currentDate.getDate()),
			YYYY 	= currentDate.getFullYear(),
			formattedDateString = YYYY + MM + DD + '_' + HH + ':' + mi + '_';

	return formattedDateString;
}

/**
 * Get file names from a given directory
 * @param {String} directoryPath
 * @member {Array} joinedFilePaths
 * @returns {Array} - joinedFilePaths
 * @callback
 */
function getFilePath(directoryPath, fn) {

	fs.readdir(directoryPath, function(error, files) {
		let joinedFilePath = [];

		if (error) {
			fn(error, undefined);
		} else {
			files.map(function(file) {
				return path.join(directoryPath, file);
			})
			.filter(function(file) {
				if (path.extname(file) === '.xml') {
					return fs.statSync(file).isFile();
				}
			})
			.forEach(function (file) {
				return joinedFilePath.push(file);
			});
		}
		return fn(undefined, joinedFilePath);
	});
}

/**
 * Copy file from source to destination
 * @param {String} sorceFilePath
 * @param {String} destinationPath
 * @returns
 * @callback
 */
function moveScheduleDataFileString(sourceFilePath, destinationPath, fn) {
	let currentDate = getCurrentDate(),
			currentFile = path.parse(sourceFilePath),
			finalPath		= destinationPath + currentDate + currentFile.name + currentFile.ext;
			// finalPath		= destinationPath + currentFile.name + currentDate + currentFile.ext;

	if (fs.existsSync(sourceFilePath) === true) {
		fs.readFile(sourceFilePath, function(error, data) {
			if (error) {
				fn(error, undefined);
			} else {
				fs.writeFile(finalPath, data, function(error) {
					if (error) {
						fn(error, undefined);
					} else {
						console.log('Success! %s moved to %s.', currentFile.name, destinationPath);
						return finalPath;
					}
				});
			}
			fn(undefined, finalPath);
		});
	}
}

/**
 * Copy file from source to destination
 * @param {Array} sorceFilePath - An array of strings to be moved
 * @param {String} destinationPath
 * @returns
 * @callback
 */
function moveScheduleDataFileArray(sourceFilePath, destinationPath, fn) {
	let currentDate = getCurrentDate(),
			filesMoved 	= [];

	sourceFilePath.forEach(function(filePath) {
		if (fs.existsSync(filePath) === true) {
			fs.readFile(filePath, function(error, data) {
				if (error) {
					fn(error, undefined);
				} else {
					fs.writeFile(destinationPath + currentDate + path.basename(filePath), data, function(error, fn) {
						if (error) {
							fn(error, undefined);
						} else {
							console.log('Success! %s moved to %s.', path.basename(filePath), destinationPath);
							console.log(filesMoved);
							return filesMoved.push(filePath);
						}
					});
					fn(undefined, filesMoved);
				}
			});
		}
	});
}

/**
 * Remove file from source location
 * @param {Array} sorceFilePath - An array of strings to be removed
 * @returns {String} - If all files removed, confirmation message
 * @callback
 */
function removeFile(sourceFilePath, fn) {
	if (error) {
		console.log(error);
	}
		sourceFilePath.forEach(function(filePath) {
			if (fs.existsSync(sourceFilePath) === true) {
				fs.unlink(sourceFilePath, function(error) {
					if (error) {
					console.log(error);
				}
					return console.log('%s removed.', sourceFilePath);
			});
		}
	})
}

/**
 * Remove file from source location
 * @param {string} sorceFilePath - A file path string to be removed
 * @returns {String} - If all files removed, confirmation message
 * @callback
 */
function removeSingleFile(filePath, fn) {
		fs.unlink(filePath, function(error) {
			if (error) {
			console.log(error);
		}
			return console.log('%s removed.', filePath);
	});
}

export { createDirectoryPath };
export { verifyFilePath };
export { leadingZero };
export { getCurrentDate };
export { getFilePath };
export { moveScheduleDataFileString };
export { moveScheduleDataFileArray };
export { removeFile };
export { removeSingleFile };
export { baseDirectory };
export { backupDataDirectoryPath };
export { currentDataDirectoryPath };
// export { createDirectoryPath, verifyFilePath, leadingZero, getCurrentDate, getFilePath, moveScheduleDataFileString, moveScheduleDataFileArray, removeFile, removeSingleFile};
// export * from './importScheduleData.js';