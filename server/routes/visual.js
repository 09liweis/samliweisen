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
  getReviews,
  upsertVisual,
  updateRandomMovie,
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

router.route("/search").get(search);

router.route("/in_theatre").get(inTheatre);

router.route("/comming").get(getCommingMovies);

router.route("/maoyan").get(getMaoyan);

router.route("/chart").get(getDoubanChart);

router.route("/popular").get(getPopular);

router.route("/alltime_boxoffice").get(getAlltimeBoxOffice);

router.route("/douban/:douban_id/casts").get(getCelebrities);

router.route("/cast").post(getCast);

router.route("/douban/:douban_id").get(getSummary);

router.route("/douban/:douban_id/videos").get(getVideos);

router.route("/video").post(getVideo);

router.route("/douban/:douban_id/photos").get(getPhotos);

router.route("/photo").post(getPhotoDetail);

router.route("/douban/:douban_id/comments").get(getComments);

router.route("/douban/:douban_id/reviews").get(getReviews);

router.route("/imdb_boxoffice").get(getImdbBoxOffice);

router.route("/douban/tags").post(getTags);

router.route("/upsert").post(upsertVisual);

router.route("/update_random").put(updateRandomMovie);

router.route("/:douban_id").get(getMovieDetail).put(updateSamMovie);

module.exports = router;
