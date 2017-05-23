import mongoose from 'mongoose';

const mongoURI = 'mongodb://localhost:27017/scheduleData';
const mongoDB = mongoose.connect(mongoURI).connection;

export default class dataStore {

	initialize() {
 		mongoDB.on('error', function(error, db) {
			console.log('mongoDB connection error.', error);
		});
	}

 	connect() {
		mongoDB.once('open', function() {
			console.log('mongoDB connection established.');
		});
	}

	insertScheduleData(mongoDB, callback) {
		let scheduleCollection = mongoDB.collection('scheduleData');

		scheduleCollection.insertOne(
			{
  	"airing": {

	    "id": 789654,
	      
	    "feed": {
	      "id": 123987,
	      "name": "Minnesota Original",
	      "channel": "2"
	    },
	      
	    "show": {
	      "id": 123987,
	      "title": "Martha Bakes",
	      "number": "123",
	      "description": "Martha likes to bake, she shares that passion with you.",
	      "episode": {
	         "id": 123987,
	         "title": "Danish",
	         "number": "456",
	         "description": "Martha bakes a bunch of danish for people who like danish."   
	      }
	    },

	    "air_date": {
	      "date_time": "2017-04-26T00:28:30z"
	    },

	    "runtime": "00H28M30S",
	    "genre": "Arts"
	  	},
	  	function(error, result) {
	  		console.log('Inserted documents.');
	  		callback(result);
	  	}
		});
	}
}

export { mongoURI, mongoDB };
