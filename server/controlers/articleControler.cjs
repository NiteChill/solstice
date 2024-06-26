const mongoose = require('mongoose'),
  articleModel = require('../models/articleModel.cjs'),
  userModel = require('../models/userModel.cjs');

const createArticle = async (req, res) => {
  try {
    const id = new mongoose.Types.ObjectId(),
      response = await articleModel.findOne({ authorId: req.session.user.id });

    const article = new articleModel({
      _id: id,
      authorId: req.session.user.id,
      title: req.body.title,
      thumbnail: req.body.thumbnail,
      enable_comments: req.body.enable_comments,
      privacy: req.body.privacy,
      tags: req.body.tags,
      content: response
        ? ''
        : `
        <h4>
          Welcome to solstice's text editor!
        </h4>
        <p>
          Try all the tools provided to you by <strong><a href='https://www.tiptap.dev'>TipTap</a></strong>'s <strong><em>rich text editor</em></strong> and stylized by me :)
        </p>
        <ul>
          <li>
            Bullet lists...
          </li>
          <li>
            ...with multiples elements
          </li>
        </ul>
        <pre><code class="language-javascript">&lt;p&gt;Code blocks!&lt;/p&gt;</code></pre>
        <blockquote>
          Incredible quotes like this one
          <br />
          — A. Puissant
        </blockquote>
        <p>And a lot more.</p>
        <h6><span style='color: var(--on-surface-variant)'>Have fun creating wonderful stories with Solstice!</span></h6>
        `,
    });
    if (response) {
      const output = await article.save();
      if (output) res.send({ id: id });
      else res.send({ state: 'failed' });
    } else res.send({ state: 'failed' });
  } catch (error) {
    res.send({ state: 'failed' });
  }
};

const getSingleArticle = async (req, res) => {
  try {
    const response = await articleModel.findById(req.body.id);
    const responseUserInformation = await userModel.findById(response.authorId);
    res.send({
      article: {
        ...response._doc,
        author: responseUserInformation.username,
        avatar: responseUserInformation.profile_picture,
      },
    });
  } catch (error) {
    res.send({ error: error });
  }
};

const updateArticle = async (req, res) => {
  if (req?.body.content && req.body?.id) {
    const response = await articleModel.findByIdAndUpdate(req.body.id, {
      content: req.body.content,
    });
    if (response) res.json({ state: 'ok' });
    else res.json({ state: 'failed' });
  } else res.json({ state: 'failed' });
};

const updateArticleData = async (req, res) => {
  if (req.body?.authorId === req.session?.user.id) {
    const response = await articleModel.findByIdAndUpdate(req.body.id, {
      enable_comments: req.body.enable_comments,
      privacy: req.body.privacy,
      tags: req.body.tags,
      thumbnail: req.body.thumbnail,
      title: req.body.title,
    });
    if (response) res.json({ state: 'ok' });
    else res.json({ state: 'failed' });
  } else res.json({ state: 'failed' });
};

const like = async (req, res) => {
  try {
    const response = await articleModel.findByIdAndUpdate(
      req.body.article._id,
      {
        likes: [...req.body.article.likes, req.body.id],
      }
    );
    res.send({ state: 'ok' });
  } catch (error) {
    res.send({ error: error });
  }
};

const unLike = async (req, res) => {
  const arr = req.body.article.likes,
    index = arr.indexOf(req.body.id);
  arr.splice(index, 1);
  try {
    const response = await articleModel.findByIdAndUpdate(
      req.body.article._id,
      {
        likes: arr,
      }
    );
    res.send({ state: 'ok' });
  } catch (error) {
    res.send({ error: error });
  }
};

const getArticlesByCategories = async (req, res) => {
  try {
    const response =
      req.body.tags === 'all'
        ? await articleModel
            .find({ privacy: 'public' })
            .sort({ createdAt: -1 })
            .limit(15)
        : await articleModel
            .find({
              privacy: 'public',
              tags: { $in: req.body.tags },
            })
            .sort({ createdAt: -1 })
            .limit(15);
    res.send({ articles: response });
  } catch (error) {
    res.send({ error: error });
  }
};

const getArticlesByUser = async (req, res) => {
  try {
    const response = await articleModel
      .find({ authorId: req.body.id })
      .sort({ createdAt: -1 })
      .limit(15);
    res.send({ articles: response });
  } catch (error) {
    res.send({ error: error });
  }
};

const getArticlesByLikes = async (req, res) => {
  try {
    const response = await articleModel
      .find({
        likes: { $in: req.body.id },
      })
      .sort({ createdAt: -1 })
      .limit(15);
    res.send({ articles: response });
  } catch (error) {
    res.send({ error: error });
  }
};

const deleteArticle = async (req, res) => {
  try {
    const response = await articleModel.findByIdAndDelete(req.body.id);
    res.send({ state: 'ok' });
  } catch (error) {
    res.send({ error: error });
  }
};

const searchArticles = async (req, res) => {
  const agg = [
    {
      $search: {
        index: 'articlesSearch',
        text: {
          query: req.body.query,
          // path: {
          //   wildcard: '*',
          // },
          path: [
            'title',
            'content',
          ],
          fuzzy: {},
        },
      },
    },
    {
      $sort: {
        score: { $meta: 'textScore' },
      },
    },
    {
      $limit: 15,
    },
  ];
  try {
    const response = await articleModel.aggregate(agg).exec();
    res.send({ articles: response });
  } catch (error) {
    res.send({ error: error });
  }
};

module.exports = {
  createArticle,
  getSingleArticle,
  updateArticle,
  updateArticleData,
  like,
  unLike,
  getArticlesByCategories,
  getArticlesByUser,
  getArticlesByLikes,
  deleteArticle,
  searchArticles,
};
