require("dotenv").config();

import * as express from "express";
import * as bodyParser from "body-parser";
import * as cookieParser from "cookie-parser";
import * as morgan from "morgan";

import * as elasticsearchService from "./services/elasticsearch";

const app = express();

const PORT = process.env.PORT || 5000;

app.locals.moment = require("moment");
app.locals.momentDurationFormat = require("moment-duration-format");

app.use("/static", express.static("static"));
app.set("view engine", "pug");

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cookieParser());

if (process.env.ENV === "dev") {
	app.use(morgan("dev"));
}

elasticsearchService.checkMovieIndex();

require("./routes/index")(app);

app.listen(PORT, function () {
	console.log("Listening on port " + PORT);
});
