const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");

const indexRoute = require("./routes/index"),
  dashboardRoute = require("./routes/dashboard"),
  todoRoute = require("./routes/todo"),
  transactionRoute = require("./routes/transaction"),
  experienceRoute = require("./routes/experience"),
  projectRoute = require("./routes/project"),
  placeRoute = require("./routes/place"),
  blogRoute = require("./routes/blog"),
  commentRoute = require("./routes/comment"),
  SiteRoute = require("./routes/site"),
  userRoute = require("./routes/user"),
  moviesRoute = require("./routes/movies"),
  movieRoute = require("./routes/movie"),
  videoRoute = require("./routes/video"),
  categoryRoute = require("./routes/category"),
  contactRoute = require("./routes/contact"),
  foodCourtRoute = require("./routes/foodcourts"),
  statRoute = require("./routes/stat");

const getPathName = (dir) => {
  return express.static(path.join(__dirname) + "/" + dir);
};

class ExpressJs {
  constructor() {
    this.app = express();
    this.init();
  }
  getApp() {
    return this.app;
  }
  init() {
    this.app.use(cors());

    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use(bodyParser.json());

    this.app.get("/", (req, resp) => {
      return resp.json({'msg':'This is a API server'});
    });

    const API_PREFIX = "/api";

    this.app.use(API_PREFIX + "", indexRoute);
    this.app.use(API_PREFIX + "/dashboard", dashboardRoute);
    this.app.use(API_PREFIX + "/videos", videoRoute);
    this.app.use(API_PREFIX + "/movies", moviesRoute);
    this.app.use(API_PREFIX + "/movie", movieRoute);
    this.app.use(API_PREFIX + "/todos", todoRoute);
    this.app.use(API_PREFIX + "/transactions", transactionRoute);
    this.app.use(API_PREFIX + "/experiences", experienceRoute);
    this.app.use(API_PREFIX + "/projects", projectRoute);
    this.app.use(API_PREFIX + "/blogs", blogRoute);
    this.app.use(API_PREFIX + "/comments", commentRoute);
    this.app.use(API_PREFIX + "/sites", SiteRoute);
    this.app.use(API_PREFIX + "/user", userRoute);
    this.app.use(API_PREFIX + "/category", categoryRoute);
    this.app.use(API_PREFIX + "/places", placeRoute);
    this.app.use(API_PREFIX + "/contacts", contactRoute);
    this.app.use(API_PREFIX + "/stats", statRoute);

    this.app.use(API_PREFIX + "/foodcourts", foodCourtRoute);

    this.app.use(function (req, resp, next) {
      var host = req.headers.host;
      const origins = [
        "https://samliweisen.onrender.com/",
        "https://what-sam-watched.onrender.com/",
      ];
      // Website you wish to allow to connect
      if (origins.indexOf(req.headers.origin) > -1) {
        resp.setHeader("Access-Control-Allow-Origin", req.headers.origin);
      }
      if (req.query && req.query.origin && req.query.origin == "localhost") {
        resp.setHeader("Access-Control-Allow-Origin", "*");
      }
      // Request methods you wish to allow
      resp.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, OPTIONS, PUT, PATCH, DELETE",
      );
      // Request headers you wish to allow
      resp.setHeader(
        "Access-Control-Allow-Headers",
        "X-Requested-With,content-type,auth-token",
      );
      // Set to true if you need the website to include cookies in the requests sent
      // to the API (e.g. in case you use sessions)
      resp.setHeader("Access-Control-Allow-Credentials", true);
      // Pass to next layer of middleware
      next();
    });
  }
}

module.exports = ExpressJs;
