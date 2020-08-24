const express = require('express');
const router = express.Router();
const commentCtrl = require('../controller/comment');
const auth = require('../middleware/auth');

router.post('/comment', auth, commentCtrl.commentPost);
router.get('/comment', auth, commentCtrl.getAllComments);

module.exports = router;