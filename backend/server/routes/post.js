const express = require('express');
const router = express.Router();
const postCtrl = require('../controller/post');
const auth = require('../middleware/auth');

router.post('/post', auth, postCtrl.createPost);
router.get('/post', auth, postCtrl.getAllPost);
router.post('/post/:id/like', auth, postCtrl.likePost);
router.post('/comment', auth, postCtrl.commentPost);
router.get('/comment', auth, postCtrl.getAllComments);

module.exports = router;