// setup
require('dotenv').config();
const express = require('express'),
  mongoose = require('mongoose'),
  cors = require('cors'),
  app = express(),
  port = process.env.PORT || 3000,
  session = require('express-session'),
  userRoutes = require('./routes/routes.cjs');

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

app.use(
  session({
    secret: 'not so secret key',
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 14 * 24 * 60 * 60 * 1000,
      sameSite: false,
    },
  })
);

app.use('/api', userRoutes);

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
