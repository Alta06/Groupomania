const express = require('express');
const router = express.Router();
const postCtrl = require('../controller/post');
const auth = require('../middleware/auth');

router.post('/post', auth, postCtrl.createPost);
router.get('/post', auth, postCtrl.getAllPost);
router.post('/:id/like', auth, postCtrl.likePost);

module.exports = router;