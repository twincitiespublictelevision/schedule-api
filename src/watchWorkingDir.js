
import {
	createDirectoryPath,
	beginWatchingDirectory
} from './helpers/importScheduleData';

createDirectoryPath(process.env.WORKING_DIR);

beginWatchingDirectory(process.env.WORKING_DIR);
