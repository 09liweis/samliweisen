var express = require('express');
var router = express.Router();

const { findList, create, findDetail, update, remove } = require('../controllers/room.js');

router.route('/')
  .get(findList)
  .post(create);

router.route('/:id')
  .get(findDetail)
  .put(update)
  .delete(remove);

module.exports = router;