import * as fs from 'fs';
import xml2js from 'xml2js';

// const tpt2XMLData 		= fs.readFileSync(__dirname + '/../../data/sampleSchedule.xml', 'utf-8');
// const tptLifeXMLData	= fs.readFileSync(__dirname + '/../../data/sampleSchedule.xml', 'utf-8');
// const tptKidsXMLData	= fs.readFileSync(__dirname + '/../../data/sampleSchedule.xml', 'utf-8');
// const tptMNXMLData		= fs.readFileSync(__dirname + '/../../data/sampleSchedule.xml', 'utf-8');

const proTrackScheduleData = (__dirname + '/../../data/sampleSchedule.xml');

// {{{{{{{{{{{{{{{{{{{{{{{{{ xml2js }}}}}}}}}}}}}}}}}}}}}}}}}

const xml2jsParser = new xml2js.Parser({
		ignoreAttrs: true,
		includeWhiteChars: true,
		explicitArray: false,
		emptyTag: null,
		valueProcessors: [
			function parseNumbers (str) {
    		if (!isNaN(str)) {
    			str = str % 1 === 0 ? parseInt(str, 10) : parseFloat(str);
    		}
    		return str;
  	}]
	});

// working async version

function jsonScheduleData(xml, fn) {
	fs.readFile(xml, function(error, data) {
		if (error) {
			// return [error, undefined];
			fn(error, undefined);
		} else {
			// callback function to parse XML data to JSON
			xml2jsParser.parseString(data, function(error, result) {
				if (error) {
					fn(error, undefined);
				} else {
					fn(undefined, result);
				}
			});	
		}
	});
}

jsonScheduleData(proTrackScheduleData, function(error, data) {
	// Here is where we do something with the returned data / result
	console.log(data);
});

// working synchronous version

// const xmlBufferData = fs.readFileSync(__dirname + '/../../data/sampleSchedule.xml', 'utf-8');

// var parsedScheduleData = {};

// function jsonScheduleData(xml) {
// 	xml2jsParser.parseString(xml, function(error, result) {
// 		parsedScheduleData = result;
// 		console.log('Finished');
// 	});
// }

// jsonScheduleData(xmlBufferData);
// console.log(parsedScheduleData);

// console.log(parsedScheduleData.schedule_data.series.episode.epi_genrelist_nat);
 export { jsonScheduleData };