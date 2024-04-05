const express = require('express'),
  router = express.Router(),
  userRoutes = require('../controlers/userControler.cjs'),
  articleRoutes = require('../controlers/articleControler.cjs');

router.get('/', userRoutes.getUser);
router.post('/login', userRoutes.loginUser);
router.post('/sign_up', userRoutes.signUp);
router.get('/new', articleRoutes.createArticle);

module.exports = router;
