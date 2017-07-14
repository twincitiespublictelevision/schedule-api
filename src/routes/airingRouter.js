
import { Router } from 'express';
import { mongoDB } from '../database';

export default class AiringRouter {

	// We use the mount path as the constructor argument
	constructor(path = '/api/v1/airings') {
		// Instantiate the express.Router
		this.router = Router();
		this.path = path;
		this.init();
	}

	/**
	 * Return all airings
	 * @description example URL - http://localhost:3000/api/v1/airings/
	 * @ param {String} request - the request string
	 * @ param {String} response - the response string
	 * @ member {Function} scheduleCollection - links to mongoDB collection
	 * @ external {}
	 */
	getAllAirings(request, response) {
		let scheduleCollection = mongoDB.collection('scheduleData');

		scheduleCollection.find()
		.limit( 20 )
		.toArray(function(error, docs) {
			if (error) {
				console.log(error);
			}
			response.status(200)
			.json(docs);
		});
	}

	/**
	 * Return all airings for a given channel
	 * @description example URL - $eq - http://localhost:3000/api/v1/airings/channel/TPTKIDS
	 * @ param {String} request - the request string
	 * @ param {String} response - the response string
	 * @ member {Function} scheduleCollection - links to mongoDB collection
	 * @ external {}
	 */
	getAiringsByChannel(request, response) {
		let scheduleCollection = mongoDB.collection('scheduleData');
		let channel = request.params.channel;
		let requestedChannel = channel === '2' ? parseInt(channel) : channel;

		scheduleCollection.find( {
			'schedule.schedule_channel' : requestedChannel
		} )
		.limit( 10 )
		.toArray(function(error, docs) {
			if (error) {
				console.log(error);
			}
			response.status(200)
			.json(docs);
		});
	}

	/**
	 * Return all airings for a given date
	 * @description example URL - $eq - http://localhost:3000/api/v1/airings/date/2017-05-04T16:30:00
	 * @ param {String} request - the request string
	 * @ param {String} response - the response string
	 * @ member {Function} scheduleCollection - links to mongoDB collection
	 * @ external {}
	 */
	getAiringsByDate(request, response) {
		let scheduleCollection = mongoDB.collection('scheduleData');
		let requestedDate = request.params.date;

		scheduleCollection.find( {
			'schedule.schedule_date' : { '$eq' : new Date(requestedDate) }
		} )
		.limit( 10 )
		.toArray(function(error, docs) {
			if (error) {
				console.log(error);
			}
			response.status(200)
			.json(docs);
		});
	}

	/**
	 * Return all airings within a give range of dates
	 * @description example URL - http://localhost:3000/api/v1/airings/startdate/2017-05-04T16:30:00Z/enddate/2017-05-28T16:30:00Z
	 * @ param {String} request - the request string
	 * @ param {String} response - the response string
	 * @ member {Function} scheduleCollection - links to mongoDB collection
	 * @ external {}
	 */
	getAiringsByDateRange(request, response) {
		let scheduleCollection = mongoDB.collection('scheduleData');
		let requestedStartDate = request.params.startDate;
		let requestedEndDate = request.params.endDate;
		
		scheduleCollection.find( {
    	'schedule.schedule_date' : {
    		'$gte' : new Date(requestedStartDate),
    		'$lte' : new Date(requestedEndDate) }
       } )
		.limit( 10 )
		.toArray(function(error, docs) {
			if (error) {
				console.log(error);
			}
			response.status(200)
			.json(docs);
		});
	}

	/**
	 * Return all airings within a give range of dates
	 * @description example URL - http://localhost:3000/api/v1/airings/genre/CH
	 * @ param {String} request - the request string
	 * @ param {String} response - the response string
	 * @ member {Function} scheduleCollection - links to mongoDB collection
	 * @ external {}
	 */
	getAiringsByGenreCode(request, response) {
		let scheduleCollection = mongoDB.collection('scheduleData');
		let genreCode = request.params.genreCode;

		scheduleCollection.find( {
			'episode.epi_genrelist_nat.0.genrecd' : genreCode
		} )
		.limit( 10 )
		.toArray(function(error, docs) {
			if (error) {
				console.log(error);
			}
			response.status(200)
			.json(docs);
		});
	}

	/**
	 * Attach route handlers to their endopoints
	 */
	init() {
		this.router.get('/', this.getAllAirings);
		this.router.get('/channel/:channel', this.getAiringsByChannel);
		this.router.get('/date/:date', this.getAiringsByDate);
		this.router.get('/startdate/:startDate/enddate/:endDate', this.getAiringsByDateRange);
		this.router.get('/genre/:genreCode', this.getAiringsByGenreCode);
	}
}
