
import request from 'supertest';
import Api from '../src/api.js';

const app = new Api().express;

describe('scheduleAPI', function() {

	describe('GET /api/v1/channels - get all airings', function() {
		// Tests the expected properties on the response object.
		let expectedProps = ['schedule', 'episode', 'series', '_id'];

		it('should return a JSON array', function() {
			return request(app).get('/api/v1/channels')
			.expect(200)
			.then(function(res) {
				// Check that an array is returned
				expect(res.body).toBeInstanceOf(Array);
			});
		});

		it('should return objects with the correct properties', function() {
			return request(app).get('/api/v1/channels')
			.expect(200)
			.then(function(res) {
				// Check for the expected properties
				let sampleKeys = Object.keys(res.body[0]);
				expectedProps.forEach(function(key) {
					expect(sampleKeys.includes(key)).toBe(true);
				});
			});
		});

		it('shouldn\'t return objects with extra properties', function() {
			return request(app).get('/api/v1/channels')
			.expect(200)
			.then(function(res) {
				// Check only for the expected properties
				let extraProps = Object.keys(res.body[0]).filter(function(key) {
					return !expectedProps.includes(key);
				});
				expect(extraProps.length).toBe(0);
			});
		});
	});
});
