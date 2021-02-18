const router = require('express').Router();
const { getUser, updateProfile } = require('../controllers/user');
const { validateUserUpdate } = require('../middlewares/validateReq');

router.get('/me', getUser);
router.patch('/me', validateUserUpdate, updateProfile);

module.exports = router;
