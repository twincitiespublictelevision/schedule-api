import mongodb from 'mongodb';
import {
	mongoDB,
	findAll
} from '../database';

import { Router } from 'express';

export default class ChannelRouter {

	// We use the mount path as the constructor argument
	constructor(path = '/api/v1/channels') {
		// Instantiate the express.Router
		this.router = Router();
		this.path = path;
		this.init();
	}

	/**
	 * Return all data in channels
	 */
	getAll(request, response) {
		let scheduleCollection = mongoDB.collection('scheduleData');

		scheduleCollection.find().toArray(function(error, docs) {
			if (error) {
				console.log(error);
			}
			response.status(200).json(docs);
		});
	}

	/**
	 * Attach route handlers to their endopoints
	 */
	init() {
		this.router.get('/', this.getAll);
	}	
}