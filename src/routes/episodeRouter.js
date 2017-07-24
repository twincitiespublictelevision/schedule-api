
import { Router } from 'express';
import { mongoDB } from '../database';

export default class EpisodeRouter {

	// We use the mount path as the constructor argument
	constructor(path = '/api/v1/episodes') {
		// Instantiate the express.Router
		this.router = Router();
		this.path = path;
		this.init();
	}

	/**
	 * Handler used to isolate and enable testing of the core getEpisodeById function
	 * @ param {Object} mongoDB - the object representing the database
	 */
	getEpisodeByIdHandler(mongoDB) {
		return function(request, response) {
			return this.getEpisodeById(request, response, mongoDB);
		}.bind(this);
	}

	/**
	 * Return an episode by its ID number
	 * @description example URL - http://localhost:3000/api/v1/episodes/277918
	 * @ param {String} request - the request string
	 * @ param {String} response - the response string
	 * @ member {Function} scheduleCollection - links to mongoDB collection
	 * @ external {}
	 */
	getEpisodeById(request, response, mongoDB) {
		let scheduleCollection = mongoDB.collection('scheduleData');
		let episodeID = parseInt(request.params.id);
		let requestedLimit = parseInt(request.query.limit);
		let requestedSkip = parseInt(request.query.skip);

		scheduleCollection.find( {
			'episode.program_id' : episodeID
		} )
		.skip( requestedSkip )
		.limit( requestedLimit )
		.toArray(function(error, docs) {
			if (error) {
				console.log(error);
			}
			response.status(200)
			.json(docs);
		});
	}

	/**
	 * Handler used to isolate and enable testing of the core getEpisodeByEpisodeVersionId function
	 * @ param {Object} mongoDB - the object representing the database
	 */
	getEpisodeByEpisodeVersionIdHandler(mongoDB) {
		return function(request, response) {
			return this.getEpisodeByEpisodeVersionId(request, response, mongoDB);
		}.bind(this);
	}

	/**
	 * Return a version of an episode by its version ID number
	 * @description example URL - http://localhost:3000/api/v1/episodes/292098/version/331883
	 * @ param {String} request - the request string
	 * @ param {String} response - the response string
	 * @ member {Function} scheduleCollection - links to mongoDB collection
	 * @ external {}
	 */
	getEpisodeByEpisodeVersionId(request, response, mongoDB) {
		let scheduleCollection = mongoDB.collection('scheduleData');
		let episodeID = parseInt(request.params.id);
		let versionID = parseInt(request.params.versionID);
		let requestedLimit = parseInt(request.query.limit);
		let requestedSkip = parseInt(request.query.skip);

		scheduleCollection.find( { $and: [
			{ 'episode.program_id' : episodeID },
			{ 'episode.version_id' : versionID }
			] } )
		.skip( requestedSkip )
		.limit( requestedLimit )
		.toArray(function(error, docs) {
			if (error) {
				console.log(error);
			}
			response.status(200)
			.json(docs);
		});
	}

	/**
	 * Handler used to isolate and enable testing of the core getEpisodeByDate function
	 * @ param {Object} mongoDB - the object representing the database
	 */
	getEpisodeByDateHandler(mongoDB) {
		return function(request, response) {
			return this.getEpisodeByDate(request, response, mongoDB);
		}.bind(this);
	}

	/**
	 * Return all episodes airing on a specific date
	 * @description example URL - $eq - http://localhost:3000/api/v1/episodes/292098/date/2017-05-04T16:30:00
	 * @ param {String} request - the request string
	 * @ param {String} response - the response string
	 * @ member {Function} scheduleCollection - links to mongoDB collection
	 * @ external {}
	 */
	getEpisodeByDate(request, response, mongoDB) {
		let scheduleCollection = mongoDB.collection('scheduleData');
		let episodeID = parseInt(request.params.id);
		let requestedDate = request.params.date;
		let requestedLimit = parseInt(request.query.limit);
		let requestedSkip = parseInt(request.query.skip);

		scheduleCollection.find( { $and : [
			{ 'episode.program_id' : episodeID },
			{ 'schedule.schedule_date' : { '$eq' : new Date(requestedDate) } }
		] } )
		.skip( requestedSkip )
		.limit( requestedLimit )
		.toArray(function(error, docs) {
			if (error) {
				console.log(error);
			}
			response.status(200)
			.json(docs);
		});
	}

	/**
	 * Handler used to isolate and enable testing of the core getEpisodeByDateRange function
	 * @ param {Object} mongoDB - the object representing the database
	 */
	getEpisodeByDateRangeHandler(mongoDB) {
		return function(request, response) {
			return this.getEpisodeByDateRange(request, response, mongoDB);
		}.bind(this);
	}

	/**
	 * Return all episodes airing on a specific date
	 * @description example URL - http://localhost:3000/api/v1/episodes/292104/startdate/2017-05-04T16:30:00Z/enddate/2017-05-28T16:30:00Z
	 * @ param {String} request - the request string
	 * @ param {String} response - the response string
	 * @ member {Function} scheduleCollection - links to mongoDB collection
	 * @ external {}
	 */
	getEpisodeByDateRange(request, response, mongoDB) {
		let scheduleCollection = mongoDB.collection('scheduleData');
		let episodeID = parseInt(request.params.id);
		let requestedStartDate = request.params.startDate;
		let requestedEndDate = request.params.endDate;
		let requestedLimit = parseInt(request.query.limit);
		let requestedSkip = parseInt(request.query.skip);

			scheduleCollection.find( { $and : [
				{ 'episode.program_id' : episodeID },
				{ 'schedule.schedule_date' : {
					'$gte' : new Date(requestedStartDate),
					'$lte' : new Date(requestedEndDate) } }
	       ] } )
			.skip( requestedSkip )
			.limit( requestedLimit )
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
		this.router.get('/:id', this.getEpisodeByIdHandler(mongoDB));
		this.router.get('/:id/version/:versionID', this.getEpisodeByEpisodeVersionIdHandler(mongoDB));
		this.router.get('/:id/date/:date', this.getEpisodeByDateHandler(mongoDB));
		this.router.get('/:id/startdate/:startDate/enddate/:endDate', this.getEpisodeByDateRangeHandler(mongoDB));
	}
}
