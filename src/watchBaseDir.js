
import {
	createDirectoryPath,
	beginWatchingDirectory
} from './helpers/importScheduleData';

createDirectoryPath(process.env.WATCH_DIR);

beginWatchingDirectory(process.env.WATCH_DIR);
