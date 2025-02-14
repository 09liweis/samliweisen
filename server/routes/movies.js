var express = require("express");
var router = express.Router();

const {
  samVisuals,
  search,
  inTheatre,
  getDoubanChart,
  getHongkong,
  getTaiwan,
} = require("../controllers/visual.js");
const {getCineplex} = require("../controllers/movies/cineplex.js")
const { getImdbBoxOffice } = require("../controllers/imdb.js");
const {
  getPopular,
  getTags,
  getCommingMovies,
  getAlltimeBoxOffice,
} = require("../controllers/douban.js");
const { getMaoyan } = require("../controllers/maoyan.js");

router.route("/").get(samVisuals);

router.route("/douban/search").get(search);

router.route("/douban/in_theatre").get(inTheatre);

router.route("/douban/comming").get(getCommingMovies);

router.route("/douban/chart").get(getDoubanChart);

router.route("/douban/popular").get(getPopular);

router.route("/douban/alltime_boxoffice").get(getAlltimeBoxOffice);

router.route("/hongkong/:name").get(getHongkong);

router.route("/taiwan/:name").get(getTaiwan);

router.route("/cineplex").get(getCineplex);

router.route("/maoyan").get(getMaoyan);

router.route("/imdb/:name").get(getImdbBoxOffice);

router.route("/douban/tags").get(getTags);

module.exports = router;
