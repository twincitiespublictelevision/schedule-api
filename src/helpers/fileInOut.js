
import * as fs from 	'fs';
import * as path from 'path';

/**
 * Verify a given directory path exists.
 * If not, create directory
 * @param {String} directoryPath - path to verify or create
 * @return
 */
function createDirectoryPath(directoryPath) {
	if (verifyFilePath(directoryPath) === true) {
		console.log(`That directory already exists, the path is, ${directoryPath}`);
	} else {
		createDirectory(directoryPath);
	}
}

/**
 * Verify a given directory path exists,
 * @param {String} directoryPath - path to verify
 * @return {Boolean}
 */
function verifyFilePath(filePath) {
	if (fs.existsSync(filePath) === true) {
		return true;
	} else {
		return false;
	}
}

/**
 * Create a directory at the given path,
 * @param {String} directoryPath - path of directory to create.
 * @return {Boolean}
 */
function createDirectory(directoryPath) {
	fs.mkdir(directoryPath, function(error) {
		if (error) {
			console.log(error);
		}
		console.log(`Created directory, the path is, ${directoryPath}`);
	});
}

/**
 * Starts watching a given directory if it exists.
 * @param {String} directoryPath - path to watch
 * @return {Boolean}
 */
function beginWatchingDirectory(directoryPath) {
	if (verifyFilePath(directoryPath) === true) {
		console.log(`Now watching, ${directoryPath}.`);
		monitorDirectory(directoryPath);
		return true
	} else {
		console.log(`Not currently monitoring, ${directoryPath}.`);
		return false;
	}
}

/**
 * Returns the file extension of a given file
 * @param {String} sorceFilePath
 * @returns {String} - Returns a string representing the file extension
 */
function getFileType(file) {
	return path.extname(file);
}

/**
 * Verify a given item in the directory is a file.
 * @param {String} file
 * @returns {Boolean}
 */
function verifyItemIsAFile(file) {
	return fs.statSync(file).isFile();
}

/**
 * Watch a given directory for changes
 * @param {String} directoryPath - path to watch
 * @return {Boolean}
 */
function monitorDirectory(directoryPath) {
	fs.watch(directoryPath, function(eventType, filename) {
		if (eventType === 'rename' &&
				getFileType(filename) === '.xml' &&
				verifyFilePath(directoryPath+filename) === true) {
			console.log(`Saw event for ${filename} at ${Date.now()}.`);
			process.send({
				start: true,
				file: directoryPath+filename
			});
			console.log(`New event detected, ${eventType} on ${filename}.`);
		} else {
			console.log(`That file, ${filename}, has been removed. No action taken.`);
		}
	});
}

/**
 * Add leading 0 to integers less than 10 but greater than 0
 * Coerce number to string through concatenation
 * @param {Number} num
 * @return {String}
 */
function leadingZero(num) {
	if (num < 10 && num >= 0) {
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
			ms 		= leadingZero(currentDate.getMilliseconds()),
			MM 		= leadingZero(currentDate.getMonth() + 1),
			DD 		= leadingZero(currentDate.getDate()),
			YYYY 	= currentDate.getFullYear(),
			formattedDateString = `${YYYY}${MM}${DD}_${HH}\u2236${mi}\u2236${ms}_`;

	return formattedDateString;
}

/**
 * Copy file to working and backup directories
 * @param {String} file - A file path to read / write to the given directories
 * @member {Function} currentDate - Function that returns a date string to append to the file
 * @returns
 */
function moveFile(file) {
	let currentDate = getCurrentDate();

	fs.readFile(file, function(error, data) {
		if (error) {
			console.log(error);
		}
		fs.writeFile(process.env.BACKUP_DIR + currentDate + path.basename(file), data, function(error) {
			if (error) {
				console.log(error);
			}
			fs.writeFile(process.env.WORKING_DIR + currentDate + path.basename(file), data, function(error) {
				if (error) {
					console.log(error);
				}
				fs.unlink(file, function(error) {
					if (error) {
						console.log(error);
					}
					console.log(`Deleted ${path.basename(file)}.`);
				});
			});
		});
	});
}

/**
 * Remove file from source location, sync
 * @param {string} filePath - A file path string to be removed
 * @returns {Boolean} - If all files removed, returns true
 * @callback
 */
function removeSingleFile(filePath) {
	fs.unlinkSync(filePath);
}

export {
	createDirectoryPath,
	verifyFilePath,
	beginWatchingDirectory,
	getFileType,
	verifyItemIsAFile,
	leadingZero,
	getCurrentDate,
	moveFile,
	removeSingleFile,
};
