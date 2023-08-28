const express = require('express');
const router = express.Router();

const { findList, add, findDetail, update, remove } = require('../controllers/contact.js');

router.route('/')
  .get(findList)
  .post(add);

router.route('/:id')
  .put(update)
  .delete(remove);

module.exports = router;