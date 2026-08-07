const path = require('path');
require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const { MongoStore } = require('connect-mongo');
const csrf = require('csurf');
const flash = require('connect-flash');

const errorController = require('./controllers/error');
const User = require('./models/user');

// Use environment variable or fallback to localhost
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/shop';

const app = express();
const csrfProtection = csrf();

// console.log('Using MongoDB session store');

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'my secret',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: MONGODB_URI,
      collectionName: 'sessions'
    }),
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 // 1 day
    }
  })
);

app.use(flash());
app.use(csrfProtection);

app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => console.log(err));
});

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorController.get404);

mongoose
  .connect(MONGODB_URI)
  .then(result => {
    // console.log('Connected to MongoDB successfully');
    startServer();
  })
  .catch(err => {
    console.log('MongoDB connection failed:', err.message);
    // console.log('Starting server without database connection...');
    // console.log('To fix this, please check your MongoDB URI in .env file');
    startServer();
  });

function startServer() {
  app.listen(3000, () => {
    // console.log('Server running on port 3000');
    // console.log('MongoDB URI:', MONGODB_URI.replace(/:[^:@]*@/, ':****@')); // Hide password
  });
}
