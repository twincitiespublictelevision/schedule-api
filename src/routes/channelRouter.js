import airings from '../../data/channels';
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
		response.status(200).json(airings);
	}

	/**
	 * Attach route handlers to their endopoints
	 */
	init() {
		this.router.get('/', this.getAll);
	}	
}