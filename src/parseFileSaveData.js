
import * as path from 'path';
import { jsonScheduleData } from './helpers/convertXMLToJSON';

import {
	mongoURI,
	mongoDB,
	multipleInsert,
	removeAllInsert,
	removeAll,
	convertDates
	} from './database';

import {
	removeSingleFile,
	extractScheduleData
} from './helpers/importScheduleData';

function removeMultipleInsert(mongoDB, fullScheduleData, file, callback) {
	let scheduleCollection = mongoDB.collection('scheduleData');

	scheduleCollection.remove({'schedule.schedule_channel': fullScheduleData[0].schedule.schedule_channel}, function(){
		scheduleCollection.insertMany(fullScheduleData, function(error, result) {
			if(error) {
				console.log(error);
			}
				convertDates(result);
			});
	});
};

function handleFile(file) {
	let filename = path.basename(file);

	jsonScheduleData(file, function(error, parseData) {
		if (error) {
			console.log(error);
		} else {
			let scheduleData = extractScheduleData(parseData);
			console.log(`Starting DB write of ${filename}.`);
			removeMultipleInsert(mongoDB, scheduleData, filename);
		}
		removeSingleFile(file);
	});
}

export { handleFile };
