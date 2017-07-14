
import {
	createDirectoryPath,
	beginWatchingDirectory
} from './helpers/fileInOut';

createDirectoryPath(process.env.WORKING_DIR);

beginWatchingDirectory(process.env.WORKING_DIR);
