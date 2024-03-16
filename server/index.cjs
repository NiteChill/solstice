// setup
require('dotenv').config();
const express = require('express'),
  mongoose = require('mongoose'),
  cors = require('cors'),
  app = express(),
  port = process.env.PORT || 3000,
  User = require('../models/user.cjs'),
  session = require('express-session'),
  bcrypt = require('bcrypt'),
  saltRounds = 10;

// connection
mongoose.connect(process.env.ATLAS_URI);
const connection = mongoose.connection;
connection.once('open', () => {
  console.log('MongoDB database connection established successfully');
});

// app init
app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  })
);
app.use(express.json());
// app.set('trust proxy', 1);
app.use(
  session({
    secret: 'not so secret key',
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 14 * 24 * 60 * 60 * 1000,
      sameSite: false,
      // secure: true,
    },
  })
);

// routes
app.get('/', (req, res) => {
  // console.log(req);
  // req.session.user = 'hi';
  console.log(req.session);
  if (req.session.user) {
    res.json({ user: req.session.cookie });
  }
});

app.post('/login', async (req, res) => {
  let errors = [];
  if (typeof req.body.email === 'undefined' || req.body.email === '')
    errors = [...errors, 'EMPTY_EMAIL'];
  if (typeof req.body.password === 'undefined' || req.body.password === '')
    errors = [...errors, 'EMPTY_PASSWORD'];

  if (errors.length !== 0) {
    res.json({ error: errors });
    return;
  }

  try {
    const user = await User.findOne({ email: req.body.email });
    console.log(user);
    if (!user) {
      res.json({ error: 'EMAIL_NOT_FOUND' });
      return;
    }

    bcrypt.compare(req.body.password, user.password, (err, result) => {
      if (!err) {
        if (result) {
          // connection <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
          const userData = {
            id: user._id,
            name: user.name,
            email: user.email,
            age: user.age,
            createdAt: user.createdAt,
          };
          req.session.user = userData;
          console.log(req.session);
          res.send({ user: userData });
        } else {
          res.json({ error: 'UNMATCHING_PASSWORD' });
          return;
        }
      } else res.json({ error: err });
    });
  } catch (error) {
    res.json({ error: error });
    return;
  }
});

app.get('/oui', (req, res) => {
  console.log(req.session);
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});

// hash password
// bcrypt.hash('1234', saltRounds, (err, hash) => {
//   async function hi() {
//     const user = await User.findOneAndUpdate({email: 'puissantachille@gmail.com'}, {password : hash});
//     console.log(user);
//   }
//   hi();
// });
