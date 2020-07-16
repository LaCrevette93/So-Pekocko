const express = require('express');
const router = express.Router();
const sauceCtrl = require('../controllers/sauce');

const auth = require('../middleware/auth');
const multer = require('../middleware/multer');
const controlSauce = require('../middleware/controlSauce');

router.post('/', auth, multer, controlSauce, sauceCtrl.createSauce);
router.get('/', auth, sauceCtrl.allSauces);
router.get('/:id', auth, sauceCtrl.oneSauce);
router.put('/:id', auth, multer, controlSauce, sauceCtrl.modifySauce);
router.delete('/:id', auth, sauceCtrl.deleteSauce);
router.post('/:id/like', auth, sauceCtrl.modifyLikeSauce);

module.exports = router;