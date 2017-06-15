
import * as fs from 'fs';
import * as path from 'path';

import {
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
	verifyItemIsAFile,
	getFileType,
	filterFilePaths,
	getFilePaths,
	extractScheduleData
} from './helpers/importScheduleData';

// module.exports = function moveFile(file) {
// 	let currentDate = getCurrentDate();

// 	fs.readFile(file, function(error, data) {
// 		if (error) {
// 			console.log(error);
// 		}
// 		fs.writeFile(process.env.BACKUP_DIR + currentDate + path.basename(file), data, function(error) {
// 			if (error) {
// 				console.log(error);
// 			}
// 			fs.writeFile(process.env.WORKING_DIR + currentDate + path.basename(file), data, function(error) {
// 				if (error) {
// 					console.log(error);
// 				}
// 				fs.unlink(file, function(error) {
// 					if (error) {
// 						console.log(error);	
// 					}
// 					console.log(`Deleted ${path.basename(file)}.`);
// 				});
// 			});
// 		});
// 	});

	// moveRawScheduleDataFile(file, [process.env.BACKUP_DIR, process.env.WORKING_DIR], function(error, sourceFilePath) {
	// 			if (error) {
	// 				console.log(error);
	// 			} else {
	// 				removeFile(sourceFilePath, function(error) {
	// 					if (error) {
	// 						console.log(error);
	// 					} else {
	// 						console.log(`${sourceFilePath}.`);
	// 					}
	// 				});
	// 				// console.log(`${sourceFilePath}.`);
	// 				// console.log(`${progress}MSD task finished, closing process.`);
	// 			}
				
	// 			// console.log(`${progress}MSD task finished, closing process.`);
	// 			// process.send({finished: true});
	// 			// process.send({'finished': true}, 'ipc');
	// 			// process.send('Hello From MSD');
	// 			// process.disconnect();

	// 		});	
// }

// getFilePaths(process.env.WATCH_DIR, '.xml', fs.readdir, function(error, joinedFilePaths) {
// 	if (error) {
// 		console.log(error);
// 	} else {

// 		joinedFilePaths.forEach(function(file, index) {
// 			console.log(`Moving ${file}.`);

// 			moveRawScheduleDataFile(file, [process.env.BACKUP_DIR, process.env.WORKING_DIR], function(error, sourceFilePath) {
// 				if (error) {
// 					console.log(error);
// 				} else {
// 					removeFile(sourceFilePath, function(error) {
// 						if (error) {
// 							console.log(error);
// 						} else {
// 							console.log(`${sourceFilePath}.`);
// 						}
// 					});
// 					// console.log(`${sourceFilePath}.`);
// 					// console.log(`${progress}MSD task finished, closing process.`);
// 				}
				
// 				// console.log(`${progress}MSD task finished, closing process.`);
// 				// process.send({finished: true});
// 				// process.send({'finished': true}, 'ipc');
// 				// process.send('Hello From MSD');
// 				// process.disconnect();

// 			});
// 			// removeSingleFile(file);
// 		});
// 	}
// });
