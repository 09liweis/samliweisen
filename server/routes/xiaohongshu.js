var express = require('express');
var router = express.Router();

const { getXiaohongshu } = require('../controllers/xiaohongshu.js');

router.route('/').get(getXiaohongshu);

module.exports = router;