const express = require('express');
const { check, body } = require('express-validator');

const authController = require('../controllers/auth');
const User = require('../models/user');

const router = express.Router();

// Route to display the login page
router.get(
    '/login', 
    authController.getLogin
);

// Route to display the signup page for new user registration
router.get(
    '/signup', 
    authController.getSignup
);

// Route to handle login form submission
// Validates email format and password requirements before authenticating user
router.post(
    '/login',
    [
        body('email')
            .isEmail()
            .withMessage('Please enter a valid email address.')
            .normalizeEmail(),
        body('password', 'Password has to be valid')
            .isLength({min: 5})
            .isAlphanumeric()
            .trim()
    ],
    authController.postLogin
);

// Route to handle signup form submission
// Validates email uniqueness, password strength, and password confirmation match
router.post(
    '/signup',
    [
    check('email')
        .isEmail()
        .withMessage('Please enter a valid Email')
        .custom((value, { req }) => {
            // if (value === 'test@test.com') {
            //     throw new Error('This email address is forbidden.');
            // }
            // return true;
            return User.findOne({email: value})
            .then( userDoc => {
                if (userDoc) {
                    return Promise.reject('Email exists already, please pick a different one.');
                }
            });
        })
        .normalizeEmail(),
        body(
            'password',
            'Please enter a password with only numbers and text and at least 5 characters.'
        )
            .isLength({ min: 5 })
            .isAlphanumeric()
            .trim(),
        body('confirmPassword')
            .trim()
            .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Passwords have to match!');
            }
            return true;
        })
    ],
    authController.postSignup
);

// Route to handle user logout
// Destroys the session and logs the user out
router.post(
    '/logout', 
    authController.postLogout
);

// Route to display the password reset request page
router.get(
    '/reset', 
    authController.getReset
);

// Route to handle password reset request submission
// Generates and emails a password reset token to the user
router.post(
    '/reset', 
    authController.postReset
);

// Route to display the new password form
// Validates the reset token from the URL parameter before showing the form
router.get(
    '/reset/:token', 
    authController.getNewPassword
);

// Route to handle new password submission
// Updates the user's password and clears the reset token
router.post(
    '/new-password', 
    authController.postNewPassword
);

module.exports = router;