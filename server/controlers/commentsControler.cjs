const mongoose = require('mongoose'),
  commentModel = require('../models/commentModel.cjs'),
  userModel = require('../models/userModel.cjs');

const getComments = async (req, res) => {
  try {
    const response = await commentModel.find({ articleId: req.body.id });
    res.send({
      comments: response,
    });
  } catch (error) {
    res.send({ error: error });
  }
};

const createComment = async (req, res) => {
  try {
    if (req.session.user.id !== req.body.id)
      return res.send({ error: 'unauthorized' });
    const comment = new commentModel({
      _id: new mongoose.Types.ObjectId(),
      articleId: req.body.articleId,
      authorId: req.session.user.id,
      content: req.body.content,
    });
    const output = await comment.save();
    if (output) {
      res.send({
        comment: output,
      });
    } else {
      res.send({
        error: 'unknown',
      });
    }
  } catch (error) {
    res.send({ error: error });
  }
};

const deleteComment = async (req, res) => {
  try {
    commentModel.findByIdAndDelete(req.body.id);
    res.send({
      state: 'ok',
    });
  } catch (error) {
    res.send({ error: error });
  }
};

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
};

const getCommentAuthor = async (req, res) => {
  try {
    const response = await userModel.findById(req.body.id);
    res.send({
      author: {
        username: response.username,
        profile_picture: response.profile_picture,
      },
    });
  } catch (error) {
    res.send({ error: error });
  }
};

module.exports = {
  getComments,
  createComment,
  deleteComment,
  updateComment,
  getCommentAuthor,
};
