require("dotenv").config();

const throng = require("throng");
var express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const { merge } = require("lodash");
const environment = process.env.NODE_ENV;
const stage = require("./config/index")[environment];

throng({
  count: stage.workers,
  lifetime: Infinity,
  worker: startMogno,
});

function startMogno() {
  mongoose.connect(stage.mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  const connection = mongoose.connection;
  connection.once("open", () => {
    console.log("MongoDB connection established");
    startServer(connection);
  });
}

function startServer() {
  const app = express();

  app.set("views", path.join(__dirname, "views"));
  app.set("view engine", "ejs");

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());
  app.use(express.static(path.join(__dirname, "public")));

  app.use(
    session(
      merge(
        {
          store: new MongoStore({
            mongoUrl: stage.mongoUri,
          }),
        },
        stage.session
      )
    )
  );

  app.set("view engine", "ejs");

  app.use((req, res, next) => {
    if (
      process.env.NODE_ENV !== "development" &&
      req.get("X-Forwarded-Proto") !== "https"
    ) {
      res.redirect("https://" + req.get("Host") + req.url);
    } else next();
  });

  app.get("/", (req, res) => {
    res.render("pages/index");
  });

  app.get("/about", (req, res) => {
    res.render("pages/about");
  });

  app.listen(stage.port || "80", () => {
    console.log("Server started on: " + stage.port);
  });
}
