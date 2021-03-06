import * as express from "express";
import * as movieService from "../services/movie";
import * as userService from "../services/user";

const authenticationMiddleware = require('../middlewares/authentication');

let router = express.Router();

router.get("/", authenticationMiddleware('USER') , async function (req, res) {
	const watchedMovies = await movieService.getWatchedMovies(res.locals.tokenData.id, 4);
	const userStat = await userService.getUserStat(res.locals.tokenData.id);
	res.render("dashboard", {
		title: "Dashboard",
		user: res.locals.tokenData,
		watchedMovies: watchedMovies,
		userStat: userStat
	});
});


export = router;