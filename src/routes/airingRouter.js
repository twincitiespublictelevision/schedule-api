
import { Router }  from 'express';
import { mongoDB } from '../database';
import Validator   from '../helpers/requestValidator';

export default class AiringRouter {

	// We use the mount path as the constructor argument
	constructor(path = '/api/v1/airings') {
		// Instantiate the express.Router
		this.router = Router();
		this.path = path;
		this.init();
	}

	/**
	 * Handler used to isolate and enable testing of the core getAllAirings function
	 * @ param {Object} mongoDB - the object representing the database
	 */
	getAllAiringsHandler(mongoDB) {
		return function(request, response) {
			return this.getAllAirings(request, response, mongoDB);
		}.bind(this);
	}

	/**
	 * Return all airings
	 * @description example URL - http://localhost:3000/api/v1/airings/
	 * @ param {String} request - the request string
	 * @ param {String} response - the response string
	 * @ member {Function} scheduleCollection - links to mongoDB collection
	 * @ external {}
	 */
	getAllAirings(request, response, mongoDB) {
		let scheduleCollection = mongoDB.collection('scheduleData');
		let requestedSkip = parseInt(request.query.skip);
		let requestedLimit = parseInt(request.query.limit);

		// Request values validation
		let verify = new Validator();
		let skipIsValid = verify.checkResponseIsNumber(request.query.skip);
		let limitIsValid = verify.checkResponseIsNumber(request.query.limit);

		let requestErrors = [];

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
			scheduleCollection.find()
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
	 * Handler used to isolate and enable testing of the core getAllAiringsByChannel function
	 * @ param {Object} mongoDB - the object representing the database
	 */
	getAiringsByChannelHandler(mongoDB) {
		return function(request, response) {
			return this.getAiringsByChannel(request, response, mongoDB);
		}.bind(this);
	}

	/**
	 * Return all airings for a given channel
	 * @description example URL - $eq - http://localhost:3000/api/v1/airings/channel/TPTKIDS
	 * @ param {String} request - the request string
	 * @ param {String} response - the response string
	 * @ member {Function} scheduleCollection - links to mongoDB collection
	 * @ external {}
	 */
	getAiringsByChannel(request, response, mongoDB) {
		let scheduleCollection = mongoDB.collection('scheduleData');
		let channel = request.params.channel;
		let requestedChannel = channel === '2' ? parseInt(channel) : channel;
		let requestedSkip = parseInt(request.query.skip);
		let requestedLimit = parseInt(request.query.limit);

		// Request values validation
		let verify = new Validator();
		let skipIsValid = verify.checkResponseIsNumber(request.query.skip);
		let limitIsValid = verify.checkResponseIsNumber(request.query.limit);

		let requestErrors = [];

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
				'schedule.schedule_channel' : requestedChannel
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
	 * Handler used to isolate and enable testing of the core getAllAiringsByDate function
	 * @ param {Object} mongoDB - the object representing the database
	 */
	getAiringsByDateHandler(mongoDB) {
		return function(request, response) {
			return this.getAiringsByDate(request, response, mongoDB);
		}.bind(this);
	}

	/**
	 * Return all airings for a given date
	 * @description example URL - $eq - http://localhost:3000/api/v1/airings/date/2017-05-04T16:30:00
	 * @ param {String} request - the request string
	 * @ param {String} response - the response string
	 * @ member {Function} scheduleCollection - links to mongoDB collection
	 * @ external {}
	 */
	getAiringsByDate(request, response, mongoDB) {
		let scheduleCollection = mongoDB.collection('scheduleData');
		let requestedDate = request.params.date;
		let requestedSkip = parseInt(request.query.skip);
		let requestedLimit = parseInt(request.query.limit);

		// Request values validation
		let verify = new Validator();
		let requestedDateIsValid = verify.checkDateFormat(requestedDate);
		let skipIsValid = verify.checkResponseIsNumber(request.query.skip);
		let limitIsValid = verify.checkResponseIsNumber(request.query.limit);

		let requestErrors = [];

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
			scheduleCollection.find( {
				'schedule.schedule_date' : { '$eq' : new Date(requestedDate) }
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
	 * Handler used to isolate and enable testing of the core getAllAiringsByDateRange function
	 * @ param {Object} mongoDB - the object representing the database
	 */
	getAiringsByDateRangeHandler(mongoDB) {
		return function(request, response) {
			return this.getAiringsByDateRange(request, response, mongoDB);
		}.bind(this);
	}

	/**
	 * Return all airings within a give range of dates
	 * @description example URL - http://localhost:3000/api/v1/airings/startdate/2017-05-04T16:30:00Z/enddate/2017-05-28T16:30:00Z
	 * @ param {String} request - the request string
	 * @ param {String} response - the response string
	 * @ member {Function} scheduleCollection - links to mongoDB collection
	 * @ external {}
	 */
	getAiringsByDateRange(request, response, mongoDB) {
		let scheduleCollection = mongoDB.collection('scheduleData');
		let requestedStartDate = request.params.startDate;
		let requestedEndDate = request.params.endDate;
		let requestedSkip = parseInt(request.query.skip);
		let requestedLimit = parseInt(request.query.limit);

		// Request values validation
		let verify = new Validator();
		let startDateIsValid = verify.checkDateFormat(requestedStartDate);
		let endDateIsValid = verify.checkDateFormat(requestedEndDate);
		let skipIsValid = verify.checkResponseIsNumber(request.query.skip);
		let limitIsValid = verify.checkResponseIsNumber(request.query.limit);

		let requestErrors = [];

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
			scheduleCollection.find( {
				'schedule.schedule_date' : {
					'$gte' : new Date(requestedStartDate),
					'$lte' : new Date(requestedEndDate) }
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
	 * Handler used to isolate and enable testing of the core getAllAiringsByGenre function
	 * @ param {Object} mongoDB - the object representing the database
	 */
	getAiringsByGenreCodeHandler(mongoDB) {
		return function(request, response) {
			return this.getAiringsByGenreCode(request, response, mongoDB);
		}.bind(this);
	}

	/**
	 * Return all airings within a give range of dates
	 * @description example URL - http://localhost:3000/api/v1/airings/genre/CH
	 * @ param {String} request - the request string
	 * @ param {String} response - the response string
	 * @ member {Function} scheduleCollection - links to mongoDB collection
	 * @ external {}
	 */
	getAiringsByGenreCode(request, response, mongoDB) {
		let scheduleCollection = mongoDB.collection('scheduleData');
		let genreCode = request.params.genreCode;
		let requestedSkip = parseInt(request.query.skip);
		let requestedLimit = parseInt(request.query.limit);

		// Request values validation
		let verify = new Validator();
		let genreCodeIsValid = verify.checkGenreCode(genreCode);
		let skipIsValid = verify.checkResponseIsNumber(request.query.skip);
		let limitIsValid = verify.checkResponseIsNumber(request.query.limit);

		let requestErrors = [];

		if (!genreCodeIsValid) {
			requestErrors.push(verify.invalidGenreCodeMessage('genreCode'));
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
				'episode.epi_genrelist_nat.0.genrecd' : genreCode
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
	 * Attach route handlers to their endopoints
	 */
	init() {
		this.router.get('/', this.getAllAiringsHandler(mongoDB));
		this.router.get('/channel/:channel', this.getAiringsByChannelHandler(mongoDB));
		this.router.get('/date/:date', this.getAiringsByDateHandler(mongoDB));
		this.router.get('/startdate/:startDate/enddate/:endDate', this.getAiringsByDateRangeHandler(mongoDB));
		this.router.get('/genre/:genreCode', this.getAiringsByGenreCodeHandler(mongoDB));
	}
}
