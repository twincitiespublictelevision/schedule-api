
import * as path from 'path';
import { jsonScheduleData } from './helpers/convertXMLToJSON';

import {
	mongoURI,
	mongoDB,
	multipleInsert,
	removeAllInsert,
	removeAll,
	} from './database';

import {
	removeSingleFile,
	extractScheduleData
} from './helpers/importScheduleData';

function timedMultipleInsert(mongoDB, fullScheduleData, file, callback) {
	let scheduleCollection = mongoDB.collection('scheduleData');
	let removeStart = Date.now();

	scheduleCollection.remove({'schedule.schedule_channel': fullScheduleData[0].schedule.schedule_channel}, function(){
		console.log(`Removing ${file} documents took: ${Date.now() - removeStart} ms`);
		let addingStart = Date.now();
		scheduleCollection.insertMany(fullScheduleData, function(error, result) {
			if(error) {
				console.log(error);
			}
				console.log(`Adding ${file} documents took: ${Date.now() - addingStart} ms`);
				console.log(`Done ${file} at ${Date.now()}.`);
			});
	});
};

module.exports = function handleFile(file) {
	let filename = path.basename(file);

	jsonScheduleData(file, function(error, parseData) {
		if (error) {
			console.log(error);
		} else {
			let scheduleData = extractScheduleData(parseData);
			console.log(`Starting DB write of ${filename}.`);
			timedMultipleInsert(mongoDB, scheduleData, filename);
		}
		removeSingleFile(file);
	});
}

// getFilePaths(process.env.WORKING_DIR, '.xml', fs.readdir, function(error, joinedFilePaths) {
// 	if (error) {
// 		console.log(error)
// 	} else {
// 		let progress = joinedFilePaths.map(function() {
// 			return 1;
// 		});

// 			joinedFilePaths.forEach(function(file, index) {
// 				console.log(`Begin parsing ${file}.`);

// 				jsonScheduleData(file, function(error, parseData) {
// 					if (error) {
// 						console.log(error);
// 					} else {
// 						let scheduleData = extractScheduleData(parseData);
// 						timedMultipleInsert(mongoDB, scheduleData);
// 					}
// 					removeSingleFile(file);

// 					progress[index] = 0;

// 					if (progress.reduce(function(sum, current) {
// 						return sum + current;
// 						}, 0) === 0) {

// 						console.log('PSE task finished, closing process.');
// 						process.send({finished: true});
// 						// process.exitCode(1);
// 					}

// 						// console.log(`Parse progress value ending, ${progress}`);
// 				});
// 			});
// 		}
// });
