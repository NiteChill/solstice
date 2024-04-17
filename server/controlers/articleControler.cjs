const mongoose = require('mongoose'),
  articleModel = require('../models/articleModel.cjs');

const createArticle = async (req, res) => {
  const id = new mongoose.Types.ObjectId(),
    response = await articleModel.findOne({ authorId: req.session.user.id });

  article = new articleModel({
    _id: id,
    authorId: req.session.user.id,
    content: response
      ? ''
      : `
        <img src="https://lh3.googleusercontent.com/186ZGdDhTLrvBaobO6wvilzpbjD45K7I9ifjwvk9Qt2HetzkWX0W5BN3Vi0tMYKDQPa11rbghe1m1syRvVbZhkZDajHhxQNc9B_pcCBrVVGvMEOZc-k=w2400-rj" contenteditable="false" draggable="true" class="ProseMirror-selectednode">
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
