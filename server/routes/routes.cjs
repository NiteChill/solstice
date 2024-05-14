const express = require('express'),
  router = express.Router(),
  userRoutes = require('../controlers/userControler.cjs'),
  articleRoutes = require('../controlers/articleControler.cjs');

router.get('/', userRoutes.getUser);
router.post('/login', userRoutes.loginUser);
router.post('/sign_up', userRoutes.signUp);
router.get('/create_article', articleRoutes.createArticle);
router.post('/get_single_article', articleRoutes.getSingleArticle);
router.post('/update_article', articleRoutes.updateArticle);
router.post('/like', articleRoutes.like);
router.post('/unLike', articleRoutes.unLike);

module.exports = router;
