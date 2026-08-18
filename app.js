// Load required dependencies and configure environment variables
const path = require('path');
require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const { MongoStore } = require('connect-mongo');
const csrf = require('csurf');
const flash = require('connect-flash');
const multer = require('multer');

const errorController = require('./controllers/error');
const User = require('./models/user');

// MongoDB connection string from environment variable or default to localhost
// Use environment variable or fallback to localhost
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/shop';

// Initialize Express application and CSRF protection middleware
const app = express();
const csrfProtection = csrf();
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images');
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString() + '-' + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/png' || 
      file.mimetype === 'image/jpg' || 
      file.mimetype === 'image/jpeg') 
  {
    cb(null, true);
  } else {
    cb(null, false);
  }
  
}

// console.log('Using MongoDB session store');

// Configure EJS as the templating engine
app.set('view engine', 'ejs');
app.set('views', 'views');

// Import route modules
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

// Parse incoming request bodies from forms
app.use(bodyParser.urlencoded({ extended: false }));

app.use(multer({ storage: fileStorage, fileFilter: fileFilter }).single('image'));

// Serve static files from the public directory (CSS, JS, images)
app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'images')));
// Configure session middleware with MongoDB storage
// Sessions persist across server restarts using MongoDB
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

// Enable flash messages for displaying one-time notifications
app.use(flash());

// Enable CSRF protection for all routes to prevent cross-site request forgery attacks
app.use(csrfProtection);

// Middleware to make authentication status and CSRF token available to all views
// These variables are used in EJS templates for conditional rendering and form security
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});

// Middleware to attach user object to request from session
// Retrieves full user document from database if user is logged in
app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then(user => {
      if (!user) {
        return next();
      }
      req.user = user;
      next();
    })
    .catch(err => {
      next(new Error(err));
    });
});


// Register application routes
// Admin routes are prefixed with /admin, shop and auth routes use root paths
app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

// Catch-all 500 errors
app.get('/500', errorController.get500);

// Catch-all 404 error handler for undefined routes
app.use(errorController.get404);

app.use((error, req, res, next) => {
    res.status(500).render('500', {
    pageTitle: 'Error',
    path: '/500',
    isAuthenticated: req.session.isLoggedIn
  });
})

// Connect to MongoDB and start the server
// Server starts even if MongoDB connection fails (for development purposes)
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

// Start the Express server on port 3000
function startServer() {
  app.listen(3000, () => {
    // console.log('Server running on port 3000');
    // console.log('MongoDB URI:', MONGODB_URI.replace(/:[^:@]*@/, ':****@')); // Hide password
  });
}
