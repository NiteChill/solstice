const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema(
  {
    _id: {
      type: mongoose.ObjectId,
      default: new mongoose.Types.ObjectId(),
    },
    articleId: {
      type: mongoose.ObjectId,
      required: true,
    },
    authorId: {
      type: mongoose.ObjectId,
      required: true,
    },
    content: {
      type: String,
      default: '',
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { collection: 'comments', versionKey: false }
);

module.exports = mongoose.model('Comment', CommentSchema);
