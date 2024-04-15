const mongoose = require('mongoose');

const ArticleSchema = new mongoose.Schema(
  {
    _id: {
      type: mongoose.ObjectId,
      default: new mongoose.Types.ObjectId()
    },
    authorId: {
      type: mongoose.ObjectId,
      required: true
    },
    title: {
      type: String,
      default: 'My new article title!'
    },
    content: {
      type: String,
      default: '<h4>Good writing!</h4>',
    },
    createdAt: {
      type: Date,
      default: Date.now,
    }
  },
  { collection: 'articles', versionKey: false }
);

module.exports = mongoose.model('Article', ArticleSchema);
