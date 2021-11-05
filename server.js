require("dotenv").config();
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const { merge } = require("lodash");
const pagesRouter = require("./routes/pages.r");
const apiRouter = require("./routes/api.r");
const rateLimiter = require("./middleware/rateLimiter");
const environment = process.env.NODE_ENV;
const stage = require("./config/index")[environment];

mongoose.connect(stage.mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
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

  app.use((req, res, next) => {
    if (
      process.env.NODE_ENV !== "development" &&
      req.get("X-Forwarded-Proto") !== "https"
    ) {
      res.redirect("https://" + req.get("Host") + req.url);
    } else next();
  });

  app.use("/", pagesRouter);

  app.use("/api/v1", apiRouter);

  app.all("/api/v1/*", (req, res) => {
    return res.status(404).json({
      title: "Error",
      message: "Endpoint Not Found",
      type: "danger",
    });
  });

  app.all("/*", (req, res) => {
    return res.render("pages/404");
  });

  app.listen(stage.port || "80", () => {
    console.log("Server started on: " + stage.port);
  });
}
