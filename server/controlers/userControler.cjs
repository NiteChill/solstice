const validator = require('validator'),
  userModel = require('../models/userModel.cjs'),
  bcrypt = require('bcrypt'),
  saltRounds = 10;

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
            first_name: user.first_name,
            last_name: user.last_name,
            username: user.username,
            age: user.age,
            email: user.email,
            createdAt: user.createdAt,
            profile_picture: user.profile_picture,
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
  const first_name =
      validator.escape(validator.trim(req.body.first_name ?? '')) ?? '',
    last_name =
      validator.escape(validator.trim(req.body.last_name ?? '')) ?? '',
    username = validator.escape(validator.trim(req.body.username ?? '')) ?? '',
    age = validator.escape(validator.trim(req.body.age ?? '')) ?? '',
    email = validator.escape(validator.trim(req.body.email ?? '')) ?? '',
    password = validator.escape(validator.trim(req.body.password ?? '')) ?? '';
  if (await userModel.findOne({ email: email })) {
    res.json({ errors: ['EMAIL_ALREADY_USED'] });
    return;
  }
  const hashPassword = await new Promise((resolve, reject) => {
    bcrypt.hash(password, saltRounds, (err, hash) => {
      if (err) reject(err);
      resolve(hash);
    });
  });
  console.log(hashPassword + 'hi');
  const newUser = new userModel({
    first_name: first_name,
    last_name: last_name,
    username: username,
    age: age,
    email: email,
    password: hashPassword,
  });
  newUser.save();
  const dbUser = await userModel.findOne({ email: email });
  let userData;
  if (dbUser) {
    userData = {
      id: dbUser._id,
      first_name: dbUser?.first_name,
      last_name: dbUser?.last_name,
      username: dbUser?.username,
      age: dbUser?.age,
      email: dbUser?.email,
      createdAt: dbUser?.createdAt,
      profile_picture: dbUser?.profile_picture,
    };
  }
  if (userData) {
    req.session.user = userData;
    res.send({ user: userData });
  }
};

const getUsernameById = async (req, res) => {
  if (req.session.user?.id === req.body.id)
    res.send({ self: true });
  else {
    try {
      const response = await userModel.findById(req.body.id);
      res.send({ username: response.username });
    } catch (error) {
      res.send({ error: error });
    }
  }
};

const updateProfilePicture = async (req, res) => {
  try {
    const response = await userModel.findByIdAndUpdate(req.body.id, {
      profile_picture: req.body.profile_picture,
    });
    res.send({ status: 'ok' });
  } catch (error) {
    res.send({ error: error });
  }
}

module.exports = {
  getUser,
  loginUser,
  signUp,
  getUsernameById,
  updateProfilePicture
};
