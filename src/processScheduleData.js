
import mongoose from 'mongoose';
import * as fs from 'fs';
import * as path from 'path';
import { jsonScheduleData } from './helpers/convertXMLToJSON';

import {
	mongoURI,
	mongoDB,
	removeAllInsert,
	verifyDB
	} from './database';

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

createDirectoryPath(process.env.WATCH_DIR);

beginWatchingDirectory(process.env.WATCH_DIR);

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
});

/*

verify origination directory exists

	if so, stop.

	if not, create the directory

watch origination directory for file changes

	If changes, announce type of chagne to parent process

Read directory contents, adding file names to a list

	Report each file name to partent process

Once the file threshold is reached, pass on the list

Write / save list of files to working / backup directories

Pass file names to parser for converstion from XML to JSON

	Report each file processed to parent process

For each parsed file, extract schedule object

	Report each object extracted to partent process

Save schedule object to db

	Report each object saved to parent process

*/
