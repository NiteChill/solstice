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
  console.log(req.body.password);
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
  // let hashPassword;
  // bcrypt.hash(password, saltRounds, (err, hash) => {
  //   hashPassword = hash;
  //   console.log(hashPassword);
  // });
  // const hashPassword = bcrypt.hash(password, saltRounds, async (err, hash) => hash);
  // const hashPassword = await new Promise((resolve, reject) => {
  //   bcrypt.hash(password, saltRounds, function (err, hash) {
  //     if (err) reject(err)
  //     resolve(hash)
  //   });
  const hashPassword = await new Promise((resolve, reject) => {
    bcrypt.hash(password, saltRounds, (err, hash) => {
      if (err) reject(err);
      resolve(hash);
    });
  })
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
  const dbUser = await userModel.findOne({ email: email }),
    userData = {
      id: dbUser._id,
      name: dbUser.name,
      email: dbUser.email,
      age: dbUser.age,
      createdAt: dbUser.createdAt,
      profilePicture: dbUser.profilePicture,
    };
  req.session.user = userData;
  res.send({ user: userData });
};

module.exports = {
  getUser,
  loginUser,
  signUp,
};
