const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const transporter = require('../util/mailer');
const { validationResult } = require('express-validator');


// Renders the login page
// Displays any flash error messages from previous failed login attempts
exports.getLogin = (req, res, next) => {
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null
  }
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    errorMessage: message,
    oldInput: {
      email: '',
      password: ''
    },
    validationErrors: []
  });
};

// Renders the signup page for new user registration
// Displays any flash error messages from previous failed signup attempts
exports.getSignup = (req, res, next) => {
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null
  }
  res.render('auth/signup', {
    path: '/signup',
    pageTitle: 'Signup',
    errorMessage: message,
    oldInput: {
      email: '',
      password: '',
      confirmPassword: ''
    },
    validationErrors: []
  });
};

// Handles user login form submission
// Validates credentials, compares hashed password, and creates a session if authentication succeeds
exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        errorMessage: errors.array()[0].msg,
        oldInput: {
          email: email,
          password: password
        },
        validationErrors: errors.array()
      });
    }

  User.findOne({ email: email })
    .then(user => {
      if (!user) {
        return res.status(422).render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        errorMessage: 'Invalid email or password.',
        oldInput: {
          email: email,
          password: password
        },
        validationErrors: []
      });
      }
      bcrypt
      .compare(password, user.password)
      .then(doMatch => {
        if (doMatch) {
          req.session.isLoggedIn = true;
          req.session.user = user;
          return req.session.save(err => {
            console.log(err);
            res.redirect('/');
          });
        }
          return res.status(422).render('auth/login', {
          path: '/login',
          pageTitle: 'Login',
          errorMessage: 'Invalid email or password.',
          oldInput: {
            email: email,
            password: password
          },
          validationErrors: []
        });
      })
      .catch(err => {
        console.log(err);
        res.redirect('/login');
      });
    })
    .catch(err => console.log(err));
};

// Handles new user registration
// Validates input, hashes password, creates user account, and sends a confirmation email
exports.postSignup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    console.log(errors.array());
    return res.status(422)
    .render('auth/signup', {
    path: '/signup',
    pageTitle: 'Signup',
    errorMessage: errors.array()[0].msg,
    oldInput: {
      email: email,
      password: password,
      confirmPassword: req.body.confirmPassword
    },
    validationErrors: errors.array()
  });
  }
     bcrypt
      .hash(password, 12)
      .then(hashedPassword => {
      const user = new User({
            email: email,
            password: hashedPassword,
            card: { items: [] }
          });
          return user.save();
      })
      .then(result => {
        res.redirect('/login');
        // Send an email
        return transporter.sendMail({
          from: '"Node" <andreaspanagi91@gmail.com>', // must be a verified sender in Brevo
          to: email,
          subject: 'Signup Succeeded!',
          html: '<p>You successfully signed up!</p>'
        });
      })
  .catch(err => {
    console.log(err);
  });
};

// Handles user logout
// Destroys the current session to log the user out
exports.postLogout = (req, res, next) => {
  req.session.destroy(err => {
    console.log(err);
    res.redirect('/');
  });
};


// Renders the password reset request page
// Allows users to enter their email to receive a password reset link
exports.getReset = (req, res, next) => {
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null
  }
  res.render('auth/reset', {
    path: '/reset',
    pageTitle: 'Reset Password',
    errorMessage: message
  });
}

// Handles password reset request submission
// Generates a secure token, stores it with expiration, and emails the reset link to the user
exports.postReset = (req, res, next) => {
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err);
      return res.redirect('/reset');
    }
    const token = buffer.toString('hex');
    User.findOne({email: req.body.email})
    .then(user => {
      if (!user) {
        req.flash('error', 'No account with tha email exists.');
        return res.redirect('/reset');
      }
      user.resetToken = token;
      user.resetTokenExpiration = Date.now() + 3600000;
      return user.save();
    })
    .then(result => {
      res.redirect('/');
      transporter.sendMail({
          from: '"Node" <andreaspanagi91@gmail.com>', // must be a verified sender in Brevo
          to: req.body.email,
          subject: 'Password Reset',
          html: `
            <p> You requested a password reset</p>
            <p>Click this <a href="http://localhost:3000/reset/${token}">link</a> to reset your password</p>
          `
        })
    })
    .catch(err => { 
      console.log(err)
    });
  });
};

// Renders the new password form after user clicks the reset link
// Validates the reset token and expiration before showing the form
exports.getNewPassword = (req, res, next) => {
  const token = req.params.token;
  User.findOne({resetToken: token, resetTokenExpiration: {$gt: Date.now()}})
  .then(user => {
    let message = req.flash('error');
    if (message.length > 0) {
      message = message[0];
    } else {
      message = null
    }
    res.render('auth/new-password', {
      path: '/new-password',
      pageTitle: 'Update Password',
      errorMessage: message,
      userId: user._id.toString(),
      passwordToken: token
    });
  })
  .catch(err => {
    console.log(err);
  });
}

// Handles new password submission after reset
// Validates token, hashes the new password, updates user account, and clears reset token
exports.postNewPassword = (req, res, next) => {
  const newPassword = req.body.password;
  const userId = req.body.userId;
  const passwordToken = req.body.passwordToken;
  let resetUser;

  User.findOne({
    resetToken: passwordToken, 
    resetTokenExpiration: {$gt: Date.now()}, 
    _id: userId
  })
  .then(user => {
    resetUser = user;
    return bcrypt.hash(newPassword, 12);
  })
  .then(hashedPassword => {
    resetUser.password = hashedPassword;
    resetUser.resetToken = undefined;
    resetUser.resetTokenExpiration = undefined;
    return resetUser.save();
  })
  .then(result => {
    res.redirect('/login');
  })
  .catch(err => {
    console.log(err);
  });
}