var express = require('express');
var router = express.Router();

const { getBilibili } = require('../controllers/bilibili.js');
const { getMaoyan } = require('../controllers/maoyan.js');

router.route('/bilibili').get(getBilibili);

module.exports = router;