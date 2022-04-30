const express = require('express');
const router = express.Router();

const {findList,add,findDetail,update,remove} = require('../controllers/blog.js');

router.route('/')
.get(findList)
.post(add);

router.route('/:id')
.get(findDetail)
.put(update)
.delete(remove);

module.exports = router;