
import mongoose from 'mongoose';

const mongoOptions = {
	server: { ssl: process.env.ENABLE_TLS_SSL === 'true' },
	user: process.env.DB_USER,
	pass: process.env.DB_PASS
};
const mongoURI = `${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;
const mongoDB = mongoose.connect(mongoURI, mongoOptions).connection;

/**
 * Event listener for error when conneting to the database.
 * @ member {Function} scheduleCollection - links to mongoDB collection
 */
function databaseConnectionError() {
	mongoDB.on('error', function(error, db) {
		console.log('mongoDB connection error.', error);
	});
}

/**
 * Open connection to the database
 * @ member {Function} mongoDB - link to collection
 */
function databaseConnection() {
	mongoDB.once('open', function() {
		console.log('mongoDB connection established.');
	});
}

/**
 * Inssert a single object into the database
 * @ param {String} mongoDB - the connection to the database
 * @ param {Object} data - the object being inserted into the database
 * @ param (Function) callback - Do something with the results
 * @ member {Function} scheduleCollection - links to mongoDB collection
 */
function singleInsert(mongoDB, data, callback) {
	let scheduleCollection = mongoDB.collection('scheduleData');

	scheduleCollection.insertOne(data,
		function(error, result) {
			console.log('Inserted data.');
			callback(result);
	});
}

/**
 * Insert N number of objects into the database
 * @ param {String} mongoDB - the connection to the database
 * @ param {Object} data - the objects being inserted into the database
 * @ param (Function) callback - Do something with the results
 * @ member {Function} scheduleCollection - links to mongoDB collection
 */
function multipleInsert(mongoDB, data, callback) {
	let scheduleCollection = mongoDB.collection('scheduleData');

	scheduleCollection.insertMany(data,
		function(error, result) {
			console.log('Inserted all documents.');
			callback(result);
	});
}

/**
 * Remove all of the objects in the current collection before inserting more
 * @ param {String} mongoDB - the connection to the database
 * @ param {Object} data - the objects being inserted into the database
 * @ param (Function) callback - Do something with the results
 * @ member {Function} scheduleCollection - links to mongoDB collection
 */
function removeOldInsertNew(mongoDB, data, callback) {
	let scheduleCollection = mongoDB.collection('scheduleData');

	scheduleCollection.remove( {
		'schedule.schedule_channel': data[0].schedule.schedule_channel
	}, function(){
		scheduleCollection.insertMany(data,
			function(error, result) {
				if(error) {
					console.log(error);
				}
				convertDates(result);
		});
	});
}

/**
 * Remove all of the objects in the current collection
 * @ param {String} mongoDB - the connection to the database
 * @ param {Object} data - the emplty object being inserted into the database
 * @ param (Function) callback - Do something with the results
 * @ member {Function} scheduleCollection - links to mongoDB collection
 */
function removeAll(mongoDB, data, callback) {
	let scheduleCollection = mongoDB.collection('scheduleData');

	scheduleCollection.deleteMany({}, function(error) {
		if (error) {
			console.log(error);
		}
		console.log('All docuements removed.');
	});
}

/**
 * Find all of the objects in the current collection
 * @ param {String} mongoDB - the connection to the database
 * @ param {Object} data - the objects being inserted into the database
 * @ param (Function) callback - Do something with the results
 * @ member {Function} scheduleCollection - links to mongoDB collection
 */
function findAll(fn) {
	let scheduleCollection = mongoDB.collection('scheduleData');

	scheduleCollection.find({}).toArray(function(error, docs) {
		if (error) {
			console.log(error);
		}
		console.log('finding');
	});
}

/**
 * Update a date string to a date object
 * @ param {String} records - the database records to update
 * @ member {Function} scheduleCollection - links to mongoDB collection
 */
function convertDates(data) {
	let scheduleCollection = mongoDB.collection('scheduleData');

	let bulkUpdate = [];
	let cursor = scheduleCollection.find({});

	cursor.forEach(function (doc) {
		let newDate = new Date(doc.schedule.schedule_date);
		bulkUpdate.push(
			{
				'updateOne'	: {
					'filter' : { '_id' : doc._id },
					'update' : { '$set' : { 'schedule.schedule_date' : newDate } }
				}
			}
		);

		if (bulkUpdate.length === 500) {
			scheduleCollection.bulkWrite(bulkUpdate);
			bulkUpdate = [];
		}
	});

	if (bulkUpdate.length > 0) {
		scheduleCollection.bulkWrite(bulkUpdate);
	}
}

export {
	mongoURI,
	mongoDB,
	databaseConnectionError,
	databaseConnection,
	singleInsert,
	multipleInsert,
	removeOldInsertNew,
	removeAll,
	findAll,
	convertDates
};
