const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user');
const controlUser = require('../middleware/controlUser');

router.post('/signup', controlUser, userCtrl.signup);
router.post('/login',userCtrl.login);

module.exports = router;