
import express from 'express';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import * as fs from 'fs';
import ChannelRouter from './routes/channelRouter';

const serverLogsPath = process.env.ACCESS_LOG;
const accessLogStream = fs.createWriteStream(serverLogsPath, {flags: 'a'});

export default class Api {

	constructor() {
		this.express = express();
		this.middleware();
		this.routes();
	}

	//register middleware
	middleware() {
		this.express.use(bodyParser.json());
		this.express.use(bodyParser.urlencoded({ extended: false }));
		this.express.use(morgan('dev'));
		this.express.use(morgan('{' +
		'"remote_addr": ":remote-addr",' +
		'"remote_user": ":remote-user",' +
		'"date": ":date[clf]",' +
		'"method": ":method",' +
		'"url": ":url",' +
		'"http_version": ":http-version",' +
		'"status": ":status",' +
		'"result_length": ":res[content-length]",' +
		'"referrer": ":referrer",' +
		'"user_agent": ":user-agent",' +
		'"response_time": ":response-time" }',
		{stream: accessLogStream}));
	}

	//connect resource routers
	routes() {

		const channelRouter = new ChannelRouter();

		this.express.use(channelRouter.path, channelRouter.router);
	}
}
