const express = require('express'),
  router = express.Router(),
  userRoutes = require('../controlers/userControler.cjs'),
  articleRoutes = require('../controlers/articleControler.cjs'),
  commentRoutes = require('../controlers/commentsControler.cjs');

router.get('/', userRoutes.getUser);
router.post('/login', userRoutes.loginUser);
router.post('/sign_up', userRoutes.signUp);
router.post('/get_username_by_id', userRoutes.getUsernameById);
router.post('/update_profile_picture', userRoutes.updateProfilePicture);
router.post('/update_account_data', userRoutes.updateAccountData);
router.get('/sign_out', userRoutes.signOut);
router.post('/get_account', userRoutes.getAccount);
router.post('/delete_account', userRoutes.deleteAccount);

router.post('/create_article', articleRoutes.createArticle);
router.post('/get_single_article', articleRoutes.getSingleArticle);
router.post('/update_article', articleRoutes.updateArticle);
router.post('/update_article_data', articleRoutes.updateArticleData);
router.post('/like', articleRoutes.like);
router.post('/unLike', articleRoutes.unLike);
router.post('/get_articles_by_category', articleRoutes.getArticlesByCategories);
router.post('/get_articles_by_user', articleRoutes.getArticlesByUser);
router.post('/get_articles_by_likes', articleRoutes.getArticlesByLikes);
router.post('/delete_article', articleRoutes.deleteArticle);
router.post('/search', articleRoutes.searchArticles);

router.post('/get_comments', commentRoutes.getComments);
router.post('/create_comment', commentRoutes.createComment);
router.post('/delete_comment', commentRoutes.deleteComment);
router.post('/update_comment', commentRoutes.updateComment);
router.post('/get_comment_author', commentRoutes.getCommentAuthor);

module.exports = router;
