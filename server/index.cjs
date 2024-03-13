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
  })
);

// routes
app.post('/login', (req, res) => {
  const name = req.body.name,
    password = req.body.password;
  console.log(name, password);
  res.json({message: 'information received'})
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
