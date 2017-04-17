import express from 'express';
import morgan from 'morgan';
import bodyParser from 'body-parser';

import ChannelRouter from './routes/channelRouter';

export default class api {

	constructor() {
		this.express = express();
		this.middleware();
		this.routes();
	}

	//register middleware
	middleware() {
		this.express.use(morgan('dev'));
		this.express.use(bodyParser.json());
		this.express.use(bodyParser.urlencoded({ extended: false }));
	}

	//connect resource routers
	routes() {

		const channelRouter = new ChannelRouter();

		this.express.use(channelRouter.path, channelRouter.router);
	}
}