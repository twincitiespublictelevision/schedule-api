
import mongoose from 'mongoose';
import * as fs from 'fs';
import * as path from 'path';
import { jsonScheduleData } from './helpers/convertXMLToJSON';

import {
	mongoURI,
	mongoDB,
	removeAllInsert
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

function removeScheduleData(mongoDB, data, callback) {
	let scheduleCollection = mongoDB.collection('scheudleData');

	scheduleCollection.remove({}, function(error) {
		if (error) {
			console.log(error);
		}
	});
}

function insertAllScheduleData(mongoDB, fullScheduleData, callback) {
	let scheduleCollection = mongoDB.collection('scheduleData');

	scheduleCollection.insertMany(fullScheduleData, function(error, result) {
		if(error) {
			console.log(error);
		}
		return result;
	});
};

function timedInsertScheduleData(mongoDB, fullScheduleData, callback) {
	let scheduleCollection = mongoDB.collection('scheduleData');
	let start = Date.now();

	scheduleCollection.remove({}, function(){
		console.log('Removed documents. ', Date.now() - start);
		start = Date.now();
		scheduleCollection.insertMany(fullScheduleData, function(error, result) {
			if(error) {
				console.log(error);
			}
				console.log('Inserted documents. ', Date.now() - start);
			});
	});
};

getFilePaths(process.env.WORKING_DIR, '.xml', fs.readdir, function(error, joinedFilePaths) {
	if (error) {
		console.log(error)
	} else {
		joinedFilePaths.forEach(function(file) {
			jsonScheduleData(file, function(error, parseData) {
				if (error) {
					console.log(error);
				} else {
					let scheduleData = extractScheduleData(parseData);
					insertAllScheduleData(mongoDB, scheduleData);
				}
			});
			removeFile(joinedFilePaths, function(error) {
				if (error) {
					console.log(error);
				}
			});
		});
	}
	console.log('Task finished, closing process.');
	process.send({finished: true});
});
