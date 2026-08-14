// Handles 404 errors for pages that don't exist
// Renders the 404 error page when a route is not found
exports.get404 = (req, res, next) => {
  res.status(404).render('404', {
    pageTitle: 'Page Not Found',
    path: '/404'
  });
};
