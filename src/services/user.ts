const Sequelize = require("sequelize");
const Op = Sequelize.Op;

import * as elasticsearchService from "../services/elasticsearch";

const userMoviesDao = require("../models").UserMovies;
const userStatDao = require("../models").UserStat;

export async function refreshUserStat (userId: number) {

	let moviesCount = 0;
	let moviesWatchtime = 0;

	const watchedMovies = await userMoviesDao.findAll({
		where: {
			userId: userId
		}
	});
	moviesCount = watchedMovies.length;

	for (let watchedMovie of watchedMovies) {
		const movie = await elasticsearchService.getMovie(watchedMovie.movieImdbId);
		if (movie._source.runtime !== null) {
			moviesWatchtime += movie._source.runtime;
		}
	}

	let stat = await userStatDao.findOne({
		where: {
			userId: userId
		}
	});

	if (stat) {
		await stat.update({
			moviesCount: moviesCount,
			moviesWatchtime: moviesWatchtime
		});
	} else {
		await userStatDao.create({
			userId: userId,
			moviesCount: moviesCount,
			moviesWatchtime: moviesWatchtime
		});
	}
}

export async function getUserStat (userId: number) {
	return await userStatDao.findOne({
		attributes: ["moviesCount", "moviesWatchtime"],
		where: {
			userId: userId
		}
	});
}