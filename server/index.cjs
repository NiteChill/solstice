// setup
require('dotenv').config();
const express = require('express'),
  mongoose = require('mongoose'),
  cors = require('cors'),
  app = express(),
  port = process.env.PORT || 3000,
  User = require('../models/user.cjs'),
  session = require('express-session');

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
  const email = req.body.email,
    password = req.body.password;
  console.log(email, password);
  res.json({ message: email + password });
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
