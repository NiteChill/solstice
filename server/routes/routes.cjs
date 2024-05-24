const express = require('express'),
  router = express.Router(),
  userRoutes = require('../controlers/userControler.cjs'),
  articleRoutes = require('../controlers/articleControler.cjs');

router.get('/', userRoutes.getUser);
router.post('/login', userRoutes.loginUser);
router.post('/sign_up', userRoutes.signUp);
router.post('/get_username_by_id', userRoutes.getUsernameById);
router.post('/create_article', articleRoutes.createArticle);
router.post('/get_single_article', articleRoutes.getSingleArticle);
router.post('/update_article', articleRoutes.updateArticle);
router.post('/update_article_data', articleRoutes.updateArticleData);
router.post('/like', articleRoutes.like);
router.post('/unLike', articleRoutes.unLike);
router.post('/get_articles_by_category', articleRoutes.getArticlesByCategories);
router.post('/get_articles_by_user', articleRoutes.getArticlesByUser);
router.post('/get_articles_by_likes', articleRoutes.getArticlesByLikes);

module.exports = router;
