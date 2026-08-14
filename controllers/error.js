// Handles 404 errors for pages that don't exist
// Renders the 404 error page when a route is not found
exports.get404 = (req, res, next) => {
  res.status(404).render('404', {
    pageTitle: 'Page Not Found',
    path: '/404',
    isAuthenticated: req.session.isLoggedIn
  });
};

// Handles 500 errors
// Renders the 500 error page
exports.get500 = (req, res, next) => {
  res.status(500).render('500', {
    pageTitle: 'Error',
    path: '/500',
    isAuthenticated: req.session.isLoggedIn
  });
};