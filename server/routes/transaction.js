const express = require('express');
const router = express.Router();
const {verify} = require('../helpers/verifyToken');

const {getStatistics,findList,create,category_list,detail,update,remove} = require('../controllers/transaction.js');

router.post('/',verify,findList);

router.post('/statistics',getStatistics);

router.post('/new',verify,create);

router.route('/categories')
.get(category_list);

router.route('/:id')
.post(detail)
.put(update)
.delete(remove);

module.exports = router;