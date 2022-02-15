const {router} = require('../helpers/router');
const {verify} = require('../helpers/verifyToken');

const {findList,create,category_list,detail,update,remove} = require('../controllers/transaction.js');

router.post('/',verify,findList);

router.post('/new',verify,create);

router.route('/categories')
.get(category_list);

router.route('/:id')
.post(detail)
.put(update)
.delete(remove);

module.exports = router;