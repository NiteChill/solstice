const mongoose = require('mongoose'),
  articleModel = require('../models/articleModel.cjs');

const createArticle = (res, req) => {
  const id = new mongoose.Types.ObjectId(),
  article = new articleModel({
    _id: id,
    authorId: res.session.user.id,
  });
  try {
    article.save();
    req.json({ state: 'ok',  id: id});
  } catch (error) {
    req.json({ state: 'failed' });
  }
};

module.exports = {
  createArticle,
};
