import mongoose from 'mongoose';
import mongodb from 'mongodb';

const mongoURI = 'mongodb://localhost:27017/scheduleData';
const mongoDB = mongoose.connect(mongoURI).connection;

function initialize() {
	mongoDB.on('error', function(error, db) {
		console.log('mongoDB connection error.', error);
	});
}

function connect() {
	mongoDB.once('open', function() {
		console.log('mongoDB connection established.');
	});
}

function singleInsert(mongoDB, data, callback) {
	let scheduleCollection = mongoDB.collection('scheduleData');

	scheduleCollection.insertOne(data,
		function(error, result) {
			console.log('Inserted data.');
			callback(result);
	});
}

function multipleInsert(mongoDB, data, callback) {
	let scheduleCollection = mongoDB.collection('scheduleData');

	scheduleCollection.insertMany(data,
		function(error, result) {
			console.log('Inserted all documents.');
			callback(result);
	});
}

function removeAllInsert(mongoDB, data, callback) {
	let scheduleCollection = mongoDB.collection('scheduleData');

	scheduleCollection.remove({}, function(){
		scheduleCollection.insertMany(data,
			function(error, result) {
				if(error) {
					console.log(error);
				}
				console.log('Inserted documents.');
				callback(result);
		});
	});
}

function findAll(fn) {
	let scheduleCollection = mongoDB.collection('scheduleData');

	scheduleCollection.find({}).toArray(function(error, docs) {
		if (error) {
			console.log(error);
		}
		console.log('finding');
	})
}

export {
	mongoURI,
	mongoDB,
	initialize,
	connect,
	singleInsert,
	multipleInsert,
	removeAllInsert,
	findAll
};
