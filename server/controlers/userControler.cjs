const validator = require('validator');

const userModel = require('../models/userModel.cjs'),
  bcrypt = require('bcrypt');

const getUser = (req, res) => {
  if (req.session.user) res.json({ user: req.session.user });
  else res.json({ user: null });
};

const loginUser = async (req, res) => {
  const email = validator.escape(validator.trim(req.body.email ?? '')) ?? '',
    password = validator.escape(validator.trim(req.body.password ?? '')) ?? '';
  let errors = [];
  if (validator.isEmpty(email, { ignore_whitespace: true }))
    errors = [...errors, 'EMPTY_EMAIL'];
  if (validator.isEmpty(password, { ignore_whitespace: true }))
    errors = [...errors, 'EMPTY_PASSWORD'];

  if (errors.length !== 0) {
    res.json({ errors: errors });
    return;
  }

  try {
    const user = await userModel.findOne({ email: email });
    console.log(user);
    if (!user) {
      res.json({ errors: ['EMAIL_NOT_FOUND'] });
      return;
    }

    bcrypt.compare(password, user.password, (err, result) => {
      if (!err) {
        if (result) {
          // connection <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
          const userData = {
            id: user._id,
            name: user.name,
            email: user.email,
            age: user.age,
            createdAt: user.createdAt,
            profilePicture: user.profilePicture,
          };
          req.session.user = userData;
          res.send({ user: userData });
        } else {
          res.json({ errors: ['UNMATCHING_PASSWORD'] });
          return;
        }
      } else res.json({ errors: [err] });
    });
  } catch (error) {
    res.json({ errors: [error] });
    return;
  }
};

const signUp = async (req, res) => {
  const first_name = validator.escape(validator.trim(req.body.first_name ?? '')) ?? '',
    last_name = validator.escape(validator.trim(req.body.last_name ?? '')) ?? '',
    username = validator.escape(validator.trim(req.body.username ?? '')) ?? '',
    age = validator.escape(validator.trim(req.body.age ?? '')) ?? '',
    email = validator.escape(validator.trim(req.body.email ?? '')) ?? '',
    password = validator.escape(validator.trim(req.body.password ?? '')) ?? '',
    password_confirm = validator.escape(validator.trim(req.body.password_confirm ?? '')) ?? '';
  if (await userModel.findOne({ email: email })) {
    res.json({ errors: ['EMAIL_ALREADY_USED'] });
    return;
  }
};

module.exports = {
  getUser,
  loginUser,
  signUp,
};
