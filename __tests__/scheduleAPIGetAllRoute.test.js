
// import Api from '../src/api.js';
import { leadingZero } from '../src/helpers/fileInOut.js'

describe('scheduleAPI helper functions', function() {
	it('should add a leading zero before any single digit number', () => {
		let testNum = 1;
		let passingNum = leadingZero(testNum).toString();

		expect(passingNum).toHaveLength(2);
	});
});

// describe('scheduleAPI', function() {

// 	describe('GET /api/v1/airings - get all airings', () => {
// 		Tests the expected properties on the response object.
// 		let expectedProps = ['_id', 'schedule', 'episode', 'series'];

// 		it('should return objects with the correct properties', () => {
// 			request(app).get('/api/v1/airings')
// 			.expect(200)
// 			.then(res => {
// 				// Check for the expected properties
// 				let sampleKeys = Object.keys(res.body[0]);
// 				expectedProps.forEach(key => {
// 					expect(sampleKeys.includes(key)).toBe(true);
// 				});
// 			});
// 		});

// 		it('shouldn\'t return objects with extra properties', () => {
// 			return request(app).get('/api/v1/airings')
// 			.expect(200)
// 			.then(res => {
// 				// Check only for the expected properties
// 				let extraProps = Object.keys(res.body[0]).filter(key => {
// 					return !expectedProps.includes(key);
// 				});
// 				expect(extraProps.length).toBe(0);
// 			});
// 		});
// 	});
// });
