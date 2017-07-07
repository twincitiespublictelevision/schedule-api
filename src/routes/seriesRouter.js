
import mongodb from 'mongodb';
import {
	mongoDB,
	findAll
} from '../database';

import { Router } from 'express';

export default class SeriesRouter {

	// We use the mount path as the constructor argument
	constructor(path = '/api/v1/series') {
		// Instantiate the express.Router
		this.router = Router();
		this.path = path;
		this.init();
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

		scheduleCollection.find( {
			'series.series_id' : seriesID
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
	 * Return a series airing on a specitid date by its ID number
	 * @description example URL - http://localhost:3000/api/v1/series/45/date/2017-05-04T16:30:00
	 * @ param {String} request - the request string
	 * @ param {String} response - the response string
	 * @ member {Function} scheduleCollection - links to mongoDB collection
	 * @ external {}
	 */
	getSeriesByDate(request, response) {
		let scheduleCollection = mongoDB.collection('scheduleData');
		let seriesID = parseInt(request.params.id);
		let requestedDate = request.params.date;

		scheduleCollection.find( { $and : [
			{ 'series.series_id' : seriesID },
			{ 'schedule.schedule_date' : { '$eq' : requestedDate } }
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

		scheduleCollection.find( { $and : [
			{ 'series.series_id' : seriesID },
			{ 'schedule.schedule_date' : {
				'$gte' : requestedStartDate,
				'$lte' : requestedEndDate }
			}
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
	 * Attach route handlers to their endopoints
	 */
	init() {
		this.router.get('/:id', this.getSeriesById);
		this.router.get('/:id/date/:date', this.getSeriesByDate);
		this.router.get('/:id/startdate/:startDate/enddate/:endDate', this.getSeriesByDateRange);
	}
}
