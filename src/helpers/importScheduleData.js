import * as fs from 	'fs';
import * as path from 'path';
import * as util from 'util';

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
 * Watch a given directory for changes
 * @param {String} directoryPath - path to watch
 * @return {Boolean}
 */
function watchDirectory(directoryPath) {
	if (fs.existsSync(directoryPath) === true) {
		console.log('Monitoring %s', directoryPath);
		fs.watch(directoryPath, function(eventType) {
			if (eventType === 'rename') {
				console.log('A file arrived.');
			}
				console.log(eventType);
		});
		return true;
	} else {
		console.log('Not currently monitoring %s ', directoryPath + '.');
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
 * Save new JSON file in working directory for processing
 * @param {String} sorceFilePath
 * @param {Object} parseData - Return value of parsed file
 * @returns {String} finalPath
 * @callback
 */
function saveParsedFile(xmlFile, parseData, fn) {
	let currentDate = getCurrentDate(),
			currentFile = path.parse(xmlFile),
			finalPath		= currentDataDirectoryPath + currentDate + currentFile.name + '.json',
			jsonString	= JSON.stringify(parseData);

	if (jsonString !== undefined) {
		fs.writeFile(finalPath, jsonString, function(error) {
			if (error) {
				fn(error, undefined);
			} else {
				console.log('Success! %s saved.', currentFile.name + currentFile.ext);
				return finalPath;
			}
		});
	}
	fn(undefined, finalPath);
}

/**
 * Get file names, paths from a given directory
 * @param {String} directoryPath - Directory to read
 * @param {String} fileType - Type of file to return
 * @member {Array} joinedFilePaths
 * @returns {Array} - joinedFilePaths - All files that matched fileType
 * @callback
 */
function getFilePath(directoryPath, fileType, fn) {

	fs.readdir(directoryPath, function(error, files) {
		let joinedFilePath = [];

		if (error) {
			fn(error, undefined);
		} else {
			files.map(function(file) {
				return path.join(directoryPath, file);
			})
			.filter(function(file) {
				if (path.extname(file) === fileType) {
					return fs.statSync(file).isFile();
				} else {
					return console.log('Not an %s file, moving on.', fileType);
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

/**
 * Traverse data structure using the map method, 
 * retrieving the objects we want in the order we want along the way.
 * The goal is to invert the parsed object, pulling the most nested
 * bits of data out.
 * @param {Object} data - An object to be traversed
 * @returns {Array} - collectedData
 */
function extractScheduleData(parseData) {

	let full_data = parseData.schedule_data.series.map(series => {
		let series_airings = series.episode.map(episode => {
			let episode_airings;
			if (episode.schedule.length && episode.schedule.length > 1) {
				episode_airings = episode.schedule.map(schedule => {
				return(series, episode, schedule);
				});
			} else {
				episode_airings = [episode.schedule];
			}
			return episode_airings;
		})
		return [].concat.apply([], series_airings);
	})
	return [].concat.apply([], full_data);
}

export { createDirectoryPath };
export { verifyFilePath };
export { watchDirectory };
export { leadingZero };
export { getCurrentDate };
export { saveParsedFile };
export { getFilePath };
export { moveScheduleDataFileString };
export { moveScheduleDataFileArray };
export { removeFile };
export { removeSingleFile };
export { baseDirectory };
export { backupDataDirectoryPath };
export { currentDataDirectoryPath };
export { extractScheduleData };
