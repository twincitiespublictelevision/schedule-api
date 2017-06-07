import * as fs from 	'fs';
import * as path from 'path';
import * as util from 'util';

const baseDirectory 						= (__dirname + '/../../data');
const backupDataDirectoryPath 	= (__dirname + '/../../data/backupScheduleData/');
const currentDataDirectoryPath 	= (__dirname + '/../../data/currentScheduleData/');

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
		return console.log(`Created directory, the path is, ${directoryPath}`);
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
 * Watch a given directory for changes
 * @param {String} directoryPath - path to watch
 * @return {Boolean}
 */
function monitorDirectory(directoryPath) {
	fs.watch(directoryPath, function(eventType, filename) {
		if (eventType === 'rename' || 'change') {
			console.log(`New event decteced, ${eventType} on ${filename}.`);
		} else {
			console.log('Something happened in the watched directory...');
		}
	});
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
			ms 		= leadingZero(currentDate.getMilliseconds()),
			MM 		= leadingZero(currentDate.getMonth() + 1),
			DD 		= leadingZero(currentDate.getDate()),
			YYYY 	= currentDate.getFullYear(),
			formattedDateString = `${YYYY}${MM}${DD}_${HH}\u2236${mi}\u2236${ms}_`;

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
// function getFilePaths(directoryPath, fileType) {
// 	var joinedFilePath = getAllDirectoryFiles(directoryPath);

// 	joinedFilePath.map(function(file) {
// 		return path.join(directoryPath, file);
// 	})
// 	.filter(function(file) {
// 		if (getFileType(file) === fileType) {
// 			return verifyItemIsAFile(file);
// 		} else {
// 			return console.log(`Item is not a ${fileType} file, moving on.`);
// 		}
// 	})
// 	.forEach(function (file) {
// 		return joinedFilePath.push(file);
// 	});
// 	console.log(joinedFilePath);
// 	return joinedFilePath;
// }


// function getFilePaths(directoryPath, readDirectory) {
// 	let filePaths = readDirectory(directoryPath);
// 	let joinedFilePath = [];

// 	filePaths.map(function(file) {
// 		joinedFilePath.push(path.join(directoryPath, file));
// 	});
// 	// console.log(joinedFilePath);
// 	return joinedFilePath;
// }

// function getFilePaths(directoryPath, readDirectory, fn) {

// 	readDirectory(directoryPath, function(error, files) {
// 	let joinedFilePath = [];

// 		if (error) {
// 			fn(error, undefined);
// 		} else {
// 			files.map(function(file) {
// 				joinedFilePath.push(path.join(directoryPath, file));
// 			});
// 			console.log(joinedFilePath);
// 			return joinedFilePath;
// 		}
// 	});
// }

function filterFilePaths(filePaths, fileType, getFileType, verifyItemIsAFile) {
	var filteredFilePaths = filePaths.filter(function(file) {
		if (getFileType(file) === fileType) {
			return verifyItemIsAFile(file)
		} else {
			console.log(`Item is not a ${fileType} file, moving on.`);
		}
	});
}

function getFilePaths(directoryPath, fileType, readDirectory, fn) {
	
	readDirectory(directoryPath, function(error, files) {
		let joinedFilePath = [];

		if (error) {
			fn(error, undefined);
		} else {
			files.map(function(file) {
				return path.join(directoryPath, file);
			})
			.filter(function(file) {
				if (getFileType(file) === fileType) {
					return verifyItemIsAFile(file);
				} else {
					return console.log(`Item is not a ${fileType} file, moving on.`);
				}
			})
			.forEach(function (file) {
				return joinedFilePath.push(file);
			});
		}
		console.log(joinedFilePath);
		return fn(undefined, joinedFilePath);
	});
}

// function getAllDirectoryFiles(directoryPath, fn) {
// 	fs.readdir(directoryPath, function(error, files) {
// 		console.log()
// 		// let joinedFilePath = [];
// 		if (error) {
// 			console.log(error);
// 			// fn (error, undefined);
// 		} else {
// 			// console.log(files);
// 			return files;
// 		}
// 	});
// }

/**
 * Verify a given item in the directory is a file.
 * @param {String} file
 * @returns {Boolean}
 */
function verifyItemIsAFile(file) {
	return fs.statSync(file).isFile();
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
 * Copy file from source to destination
 * @param {Array} sorceFilePath - An array of strings to be moved
 * @param {String || Array} destinationPath
 * @returns
 * @callback
 */
function moveRawScheduleDataFile(sourceFilePath, destinationPath, fn) {
	let currentDate = getCurrentDate(),
			filesMoved 	= [];

	destinationPath.forEach(function(destPath) {	
		sourceFilePath.forEach(function(filePath) {
			fs.readFile(filePath, function(error, data) {
				if (error) {
					fn(error, undefined);
				} else {
					fs.writeFile(destPath + currentDate + path.basename(filePath), data, function(error) {
						if (error) {
							fn(error, undefined);
						} else {
							console.log('Success! %s moved to %s.', path.basename(filePath), destPath);
							filesMoved.push(filePath);
						}
						return filesMoved;
					});
					fn(undefined, filesMoved);
				}
			});
		});
	});
	return sourceFilePath;
}

/**
 * Remove file from source location
 * @param {Array} sorceFilePath - An array of strings to be removed
 * @returns {String} - If all files removed, confirmation message
 * @callback
 */
function removeFile(sourceFilePath, fn) {
	sourceFilePath.forEach(function(filePath) {
		fs.unlink(filePath, function(error) {
			if (error) {
			console.log(error);
			}
			return console.log(`Removed ${filePath}.`);
		});
	});
	fn(undefined, sourceFilePath);
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
	fn(undefined, finalPath);
}

/**
 * Check for a list of genres and ensure proper formatting
 * @param {(?Array|?Object)} genreInput - A list of schedules from the parsed data
 * @returns {Object} singleScheduleObject - An newly formattted object
 */
function convertGenres(genreInput) {
	let newGenreList = [];

	if (genreInput && genreInput.genre) {
		let genres = genreInput.genre.length ? genreInput.genre : [genreInput.genre];

		genres.forEach(function(genre) {
			if (genre.genrecd && genre.genretxt) {
				newGenreList.push(genre);
			}
		});
	}
	return newGenreList;
}

/**
 * Model for the newly formatted object that contains specific schedule info
 * @param {Array} schedule - A list of schedules from the parsed data
 * @returns {Object} singleScheduleObject - An newly formattted object
 */
function scheduleObject(schedule) {

	let scheduleObject = {

		schedule: {
			schedule_channel: schedule.schedule_channel,
			schedule_date: schedule.schedule_date,
			schedule_duration: schedule.schedule_duration
		}
	}
	return scheduleObject;
}

/**
 * Model for the newly formatted object that contains specific episode info
 * @param {Array} episode - A list of episodes from the parsed data
 * @returns {Object} singleEpisodeObject - An newly formattted object
 */
function episodeObject(episode) {

	let episodeObject = {

		episode: {
			program_id: episode.program_id,
			version_id: episode.version_id,
			episode_title: episode.episode_title,
			episode_number: episode.episode_number,
			episode_desc: episode.episode_desc,
			episode_url: episode.episode_url,
			episode_language: episode.episode_language,
			episode_dvi: episode.episode_dvi,
			episode_stereo: episode.episode_stereo,
			episode_hdtv: episode.episode_hdtv,
			version_rating: episode.version_rating,
			version_caption: episode.version_caption,
			package_type: episode.package_type,
			orig_broadcast_date: episode.orig_broadcast_date,
			epi_genrelist_loc: {
				genre: {
					genrecd: episode.epi_genrelist_loc.genre.genrecd,
					genretxt: episode.epi_genrelist_loc.genre.genrecd
				}
			}
		}
	};

	episodeObject.episode.epi_genrelist_loc = convertGenres(episode.epi_genrelist_loc);
	episodeObject.episode.epi_genrelist_nat = convertGenres(episode.epi_genrelist_nat);

	return  episodeObject;
}

/**
 * Model for the newly formatted object that contains specific series info
 * @param {Array} series - A list of series from the parsed data
 * @returns {Object} singleSeriesObject - An newly formattted object
 */
function seriesObject(series) {

	let seriesObject = {

		series: {
			series_id: series.series_id,
			series_code: series.series_code,
			series_title: series.series_title,
			series_desc: series.series_desc,
			series_url: series.series_url,
			series_pgmtype: series.series_pgmtype
		}
	};

	seriesObject.series.series_genrelist_loc = convertGenres(series.series_genrelist_loc);

	return seriesObject;
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
		let episodes = series.episode.length ? series.episode : [series.episode];
		let series_airings = episodes.map(episode => {
			let schedules = episode.schedule.length ? episode.schedule : [episode.schedule];
				return schedules.map(schedule => {
					let finalScheduleObject = {};
					let newScheduleObject = scheduleObject(schedule);
					let newEpisodeObject = episodeObject(episode);
					let newSeriesObject = seriesObject(series);
					return Object.assign({}, newScheduleObject, newEpisodeObject, newSeriesObject);
				});
		})
		return [].concat.apply([], series_airings);
	})
	// console.log(util.inspect(fullScheduleData.concat.apply([], full_data), {showHidden:false, depth:null}));
	return [].concat.apply([], full_data);
}


export {
	createDirectoryPath,
	verifyFilePath,
	beginWatchingDirectory,
	leadingZero,
	getCurrentDate,
	saveParsedFile,
	moveScheduleDataFileString,
	moveRawScheduleDataFile,
	moveScheduleDataFileArray,
	removeFile,
	removeSingleFile,
	baseDirectory,
	backupDataDirectoryPath,
	currentDataDirectoryPath,
	extractScheduleData,
	getFileType,
	filterFilePaths,
	getFilePaths,
	verifyItemIsAFile
};
