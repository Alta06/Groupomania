const express = require('express');
const router = express.Router();
const memberCtrl = require('../controller/member');
const auth = require('../middleware/auth');

router.post('/signup', memberCtrl.signUp);
router.post('/login', memberCtrl.login);
router.get('/user', auth, memberCtrl.getInfo)
 
module.exports = router;