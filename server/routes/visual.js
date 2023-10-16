var express = require('express');
var router = express.Router();

const { samVisuals, getMovieDetail, search, inTheatre, getDoubanChart, getCelebrities, getSummary, getPhotoDetail, getComments, getReviews, upsertVisual, updateRandomMovie, updateSamMovie } = require('../controllers/visual.js');
const { getImdbBoxOffice } = require('../controllers/imdb.js');
const { getSubjects, getTags, getPhotos, getVideos, getVideo, getCast, getCommingMovies } = require('../controllers/douban.js');
const { getMaoyan } = require('../controllers/maoyan.js');

router.route('/').get(samVisuals);

router.route('/search').get(search);

router.route('/in_theatre').get(inTheatre);

router.route('/comming').get(getCommingMovies);

router.route('/chart').get(getDoubanChart);

router.route('/celebrities').post(getCelebrities);

router.route('/cast').post(getCast);

router.route('/douban/:douban_id').get(getSummary);

router.route('/videos').post(getVideos);

router.route('/video').post(getVideo);

router.route('/photos').post(getPhotos);

router.route('/photo').post(getPhotoDetail);

router.route('/comments').post(getComments);

router.route('/reviews').post(getReviews);

router.route('/imdb_boxoffice').post(getImdbBoxOffice);

router.route('/douban').post(getSubjects);

router.route('/douban/tags').post(getTags);

router.route('/maoyan').post(getMaoyan);

router.route('/upsert').post(upsertVisual);

router.route('/update_random').put(updateRandomMovie);

router.route('/:douban_id')
  .get(getMovieDetail)
  .put(updateSamMovie);

module.exports = router;