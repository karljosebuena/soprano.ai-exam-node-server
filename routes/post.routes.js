const express = require('express');
const router = express.Router();

const postCtrl = require('../controllers/post.controller');
const authToken = require('../middlewares/authToken');

router.get('/', [authToken.verifyToken], postCtrl.findAllPosts);
router.get('/:id', [authToken.verifyToken], postCtrl.findOnePost);
router.get('/list/user', [authToken.verifyToken], postCtrl.findPostsByCreator);
router.post('/', [authToken.verifyToken], postCtrl.createPost);
router.put('/:id', [authToken.verifyToken], postCtrl.updatePost);
router.delete('/:id', [authToken.verifyToken], postCtrl.deletePost);

module.exports = router;