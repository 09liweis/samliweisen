var express = require("express");
var router = express.Router();

const {
  samVisuals,
  getMovieDetail,
  search,
  inTheatre,
  getDoubanChart,
  getCelebrities,
  getSummary,
  getPhotoDetail,
  getComments,
  getHongkong,
  getTaiwan,
  getCineplex,
  getReviews,
  upsertVisual,
  updateRandomMovie,
  getRandomMovie,
  updateSamMovie,
} = require("../controllers/visual.js");
const { getImdbBoxOffice } = require("../controllers/imdb.js");
const {
  getPopular,
  getTags,
  getPhotos,
  getVideos,
  getVideo,
  getCast,
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

router.route("/taiwan").get(getTaiwan);

router.route("/cineplex").get(getCineplex);

router.route("/maoyan").get(getMaoyan);

router.route("/imdb/:name").get(getImdbBoxOffice);

router.route("/douban/tags").get(getTags);

module.exports = router;
