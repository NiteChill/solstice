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
      default: 'Untitled'
    },
    content: {
      type: String,
      default: '',
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    likes: {
      type: Array,
      default: null,
    }
  },
  { collection: 'articles', versionKey: false }
);

module.exports = mongoose.model('Article', ArticleSchema);
