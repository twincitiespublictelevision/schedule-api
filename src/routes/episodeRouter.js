
import mongodb from 'mongodb';
import {
	mongoDB,
	findAll
} from '../database';

import { Router } from 'express';

export default class EpisodeRouter {

	// We use the mount path as the constructor argument
	constructor(path = '/api/v1/episodes') {
		// Instantiate the express.Router
		this.router = Router();
		this.path = path;
		this.init();
	}

	/**
	 * Return an episode by its ID number
	 * @description example URL - http://localhost:3000/api/v1/episodes/277918
	 * @ param {String} request - the request string
	 * @ param {String} response - the response string
	 * @ member {Function} scheduleCollection - links to mongoDB collection
	 * @ external {}
	 */
	getEpisodeById(request, response) {
		let scheduleCollection = mongoDB.collection('scheduleData');
		let episodeID = parseInt(request.params.id);

		scheduleCollection.find( {
			'episode.program_id' : episodeID
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
	 * Return a version of an episode by its version ID number
	 * @description example URL - http://localhost:3000/api/v1/episodes/292098/version/331883
	 * @ param {String} request - the request string
	 * @ param {String} response - the response string
	 * @ member {Function} scheduleCollection - links to mongoDB collection
	 * @ external {}
	 */
	getEpisodeByEpisodeVersionId(request, response) {
		let scheduleCollection = mongoDB.collection('scheduleData');
		let episodeID = parseInt(request.params.id);
		let versionID = parseInt(request.params.versionID);

		scheduleCollection.find( { $and: [
			{ 'episode.program_id' : episodeID },
			{ 'episode.version_id' : versionID }
			] } )
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
	 * Return all episodes airing on a specific date
	 * @description example URL - $eq - http://localhost:3000/api/v1/episodes/292098/date/2017-05-04T16:30:00
	 * @ param {String} request - the request string
	 * @ param {String} response - the response string
	 * @ member {Function} scheduleCollection - links to mongoDB collection
	 * @ external {}
	 */
	getEpisodeByDate(request, response) {
		let scheduleCollection = mongoDB.collection('scheduleData');
		let episodeID = parseInt(request.params.id);
		let requestedDate = request.params.date;

		scheduleCollection.find( { $and : [
			{ 'episode.program_id' : episodeID },
			{ 'schedule.schedule_date' : { '$eq' : new Date(requestedDate) } }
		] } )
		.limit( 10 )
		.toArray(function(error, docs) {
			if (error) {
				console.log(error);
			}
			response.status(200)
			.json(docs);
		});
	}

	// getEpisodeByDateRangeHandler(mongo) {
	// 	return function(request, response) {
	// 		return this.getEpisodeByDateRange(request, response, mongo);
	// 	}
	// }

	/**
	 * Return all episodes airing on a specific date
	 * @description example URL - http://localhost:3000/api/v1/episodes/292104/startdate/2017-05-04T16:30:00Z/enddate/2017-05-28T16:30:00Z
	 * @ param {String} request - the request string
	 * @ param {String} response - the response string
	 * @ member {Function} scheduleCollection - links to mongoDB collection
	 * @ external {}
	 */
	getEpisodeByDateRange(request, response) {
		let scheduleCollection = mongoDB.collection('scheduleData');
		let episodeID = parseInt(request.params.id);
		let requestedStartDate = request.params.startDate;
		let requestedEndDate = request.params.endDate;


		// let dateRegex = /^\d\d\d\d\-\d\d\-\d\dT\d\d:\d\d:\d\dZ$/;
		// let invalidFields = [];

		// if (requestedStartDate.search(dateRegex) === -1) {
		// 	invalidFields.push('startdate');
		// }

		// if (requestedEndDate.search(dateRegex) === -1) {
		// 	invalidFields.push('enddate');
		// }

		// if (invalidFields.length > 0) {
		// 	response.status(400)
		// 	.json({
		// 		error: {
		// 			code: 1234,
		// 			message: 'Bad / Malformed Request',
		// 			description: invalidFields
		// 		}
		// 	});
		// } else {

			scheduleCollection.find( { $and : [
				{ 'episode.program_id' : episodeID },
				{ 'schedule.schedule_date' : {
					'$gte' : new Date(requestedStartDate),
					'$lte' : new Date(requestedEndDate) } }
	       ] } )
			.limit( 10 )
			.toArray(function(error, docs) {
				if (error) {
					console.log(error);
				}
				response.status(200)
				.json(docs);
			});
		}
	// }

	/**
	 * Attach route handlers to their endopoints
	 */
	init() {
		this.router.get('/:id', this.getEpisodeById);
		this.router.get('/:id/version/:versionID', this.getEpisodeByEpisodeVersionId);
		this.router.get('/:id/date/:date', this.getEpisodeByDate);
		this.router.get('/:id/startdate/:startDate/enddate/:endDate', this.getEpisodeByDateRange);
	}
}
