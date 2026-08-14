const path = require('path');

// Helper to get the root directory of the application
// Returns the directory of the main module for consistent path resolution
module.exports = path.dirname(require.main.filename);