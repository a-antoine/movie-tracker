import adminRouter = require("./admin");
import dashboardRouter = require("./dashboard");
import movieRouter = require("./movie");
import moviesWatchedRouter = require("./movies-watched");
import userRouter = require("./user");

const authenticationMiddleware = require("../middlewares/authentication");

export = function (app) {

	app.get("/", authenticationMiddleware(), function (req, res) {
		const user = (res.locals.tokenData) ? res.locals.tokenData : null;
		res.render("index", {user: user});
	});

	app.use(function(req, res, next) {
		res.header("Access-Control-Allow-Origin", "*");
		res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-access-token");
		res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
		next();
	});

	app.use("/admin", adminRouter);
	app.use("/dashboard", dashboardRouter);
	app.use("/movie", movieRouter);
	app.use("/movies-watched", moviesWatchedRouter);
	app.use("/user", userRouter);
};