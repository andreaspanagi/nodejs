// Authentication middleware to protect routes
// Checks if user is logged in via session and redirects to login if not authenticated
module.exports = (req, res, next) => {
    if (!req.session.isLoggedIn) {
        return res.redirect('/login');
    }
    next();
}