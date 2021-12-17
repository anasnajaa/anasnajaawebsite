require("dotenv").config();
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
const mongoose = require("mongoose");
const pagesRouter = require("./routes/pages.r");
const apiRouter = require("./routes/api.r");
const rateLimiter = require("./middleware/rateLimiter");
const errorHandler = require("./middleware/errorHandler");
const environment = process.env.NODE_ENV;
const stage = require("./config/index")[environment];

mongoose.connect(stage.mongoUri, {
	useNewUrlParser: true,
	useUnifiedTopology: true
});

const connection = mongoose.connection;
connection.once("open", () => {
	console.log("MongoDB connection established");
	startServer(connection);
});

function startServer() {
	const app = express();

	app.set("views", path.join(__dirname, "views"));
	app.set("view engine", "ejs");

	app.use(express.json());
	app.use(express.urlencoded({ extended: true }));
	app.use(cookieParser());
	app.use(express.static(path.join(__dirname, "public")));
	app.use(fileUpload());

	app.use((req, res, next) => {
		if (process.env.NODE_ENV !== "development" && req.get("X-Forwarded-Proto") !== "https") {
			res.redirect("https://" + req.get("Host") + req.url);
		} else next();
	});

	app.use("/", pagesRouter);

	app.use("/api/v1", apiRouter);

	app.all("/*", (req, res) => {
		throw new Error("Not_Found");
	});

	app.use((err, req, res, next) => {
		errorHandler(err, req, res, next);
	});

	app.listen(stage.port || "80", () => {
		console.log("Server started on: " + stage.port);
	});
}
