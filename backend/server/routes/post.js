const express = require('express');
const router = express.Router();
const userMiddleware = require('../middleware/users');
const postCtrl = require('../controller/post');


router.post('/post', postCtrl.createPost);
router.get('/post', postCtrl.getAllPost);

module.exports = router;