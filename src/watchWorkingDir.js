
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

createDirectoryPath(process.env.WORKING_DIR);

beginWatchingDirectory(process.env.WORKING_DIR);