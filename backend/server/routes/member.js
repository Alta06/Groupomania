const express = require('express');
const router = express.Router();
const userMiddleware = require('../middleware/users.js');
const memberCtrl = require('../controller/member');

router.post('/signup', userMiddleware.validateRegister, memberCtrl.signUp);
router.post('/login', memberCtrl.login);
router.get('/user', memberCtrl.getInfo)
 
module.exports = router;