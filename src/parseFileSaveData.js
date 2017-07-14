
import * as path from 'path';
import { jsonScheduleData } from './helpers/convertXMLToJSON';
import { extractScheduleData } from './helpers/dataTransform';
import { removeSingleFile } from './helpers/fileInOut';
import {
	mongoDB,
	removeOldInsertNew,
	} from './database';

function parseFileSaveData(file) {
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

export { parseFileSaveData };
