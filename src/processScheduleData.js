
import mongoose from 'mongoose';
import * as fs from 'fs';
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
	moveScheduleDataFileArray,
	removeFile,
	removeSingleFile,
	verifyItemIsAFile,
	getFileType,
	// getAllDirectoryFiles,
	getFilePaths,
	extractScheduleData
} from './helpers/importScheduleData';

// const proTrackScheduleData 				= (__dirname + '/../../data/tpt_full_schedule_example.xml');
// const sampleProTrackScheduleData 	= (__dirname + '/../../data/sampleSchedule.xml');
// const smallSamplePTScheduleData 	= (__dirname + '/../../data/smallSampleSchedule.xml');

// getFilePaths(process.env.WATCH_DIR, '.xml', function(error) {
// 	if (error) {
// 		console.log(error);
// 	}
// 		console.log('Maybe??');
// });

// createDirectoryPath(process.env.WATCH_DIR);

// beginWatchingDirectory(process.env.WATCH_DIR);

// verifyItemIsAFile(process.env.ACCESS_LOG);

getFileType(process.env.ACCESS_LOG);

/*

verify origination directory exists

	if so, stop.

	if not, create the directory

watch origination directory for file changes

	If changes, announce type of chagne to parent process

Read directory contents, create list from file names

	Report file names to partent process

Pass file names to parser for converstion from XML to JSON

	Report each file processed to parent process

For each parsed file, extract schedule object

	Report each object extracted to partent process

Save schedule object to db

	Report each object saved to parent process


*/