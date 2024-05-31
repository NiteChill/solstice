const mongoose = require('mongoose'),
  commentModel = require('../models/commentModel.cjs');

const getComments = async (req, res) => {
  try {
    const response = await commentModel.find({authorId: req.body.id});
    res.send({
      comments: response,
    });
  } catch (error) {
    res.send({ error: error });
  }
};

const createComment = async (req, res) => {
  try {
    if (req.session.user.id !== req.body.id) return;
    console.log(req.session.user?.id + ' ' + req.body.id); // why??
    const comment = new commentModel({
      articleId: req.body.articleId,
      authorId: req.session.user.id,
      content: req.body.content,
    });
    await comment.save();
    res.send({
      state: 'ok',
    });
  } catch (error) {
    res.send({ error: error });
  }
}

const deleteComment = async (req, res) => {
  try {
    commentModel.findByIdAndDelete(req.body.id);
    res.send({
      state: 'ok',
    });
  } catch (error) {
    res.send({ error: error });
  }
}

const updateComment = async (req, res) => {
  try {
    commentModel.findByIdAndUpdate(req.body.id, {
      content: req.body.content,
    });
    res.send({
      state: 'ok',
    });
  } catch (error) {
    res.send({ error: error });
  }
}

module.exports = {
  getComments,
  createComment,
  deleteComment,
  updateComment,
};
