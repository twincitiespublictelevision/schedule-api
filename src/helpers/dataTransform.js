
/**
 * Check for a list of genres and ensure proper formatting
 * @param {(?Array|?Object)} genreInput - A list of schedules from the parsed data
 * @returns {Object} singleScheduleObject - An newly formattted object
 */
function convertGenres(genreInput) {
	let newGenreList = [];

	if (genreInput && genreInput.genre) {
		let genres = genreInput.genre.length ? genreInput.genre : [genreInput.genre];

		genres.forEach(function(genre) {
			if (genre.genrecd && genre.genretxt) {
				newGenreList.push(genre);
			}
		});
	}
	return newGenreList;
}

/**
 * Model for the newly formatted object that contains specific schedule info
 * @param {Array} schedule - A list of schedules from the parsed data
 * @returns {Object} singleScheduleObject - An newly formattted object
 */
function scheduleObject(schedule) {

	let scheduleObject = {

		schedule: {
			schedule_channel: schedule.schedule_channel,
			schedule_date: schedule.schedule_date,
			schedule_duration: schedule.schedule_duration
		}
	};
	return scheduleObject;
}

/**
 * Model for the newly formatted object that contains specific episode info
 * @param {Array} episode - A list of episodes from the parsed data
 * @returns {Object} singleEpisodeObject - An newly formattted object
 */
function episodeObject(episode) {

	let episodeObject = {

		episode: {
			program_id: episode.program_id,
			version_id: episode.version_id,
			episode_title: episode.episode_title,
			episode_number: episode.episode_number,
			episode_desc: episode.episode_desc,
			episode_url: episode.episode_url,
			episode_language: episode.episode_language,
			episode_dvi: episode.episode_dvi,
			episode_stereo: episode.episode_stereo,
			episode_hdtv: episode.episode_hdtv,
			version_rating: episode.version_rating,
			version_caption: episode.version_caption,
			package_type: episode.package_type,
			orig_broadcast_date: episode.orig_broadcast_date,
			epi_genrelist_loc: {
				genre: {
					genrecd: episode.epi_genrelist_loc.genre.genrecd,
					genretxt: episode.epi_genrelist_loc.genre.genrecd
				}
			}
		}
	};

	episodeObject.episode.epi_genrelist_loc = convertGenres(episode.epi_genrelist_loc);
	episodeObject.episode.epi_genrelist_nat = convertGenres(episode.epi_genrelist_nat);

	return  episodeObject;
}

/**
 * Model for the newly formatted object that contains specific series info
 * @param {Array} series - A list of series from the parsed data
 * @returns {Object} singleSeriesObject - An newly formattted object
 */
function seriesObject(series) {

	let seriesObject = {

		series: {
			series_id: series.series_id,
			series_code: series.series_code,
			series_title: series.series_title,
			series_desc: series.series_desc,
			series_url: series.series_url,
			series_pgmtype: series.series_pgmtype
		}
	};

	seriesObject.series.series_genrelist_loc = convertGenres(series.series_genrelist_loc);

	return seriesObject;
}

/**
 * Traverse data structure using the map method,
 * retrieving the objects we want in the order we want along the way.
 * The goal is to invert the parsed object, pulling the most nested
 * bits of data out.
 * @param {Object} data - An object to be traversed
 * @returns {Array} - collectedData
 */
function extractScheduleData(parseData) {
	let full_data = parseData.schedule_data.series.map(series => {
		let episodes = series.episode.length ? series.episode : [series.episode];
		let series_airings = episodes.map(episode => {
			let schedules = episode.schedule.length ? episode.schedule : [episode.schedule];
				return schedules.map(schedule => {
					let finalScheduleObject = {};
					let newScheduleObject = scheduleObject(schedule);
					let newEpisodeObject = episodeObject(episode);
					let newSeriesObject = seriesObject(series);
					return Object.assign({}, newScheduleObject, newEpisodeObject, newSeriesObject);
				});
		});
		return [].concat.apply([], series_airings);
	});
	return [].concat.apply([], full_data);
}

export { extractScheduleData };
