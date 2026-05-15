// routes/posts.js
const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const { isLoggedIn, isAuthor } = require('../middleware/auth');

router.route('/')
    .get(postController.index)
    .post(isLoggedIn, postController.createPost);

router.get('/new', isLoggedIn, postController.renderNewForm);

router.route('/:id')
    .get(postController.showPost)
    .put(isLoggedIn, isAuthor, postController.updatePost)
    .delete(isLoggedIn, isAuthor, postController.deletePost);

router.get('/:id/edit', isLoggedIn, isAuthor, postController.renderEditForm);

module.exports = router;