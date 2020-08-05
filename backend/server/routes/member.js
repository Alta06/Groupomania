const express = require('express');
const router = express.Router();
const userMiddleware = require('../middleware/users.js');
const memberCtrl = require('../controller/member');

router.post('/signup', userMiddleware.validateRegister, memberCtrl.signUp);
router.post('/login', memberCtrl.login);

router.get('/User', userMiddleware.isLoggedIn, (req, res, next) => {
    console.log(req.userData);
  res.send('This is the secret content. Only logged in users can see that!');
});

module.exports = router;