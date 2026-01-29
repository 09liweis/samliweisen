var express = require("express");
var router = express.Router();
const { verify } = require("../helpers/verifyToken");

const {
  getQuizMovie,
  getMovieDetail,
  getCelebrities,
  getSummary,
  getPhotoDetail,
  getComments,
  getReviews,
  upsertVisual,
  updateRandomMovie,
  getRandomMovie,
  updateSamMovie,
  deleteMovie,
} = require("../controllers/visual.js");
const {
  getPhotos,
  getVideos,
  getVideo,
  getCast,
} = require("../controllers/douban.js");

router.route("/douban/:douban_id").get(getSummary);

router.route("/random").get(getRandomMovie);

router.route("/quiz").get(getQuizMovie);

router.route("/upsert").post(verify, upsertVisual);

router.route("/update_random").put(updateRandomMovie);

router.route("/:douban_id").get(getMovieDetail).put(updateSamMovie).delete(verify, deleteMovie);

module.exports = router;
