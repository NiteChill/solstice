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
app.use(cors());
app.use(express.json());
app.use(
  session({
    secret: 'not so secret key',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 14*24*60*60*1000}
  })
);

// routes
app.post('/login', (req, res) => {
  async function compare() {
    try {
      const user = await User.find({ email: req.body.email });
      if (user[0].password) {
        bcrypt.compare(req.body.password, user[0].password, (err, result) => {
          if (result) res.json({ message: 'connected' });
          else res.json({ message: 'wrong info' });
        });
      }
    } catch (error) {
      throw new Error(error);
    }
  }
  compare();
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
