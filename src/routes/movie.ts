import * as express from "express";
import * as movieService from "../services/movie";
import * as omdbapi from "../services/omdbapi";
import * as user from "../services/user";

const authenticationMiddleware = require('../middlewares/authentication');

let router = express.Router();

router.get("/", authenticationMiddleware('USER'), async function (req, res) {
	const title = req.query.title;

	try {
		const response = await omdbapi.getMovieByTitle(title);
		if (response) {
			res.send(response.body);
		} else {
			res.status(500).send(response);
		}
	} catch (error) {
		res.status(500).send(error.response.body);
	}
});

router.get("/search", authenticationMiddleware('USER'), async function (req, res) {
	const search = req.query.search;

	try {
		const results = await movieService.searchMoviesByTitle(search);
		res.send(results);
	} catch (error) {
		console.error(error);
		res.status(500).send(error.message);
	}
});

router.get("/mark-watched/:imdbId", authenticationMiddleware("USER"), async function (req, res) {
	const movieImdbId = req.params.imdbId;

	try {
		await movieService.markMovieWatched(res.locals.tokenData.id, movieImdbId);
		await user.refreshUserStat(res.locals.tokenData.id);
		res.redirect("/dashboard");
	} catch (error) {
		console.error(error);
		res.status(500).send(error);
	}
});

router.get("/mark-unwatched/:imdbId", authenticationMiddleware("USER"), async function (req, res) {
	const movieImdbId = req.params.imdbId;

	try {
		await movieService.markMovieUnwatched(res.locals.tokenData.id, movieImdbId);
		await user.refreshUserStat(res.locals.tokenData.id);
		res.redirect("/dashboard");
	} catch (error) {
		console.error(error);
		res.status(500).send(error);
	}
});

router.put("/change-watched-date", authenticationMiddleware("USER"), async function (req, res) {
	const movieImdbId = req.body.imdbId;
	const movieWatchedDate = req.body.watchedDate;

	try {
		let movie = await movieService.changeWatchedDate(res.locals.tokenData.id, movieImdbId, movieWatchedDate);
		res.send({success: true});
	} catch (error) {
		console.error(error);
		res.status(500).send(error);
	}
});


export = router;