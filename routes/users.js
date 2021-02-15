const router = require('express').Router();
const { checkToken, updateProfile } = require('../controllers/user');
const { validateUserUpdate } = require('../middlewares/validateReq');

router.get('/me', checkToken);
router.patch('/me', validateUserUpdate, updateProfile);

module.exports = router;
