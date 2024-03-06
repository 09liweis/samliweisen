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
  visualRoute = require("./routes/visual"),
  videoRoute = require("./routes/video"),
  categoryRoute = require("./routes/category"),
  roomRoute = require("./routes/room"),
  contactRoute = require("./routes/contact");

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

    this.app.use("/assets", getPathName("../assets"));
    this.app.use("/resume", getPathName("../resume"));

    this.app.get("/", (req, res) => {
      res.sendFile(path.join(__dirname, "../resume/resume.html"));
    });

    this.app.use("/api", indexRoute);
    this.app.use("/api/dashboard", dashboardRoute);
    this.app.use("/api/videos", videoRoute);
    this.app.use("/api/movies", visualRoute);
    this.app.use("/api/todos", todoRoute);
    this.app.use("/api/transactions", transactionRoute);
    this.app.use("/api/experiences", experienceRoute);
    this.app.use("/api/projects", projectRoute);
    this.app.use("/api/blogs", blogRoute);
    this.app.use("/api/comments", commentRoute);
    this.app.use("/api/sites", SiteRoute);
    this.app.use("/api/user", userRoute);
    this.app.use("/api/category", categoryRoute);
    this.app.use("/api/places", placeRoute);
    this.app.use("/api/rooms", roomRoute);
    this.app.use("/api/contacts", contactRoute);

    this.app.use(function (req, resp, next) {
      var host = req.headers.host;
      const origins = [
        "https://samliweisen.onrender.com/",
        "https://what-sam-watched.onrender.com/",
        "https://samliweisen.cyclic.app/",
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
