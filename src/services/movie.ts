const Sequelize = require("sequelize");
const Op = Sequelize.Op;

import * as omdbapiService from "../services/omdbapi";
import * as elasticsearchService from "../services/elasticsearch";

const userMoviesDao = require("../models").UserMovies;

export async function searchMoviesByTitle (search: string) {
	const movies = await elasticsearchService.searchMovies(search);
    if (movies.length > 0) {
        return movies;
    } else {
        const response = await omdbapiService.searchMoviesByTitle(search);
		if (!response.body.Error) {
			let movies: Movie[] = [];
			for (let movie of response.body.Search) {
				const existsInES = await elasticsearchService.exists(movie.imdbID);
				if (!existsInES) {
					const response = await omdbapiService.getMovieByImdbId(movie.imdbID);
					const m: Movie = {
						imdbId: response.body.imdbID, 
						title: response.body.Title,
						year: parseInt(response.body.Year),
						runtime: parseInt(response.body.Runtime),
						poster: response.body.Poster
					};
					movies.push(m);
					elasticsearchService.insertMovie(m);
				}
			}
			return movies;
		} else {
			throw new Error(response.body.Error);
		}
    }
}

export async function markMovieWatched (userId: number, movieImdbId: string) {
	return userMoviesDao.create({
		userId: userId,
		movieImdbId: movieImdbId,
		viewedAt: Sequelize.fn("NOW")
	});
}

export async function markMovieUnwatched (userId: number, movieImdbId: string) {
	return userMoviesDao.destroy({
		where: {
			userId: userId,
			movieImdbId: movieImdbId
		}
	});
}

export function getWatchedMovies (userId: number, limit?: number) {

	return new Promise(async function (resolve, reject) {

		let query = {
			attributes: ["movieImdbId", "viewedAt"],
			where: {
				userId: userId
			},
			order: [
				["viewedAt", "DESC"]
			]
		};

		if (limit) {
			query["limit"] = limit;
		}

		let watchedMovies = await userMoviesDao.findAll(query);

		let moviesCount = await userMoviesDao.count({where: {userId: userId}});
	
		let promises = [];
		for (let watchedMovie of watchedMovies) {
			promises.push(elasticsearchService.getMovie(watchedMovie.movieImdbId))
		}
	
		Promise.all(promises).then(function(movies) {
			let response = {count: moviesCount, movies: []};
			for (let movie of movies) {
				response.movies.push({
					imdbId: movie._id,
					title: movie._source.title,
					year: movie._source.year,
					runtime: movie._source.runtime,
					poster: movie._source.poster,
					viewedAt: (watchedMovies.find((m) => {return m.movieImdbId === movie._id;})).viewedAt
				});
			}
			resolve(response);
		});
	});
}

export function changeWatchedDate (userId: number, movieImdbId: string, movieWatchedDate: Date) {
	return userMoviesDao.update({
		viewedAt: movieWatchedDate
	}, {
		where: {
			userId: userId,
			movieImdbId: movieImdbId
		}
	});
}