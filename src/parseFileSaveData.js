
import * as path from 'path';
import { jsonScheduleData } from './helpers/convertXMLToJSON';

import {
	mongoDB,
	removeOldInsertNew,
	} from './database';

import {
	removeSingleFile,
	extractScheduleData
} from './helpers/importScheduleData';

function handleFile(file) {
	let filename = path.basename(file);

	jsonScheduleData(file, function(error, parseData) {
		if (error) {
			console.log(error);
		} else {
			let scheduleData = extractScheduleData(parseData);
			console.log(`Starting DB write of ${filename}.`);
			removeOldInsertNew(mongoDB, scheduleData);
		}
		removeSingleFile(file);
	});
}

export { handleFile };
