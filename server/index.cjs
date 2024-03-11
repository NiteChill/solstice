// setup
const express = require('express'),
  mongoose = require('mongoose'),
  cors = require('cors'),
  app = express(),
  port = process.env.PORT || 5000,
  User = require('../models/user.cjs'),
  session = require('express-session'),
  passport = require('passport'),
  LocalStrategy = require('passport-local'),
  passportLocalMongoose = require('passport-local-mongoose');

require('dotenv').config();

// connection
mongoose.connect(process.env.ATLAS_URI);
const connection = mongoose.connection;
connection.once('open', () => {
  console.log('MongoDB database connection established successfully');
});

// app init
app.use(cors());
app.use(express.json());
app.use(session({
  secret: "not so secret key",
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

// passport init
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// routes
app.get('/hello', (req, res) => {
  res.json({ message: 'Hello from server' });
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
