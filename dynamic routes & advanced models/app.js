const path = require('path'); // core Node module for working with file/directory paths

const express = require('express'); // web framework for routing and middleware
const bodyParser = require('body-parser'); // parses incoming request bodies (e.g. form data)

const errorController = require('./controllers/error'); // controller that handles error responses (404, etc.)
const adminRoutes = require('./routes/admin'); // router containing all /admin routes
const shopRoutes = require('./routes/shop'); // router containing all shop-facing routes

const app = express(); // create the Express application instance

app.set('view engine', 'ejs'); // tell Express to render views using the EJS templating engine
app.set('views', 'views'); // set the folder where view templates live

app.use(bodyParser.urlencoded({ extended: false })); // parse URL-encoded form data into req.body before routes run
app.use(express.static(path.join(__dirname, 'public'))); // serve static files (CSS, images, JS) from the public folder

app.use('/admin', adminRoutes); // mount admin routes under the /admin path prefix
app.use(shopRoutes); // mount shop routes at the root path
app.use(errorController.get404); // catch-all middleware for any unmatched route, returns a 404

app.listen(3000); // start the server and listen for requests on port 3000