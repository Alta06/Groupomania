const express = require('express');
const router = express.Router();
const postCtrl = require('../controller/post');
const auth = require('../middleware/auth');

router.post('/post', auth, postCtrl.createPost);
router.get('/post', auth, postCtrl.getAllPost);
router.post('/post/:id/like', auth, postCtrl.likePost);
router.get('/like', auth, postCtrl.getLikes);
router.delete('/post/:id', auth, postCtrl.deletePost);

module.exports = router;