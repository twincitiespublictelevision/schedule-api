
import { Router } from 'express';
import { mongoDB } from '../database';

export default class SeriesRouter {

	// We use the mount path as the constructor argument
	constructor(path = '/api/v1/series') {
		// Instantiate the express.Router
		this.router = Router();
		this.path = path;
		this.init();
	}

	/**
	 * Handler used to isolate and enable testing of the core getSeriesById function
	 * @ param {Object} mongoDB - the object representing the database
	 */
	getSeriesByIdHandler(mongoDB) {
		return function(request, response) {
			return this.getSeriesById(request, response, mongoDB);
		}.bind(this);
	}

	/**
	 * Return a series by its ID number
	 * @description example URL - http://localhost:3000/api/v1/series/45
	 * @ param {String} request - the request string
	 * @ param {String} response - the response string
	 * @ member {Function} scheduleCollection - links to mongoDB collection
	 * @ external {}
	 */
	getSeriesById(request, response) {
		let scheduleCollection = mongoDB.collection('scheduleData');
		let seriesID = parseInt(request.params.id);
		let requestedLimit = parseInt(request.query.limit);
		let requestedSkip = parseInt(request.query.skip);

		scheduleCollection.find( {
			'series.series_id' : seriesID
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
	 * Handler used to isolate and enable testing of the core getSeriesByDate function
	 * @ param {Object} mongoDB - the object representing the database
	 */
	getSeriesByDateHandler(mongoDB) {
		return function(request, response) {
			return this.getSeriesByDate(request, response, mongoDB);
		}.bind(this);
	}

	/**
	 * Return a series airing on a specitid date by its ID number
	 * @description example URL - http://localhost:3000/api/v1/series/45/date/2017-05-04T16:30:00
	 * @ param {String} request - the request string
	 * @ param {String} response - the response string
	 * @ member {Function} scheduleCollection - links to mongoDB collection
	 * @ external {}
	 */
	getSeriesByDate(request, response, mongoDB) {
		let scheduleCollection = mongoDB.collection('scheduleData');
		let seriesID = parseInt(request.params.id);
		let requestedDate = request.params.date;
		let requestedLimit = parseInt(request.query.limit);
		let requestedSkip = parseInt(request.query.skip);

		scheduleCollection.find( { $and : [
			{ 'series.series_id' : seriesID },
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
	 * Handler used to isolate and enable testing of the core getSeriesByDateRange function
	 * @ param {Object} mongoDB - the object representing the database
	 */
	getSeriesByDateRangeHandler(mongoDB) {
		return function(request, response) {
			return this.getSeriesByDateRange(request, response, mongoDB);
		}.bind(this);
	}

	/**
	 * Return series airings for a specitid date range by its ID number
	 * @description example URL - http://localhost:3000/api/v1/series/45/startdate/2017-05-04T16:30:00Z/enddate/2017-05-28T16:30:00Z
	 * @ param {String} request - the request string
	 * @ param {String} response - the response string
	 * @ member {Function} scheduleCollection - links to mongoDB collection
	 * @ external {}
	 */
	getSeriesByDateRange(request, response) {
		let scheduleCollection = mongoDB.collection('scheduleData');
		let seriesID = parseInt(request.params.id);
		let requestedStartDate = request.params.startDate;
		let requestedEndDate = request.params.endDate;
		let requestedLimit = parseInt(request.query.limit);
		let requestedSkip = parseInt(request.query.skip);

		scheduleCollection.find( { $and : [
			{ 'series.series_id' : seriesID },
			{ 'schedule.schedule_date' : {
				'$gte' : requestedStartDate,
				'$lte' : requestedEndDate }
			}
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
	 * Attach route handlers to their endopoints
	 */
	init() {
		this.router.get('/:id', this.getSeriesByIdHandler(mongoDB));
		this.router.get('/:id/date/:date', this.getSeriesByDateHandler(mongoDB));
		this.router.get('/:id/startdate/:startDate/enddate/:endDate', this.getSeriesByDateRangeHandler(mongoDB));
	}
}
