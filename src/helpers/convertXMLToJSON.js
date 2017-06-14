import * as fs from 'fs';
import xml2js from 'xml2js';

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

function jsonScheduleData(xmlFile, fn) {
	fs.readFile(xmlFile, function(error, data) {
		if (error) {
			fn(error, undefined);
		} else {
			// callback function to parse XML data to JSON
			xml2jsParser.parseString(data, function(error, parseData) {
				if (error) {
					fn(error, undefined);
				} else {
					fn(undefined, parseData);
				}
			});	
		}
	});
}

 export { jsonScheduleData };
