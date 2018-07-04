import * as express from "express";
import * as omdbapi from "../services/omdbapi";

const authenticationMiddleware = require("../middlewares/authentication");

let router = express.Router();

router.get("/", authenticationMiddleware("ADMIN") , async function (req, res) {
	const usages = await omdbapi.getLastMonthUsageCount();
	res.render("admin", {
		title: "Admin",
		user: res.locals.tokenData,
		usages: usages,
		lastUsage: usages[usages.length - 1]
	});
});


export = router;