
import { Router }  from 'express';
import { mongoDB } from '../database';
import Validator   from '../helpers/requestValidator';

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
	getSeriesById(request, response, mongoDB) {
		let scheduleCollection = mongoDB.collection('scheduleData');
		let seriesID = parseInt(request.params.id);
		let requestedSkip = parseInt(request.query.skip);
		let requestedLimit = parseInt(request.query.limit);

		// Request values validation
		let verify = new Validator();
		let seriesIdIsValid = verify.checkResponseIsNumber(request.params.id);
		let skipIsValid = verify.checkResponseIsNumber(request.query.skip);
		let limitIsValid = verify.checkResponseIsNumber(request.query.limit);

		let requestErrors = [];

		if (!seriesIdIsValid) {
			requestErrors.push(verify.invalidParameterMessage('seriesID'));
		}

		if (!request.query.skip) {
			request.query.skip = 0;
		} else if (!skipIsValid) {
			requestErrors.push(verify.invalidParameterMessage('skipQuery'));
		}

		if (!request.query.limit) {
			request.query.limit = 0;
		} else if (!limitIsValid) {
			requestErrors.push(verify.invalidParameterMessage('limitQuery'));
		}

		if (requestErrors.length !== 0) {
			requestErrors.join('\n');
			response.status(400);
			response.send( {
				error: requestErrors,
				results: []
			});
		} else {
			scheduleCollection.find( {
				'series.series_id' : seriesID
			} )
			.skip( requestedSkip )
			.limit( requestedLimit )
			.toArray(function(error, docs) {
				if (docs.length === 0) {
					response.status(200);
					response.send( {
						error: 'The query was valid, but returned no data.',
						results: docs
					});
				} else {
					if (error) {
						console.log(error);
					}
					response.status(200)
					response.send( {
						error: '',
						results: docs
					});
				}
			});
		}
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
		let requestedSkip = parseInt(request.query.skip);
		let requestedLimit = parseInt(request.query.limit);

		// Request values validation
		let verify = new Validator();
		let seriesIdIsValid = verify.checkResponseIsNumber(request.params.id);
		let requestedDateIsValid = verify.checkDateFormat(requestedDate);
		let skipIsValid = verify.checkResponseIsNumber(request.query.skip);
		let limitIsValid = verify.checkResponseIsNumber(request.query.limit);

		let requestErrors = [];

		if (!seriesIdIsValid) {
			requestErrors.push(verify.invalidParameterMessage('seriesID'));
		}

		if (!requestedDateIsValid) {
			requestErrors.push(verify.invalidDateStringMessage('requestedDate'));
		}

		if (!request.query.skip) {
			request.query.skip = 0;
		} else if (!skipIsValid) {
			requestErrors.push(verify.invalidParameterMessage('skipQuery'));
		}

		if (!request.query.limit) {
			request.query.limit = 0;
		} else if (!limitIsValid) {
			requestErrors.push(verify.invalidParameterMessage('limitQuery'));
		}

		if (requestErrors.length !== 0) {
			requestErrors.join('\n');
			response.status(400);
			response.send( {
				error: requestErrors,
				results: []
			});
		} else {
			scheduleCollection.find( { $and : [
				{ 'series.series_id' : seriesID },
				{ 'schedule.schedule_date' : { '$eq' : new Date(requestedDate) } }
				] } )
			.skip( requestedSkip )
			.limit( requestedLimit )
			.toArray(function(error, docs) {
				if (docs.length === 0) {
					response.status(200);
					response.send( {
						error: 'The query was valid, but returned no data.',
						results: docs
					});
				} else {
					if (error) {
						console.log(error);
					}
					response.status(200)
					response.send( {
						error: '',
						results: docs
					});
				}
			});
		}
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
	getSeriesByDateRange(request, response, mongoDB) {
		let scheduleCollection = mongoDB.collection('scheduleData');
		let seriesID = parseInt(request.params.id);
		let requestedStartDate = request.params.startDate;
		let requestedEndDate = request.params.endDate;
		let requestedSkip = parseInt(request.query.skip);
		let requestedLimit = parseInt(request.query.limit);

		// Request values validation
		let verify = new Validator();
		let seriesIdIsValid = verify.checkResponseIsNumber(request.params.id);
		let startDateIsValid = verify.checkDateFormat(requestedStartDate);
		let endDateIsValid = verify.checkDateFormat(requestedEndDate);
		let skipIsValid = verify.checkResponseIsNumber(request.query.skip);
		let limitIsValid = verify.checkResponseIsNumber(request.query.limit);

		let requestErrors = [];

		if (!seriesIdIsValid) {
			requestErrors.push(verify.invalidParameterMessage('seriesID'));
		}

		if (!startDateIsValid) {
			requestErrors.push(verify.invalidDateStringMessage('startDate'));
		}

		if (!endDateIsValid) {
			requestErrors.push(verify.invalidDateStringMessage('endDate'));
		}

		if (!request.query.skip) {
			request.query.skip = 0;
		} else if (!skipIsValid) {
			requestErrors.push(verify.invalidParameterMessage('skipQuery'));
		}

		if (!request.query.limit) {
			request.query.limit = 0;
		} else if (!limitIsValid) {
			requestErrors.push(verify.invalidParameterMessage('limitQuery'));
		}

		if (requestErrors.length !== 0) {
			requestErrors.join('\n');
			response.status(400);
			response.send( {
				error: requestErrors,
				results: []
			});
		} else {
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
				if (docs.length === 0) {
					response.status(200);
					response.send( {
						error: 'The query was valid, but returned no data.',
						results: docs
					});
				} else {
					if (error) {
						console.log(error);
					}
					response.status(200)
					response.send( {
						error: '',
						results: docs
					});
				}
			});
		}
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
