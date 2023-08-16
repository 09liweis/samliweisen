const { router } = require('../helpers/router');
const { verify } = require('../helpers/verifyToken');

const { list, register, login, detail, authThirdParty } = require('../controllers/user.js');

router.post('/list', verify, list);

router.route('/register').post(register);
router.route('/login').post(login);
router.post('/detail', verify, detail);

router.route('/auth').post(authThirdParty);

module.exports = router;