const {router} = require('../helpers/router');
const {verify} = require('../helpers/verifyToken');

const {list,register,login,detail} = require('../controllers/user.js');

router.post('/list',verify,list);

router.route('/register').post(register);
router.route('/login').post(login);
router.post('/detail',verify, detail);

module.exports = router;