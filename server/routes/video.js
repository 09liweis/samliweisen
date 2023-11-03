var express = require('express');
var router = express.Router();

const { getBilibili } = require('../controllers/bilibili.js');

router.route('/bilibili').get(getBilibili);

module.exports = router;