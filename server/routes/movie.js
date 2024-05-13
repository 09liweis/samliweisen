var express = require("express");
var router = express.Router();

const {
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
} = require("../controllers/visual.js");
const {
  getPhotos,
  getVideos,
  getVideo,
  getCast,
} = require("../controllers/douban.js");

router.route("/douban/:douban_id/casts").get(getCelebrities);

router.route("/cast/:cast_id").get(getCast);

router.route("/douban/:douban_id").get(getSummary);

router.route("/douban/:douban_id/videos").get(getVideos);

router.route("/video/:video_id").get(getVideo);

router.route("/douban/:douban_id/photos").get(getPhotos);

router.route("/photo/:photo_id").get(getPhotoDetail);

router.route("/douban/:douban_id/comments").get(getComments);

router.route("/douban/:douban_id/reviews").get(getReviews);

router.route("/random").get(getRandomMovie);

router.route("/upsert").post(upsertVisual);

router.route("/update_random").put(updateRandomMovie);

router.route("/:douban_id").get(getMovieDetail).put(updateSamMovie);

module.exports = router;
