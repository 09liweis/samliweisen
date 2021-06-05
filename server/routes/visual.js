const express = require('express');
const router = express.Router();

const {search,inTheatre,getCelebrities,getSummary,getPhotoDetail,getComments,getReviews} = require('../controllers/visual.js');
const {getImdbBoxOffice} = require('../controllers/imdb.js');
const {getSubjects,getTags,getPhotos,getVideos,getVideo,getCast,getCommingMovies} = require('../controllers/douban.js');
const {getBilibili} = require('../controllers/bilibili.js');
const {getMaoyan} = require('../controllers/maoyan.js');

router.route('/search').post(search);

router.route('/in_theatre').post(inTheatre);

router.route('/comming').post(getCommingMovies);

router.route('/celebrities').post(getCelebrities);

router.route('/cast').post(getCast);

router.route('/summary').post(getSummary);

router.route('/videos').post(getVideos);

router.route('/video').post(getVideo);

router.route('/photos').post(getPhotos);

router.route('/photo').post(getPhotoDetail);

router.route('/comments').post(getComments);

router.route('/reviews').post(getReviews);

router.route('/imdb_boxoffice').post(getImdbBoxOffice);

router.route('/douban').post(getSubjects);

router.route('/douban/tags').post(getTags);

router.route('/bilibili').post(getBilibili);

router.route('/maoyan').post(getMaoyan);

module.exports = router;