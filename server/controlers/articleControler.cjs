const mongoose = require('mongoose'),
  articleModel = require('../models/articleModel.cjs');

const createArticle = (req, res) => {
  const id = new mongoose.Types.ObjectId(),
    article = new articleModel({
      _id: id,
      authorId: req.session.user.id,
    });
  try {
    article.save();
    res.json({ state: 'ok', id: id });
  } catch (error) {
    res.json({ state: 'failed' });
  }
};

const getSingleArticle = async (req, res) => {
  id = new mongoose.Types.ObjectId(req.body.id);
  try {
    const response = await articleModel.findById(id);
    res.send({ article: response });
  } catch (error) {
    res.send({ error: error });
  }
};

module.exports = {
  createArticle,
  getSingleArticle,
};
