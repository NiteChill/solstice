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
    thumbnail: {
      type: String,
      default: '',
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
    },
    tags: {
      type: Array,
      default: null,
    },
    enable_comments: {
      type: Boolean,
      default: true,
    },
    comments: {
      type: Array,
      default: null,
    },
    privacy: {
      type: String,
      default: 'public',
    },
  },
  { collection: 'articles', versionKey: false }
);

ArticleSchema.index({ title: 'text', content: 'text', tags: 'text' });

module.exports = mongoose.model('Article', ArticleSchema);
