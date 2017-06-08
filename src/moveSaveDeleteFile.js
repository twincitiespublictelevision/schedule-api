
import * as fs from 'fs';
import * as path from 'path';

import {
	baseDirectory,
	backupDataDirectoryPath,
	currentDataDirectoryPath,
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

getFilePaths(process.env.WATCH_DIR, '.xml', fs.readdir, function(error, joinedFilePaths) {
	if (error) {
		console.log(error)
	} else {
		moveRawScheduleDataFile(joinedFilePaths, [process.env.BACKUP_DIR, process.env.WORKING_DIR], function(error, sourceFilePath) {
			if (error) {
				console.log(error)
			}
		});
		removeFile(joinedFilePaths, function(error) {
			if (error) {
				console.log(error);
			}
		});
	}
	console.log('Task finished, closing process.');
	process.send({finished: true});
});
