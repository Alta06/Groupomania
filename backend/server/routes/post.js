const express = require('express');
const router = express.Router();
const userMiddleware = require('../middleware/users');
const postCtrl = require('../controller/post');
const multer = require('../middleware/multer-config');


router.post('/post', multer, postCtrl.createPost);
router.get('/post', postCtrl.getAllPost);

module.exports = router;