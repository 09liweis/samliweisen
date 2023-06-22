const { router } = require('../helpers/router');

const { findList, updateRandom, upsert, getDetail } = require('../controllers/place.js');

router.route('/')
  .get(findList)
  .post(upsert);

router.route('/update_random').get(updateRandom);

router.route('/:id')
  .get(getDetail);

module.exports = router;