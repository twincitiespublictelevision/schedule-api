
import {
	createDirectoryPath,
	beginWatchingDirectory
} from './helpers/fileInOut';

createDirectoryPath(process.env.WATCH_DIR);

beginWatchingDirectory(process.env.WATCH_DIR);
