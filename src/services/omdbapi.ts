import * as got from "got";
import * as querystring from "querystring";
import * as moment from "moment";

const Sequelize = require("sequelize");
const Op = Sequelize.Op;

const omdbapiUsageDao = require("../models").OmdbapiUsage;

export async function getMovieByTitle (title: string) {
	const response = await got("http://www.omdbapi.com/?t=" + querystring.stringify(title) + "&type=movie&apikey=" + process.env.OMDB_API_KEY, {json: true});
	await incrementUsageCount();

	return response;
};

export async function getMovieByImdbId (imdbId: string) {
	const response = await got("http://www.omdbapi.com/?i=" + imdbId + "&type=movie&apikey=" + process.env.OMDB_API_KEY, {json: true});
	await incrementUsageCount();
	
	return response;
}

export async function searchMoviesByTitle (search: string) {
	const response = await got("http://www.omdbapi.com/?s=" + querystring.escape(search) + "&type=movie&apikey=" + process.env.OMDB_API_KEY, {json: true});
	await incrementUsageCount();

	return response;
};

async function incrementUsageCount () {

	let usage = await omdbapiUsageDao.findOne({
		where: {date: Date.now()}
	});

	if (usage) {
		await usage.increment("requestsCount");
	} else {
		await omdbapiUsageDao.create({requestsCount: 1});
	}
};

export async function getLastMonthUsageCount () {

	const lastMonth = moment().subtract(1, "month");

	const usagesDB =  await omdbapiUsageDao.findAll({
		attributes: ["date", "requestsCount"],
		where: {
			date: {
				[Op.gte]: lastMonth
			}
		}
	});

	let usages = [];
	let numberOfDays = moment().diff(lastMonth, "days");

	for (let i = 0; i <= numberOfDays; i++) {
		let n = lastMonth.clone();
		usages.push({date: n.add(i, "days").format("YYYY-MM-DD"), requestsCount: 0});
	}

	for (let usage of usages) {
		const usageDB = usagesDB.find((u) => {return u.date == usage.date});
		if (usageDB) {
			usage.requestsCount = usageDB.requestsCount;
		}
	}

	return usages;
}