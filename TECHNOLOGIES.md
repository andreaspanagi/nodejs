# Technologies Used in User Authentication Project

## Backend Framework & Runtime

### **Node.js**
JavaScript runtime environment built on Chrome's V8 engine that allows executing JavaScript on the server-side. Enables building scalable network applications with event-driven, non-blocking I/O operations. Powers the entire backend of this application.

### **Express.js** (v4.16.3)
Minimal and flexible Node.js web application framework that provides a robust set of features for building web and mobile applications. Handles routing, middleware integration, HTTP utilities, and template rendering. Acts as the backbone of the application's server-side architecture.

---

## Database & ODM

### **MongoDB** (v7.5.0)
NoSQL document-oriented database that stores data in flexible, JSON-like documents (BSON format). Provides high performance, high availability, and automatic scaling. Used in this project to store users, products, orders, and sessions. Chosen for its flexibility with schema design and excellent integration with Node.js ecosystem.

### **Mongoose** (v9.8.0)
MongoDB object modeling tool (ODM) that provides schema-based solution to model application data. Includes built-in type casting, validation, query building, and business logic hooks. Simplifies MongoDB interactions by providing a straightforward schema-based approach. Used extensively throughout the application for defining User, Product, and Order models with relationships and validation.

### **MySQL2** (v3.23.1)
Fast MySQL database driver for Node.js with prepared statements and binary protocol support. *Included in dependencies but not actively used in this project.* Likely present for learning purposes or future migration considerations.

### **Sequelize** (v6.37.8)
Promise-based Node.js ORM for relational databases (Postgres, MySQL, MariaDB, SQLite, Microsoft SQL Server). *Included in dependencies but not actively used.* Provides powerful features like migrations, associations, transactions, and model synchronization. Present for potential SQL database integration scenarios.

---

## Authentication & Security

### **bcryptjs** (v3.0.3)
Password hashing library that implements the bcrypt algorithm in JavaScript. Provides secure one-way encryption for passwords with built-in salt generation. Uses a configurable work factor (cost) to control computational expense, making brute-force attacks infeasible. In this project, passwords are hashed with a salt round of 12 before being stored in the database, ensuring user credentials are never stored in plain text.

### **express-session** (v1.15.6)
Session middleware for Express that creates and manages user sessions. Stores session data on the server-side and sends a session ID to the client via cookies. Essential for maintaining user state across multiple HTTP requests (stateless protocol). Configured to use MongoDB as the session store for persistence across server restarts.

### **connect-mongo** (v6.0.0)
MongoDB session store for Express sessions that persists session data in MongoDB collections. Prevents session loss on server restart and enables session sharing across multiple server instances. Configured to store sessions in a dedicated `sessions` collection with automatic TTL (time-to-live) based on cookie maxAge.

### **csurf** (v1.11.0)
CSRF (Cross-Site Request Forgery) protection middleware that generates and validates CSRF tokens for state-changing operations. Prevents malicious websites from performing unauthorized actions on behalf of authenticated users. Every POST form in this application includes a CSRF token that must be validated before the request is processed, protecting against CSRF attacks.

### **connect-flash** (v0.1.1)
Special middleware that stores temporary messages in the session for display after redirects. Used to show success messages (e.g., "Login successful") or error messages (e.g., "Invalid credentials") to users. Messages are automatically cleared after being displayed once. Particularly useful in authentication flows where POST requests redirect to GET routes.

---

## Template Engine

### **EJS** (v6.0.1) - *Actively Used*
Embedded JavaScript templating engine that generates HTML markup with plain JavaScript. Supports partials/includes for reusable components (navigation, header, footer), conditional rendering, loops, and JavaScript expressions. Chosen for its simplicity and JavaScript-like syntax. Used throughout the application to render all views including authentication pages, product listings, cart, and admin panels.

### **Pug** (v3.0.4) - *Not Currently Used*
Whitespace-sensitive template engine with cleaner, more minimal syntax (formerly known as Jade). *Included but not actively used in this project.* Likely present for educational purposes or as an alternative template engine option.

### **Express Handlebars** (v9.0.1) - *Not Currently Used*
Logic-less templating engine based on Mustache with added features like helpers and partials. *Included but not actively used.* Another template engine alternative included in the project dependencies.

---

## Request Parsing

### **body-parser** (v1.18.3)
Middleware that parses incoming HTTP request bodies and makes the data available under `req.body`. Supports URL-encoded data (forms) and JSON payloads. Essential for processing form submissions (login, signup, product creation). Configured with `extended: false` to use the classic query string library for parsing.

**Note:** In newer Express versions (4.16+), body-parser is bundled as `express.json()` and `express.urlencoded()`, but this project uses the standalone package.

---

## Configuration

### **dotenv** (v17.4.2)
Zero-dependency module that loads environment variables from a `.env` file into `process.env`. Enables separation of configuration from code, following the Twelve-Factor App methodology. Used in this project to store sensitive information like the MongoDB connection URI (`MONGODB_URI`) outside of version control, enhancing security and enabling different configurations for development, testing, and production environments.

---

## Development Tools

### **nodemon** (v3.1.14)
Development utility that automatically restarts the Node.js application when file changes are detected in the directory. Dramatically improves development workflow by eliminating the need to manually stop and restart the server after each code change. Configured as the default start script (`npm start`) for development. Not used in production environments where the server should remain stable.
---

## Frontend Technologies

### **HTML5**
Modern markup language for structuring web content. Used throughout the application to create semantic, accessible forms and content layouts. Provides features like form validation attributes, semantic elements, and improved accessibility.

### **CSS3**
Styling language used to design and layout the application's user interface. Organized into modular stylesheets:
- `main.css` - Global styles and layout
- `auth.css` - Authentication page styles (login/signup)
- `forms.css` - Form element styling
- `product.css` - Product display and cards
- `cart.css` - Shopping cart layout
- `orders.css` - Order history styling

### **Vanilla JavaScript**
Pure JavaScript without frameworks or libraries for client-side interactivity. Provides basic DOM manipulation and user interactions. Demonstrates fundamental JavaScript concepts without the overhead of frameworks like React or Vue.

---

## Architecture & Patterns

### **MVC Pattern** (Model-View-Controller)
Architectural pattern that separates application logic into three interconnected components:

- **Models** (`/models/`)
  - `User.js` - User schema with authentication, cart management methods
  - `Product.js` - Product schema with validation and relationships
  - `Order.js` - Order schema linking users and products
  - Handle data structure, validation, and business logic

- **Views** (`/views/`)
  - EJS templates for rendering HTML
  - Organized by feature (auth, shop, admin)
  - Reusable partials (navigation, header, footer)
  - Presentation layer only, no business logic

- **Controllers** (`/controllers/`)
  - `auth.js` - Authentication logic (login, signup, logout)
  - `shop.js` - Shopping functionality (products, cart, orders)
  - `admin.js` - Admin operations (CRUD for products)
  - `error.js` - Error handling and 404 pages
  - Process requests, interact with models, render views

### **RESTful Routing**
HTTP methods mapped to CRUD operations following REST principles:
- `GET` - Retrieve resources (product listings, cart display)
- `POST` - Create/modify resources (add product, place order, update cart)
- Route organization by resource type (`/products`, `/cart`, `/admin/products`)

### **Middleware Pattern**
Functions with access to request/response objects that can:
- Parse request bodies (`body-parser`)
- Manage sessions (`express-session`)
- Authenticate users (`is-auth.js`)
- Protect against CSRF attacks (`csurf`)
- Inject common data into views (`res.locals`)
- Execute in sequence via `next()` function

Middleware Order (Critical):
1. Body parsing
2. Static file serving
3. Session initialization
4. Flash messages
5. CSRF protection
6. User authentication
7. View locals injection
8. Route handlers
9. Error handlers

---

## Key Features Implemented

### Authentication System
- **User Registration** - Email and password signup with validation
- **Password Security** - bcrypt hashing with salt rounds (cost factor: 12)
- **User Login** - Email/password verification with session creation
- **Session Management** - Persistent sessions stored in MongoDB
- **Logout** - Session destruction and cleanup
- **Flash Messages** - Success/error notifications across redirects

### CSRF Protection
- Token generation per request
- Hidden form fields with CSRF tokens
- Automatic validation on all POST requests
- Protection against cross-site request forgery attacks

### Shopping Cart
- Add products to cart
- Update quantities for existing products
- Remove items from cart
- Cart persistence per user session
- Cart data stored in User model

### Product Management (Admin)
- Create new products with title, price, description, image URL
- Edit existing products
- Delete products
- View all products in admin panel
- User-specific product ownership

### Order Processing
- Convert cart items to orders
- Store order history per user
- Clear cart after order placement
- View order history

### Authorization & Protected Routes
- Middleware-based route protection (`is-auth.js`)
- Redirects for unauthorized access
- User-specific data access control

---

## Project Structure

```
user-auth/
├── controllers/          # Application logic and request handlers
│   ├── admin.js         # Admin product management
│   ├── auth.js          # Authentication (login, signup, logout)
│   ├── shop.js          # Shopping features (cart, orders)
│   └── error.js         # Error handling (404)
│
├── models/              # Database schemas and business logic
│   ├── user.js          # User model with cart methods
│   ├── product.js       # Product model with validation
│   └── order.js         # Order model with user relations
│
├── routes/              # Route definitions and middleware
│   ├── admin.js         # Admin routes (protected)
│   ├── auth.js          # Authentication routes (public)
│   └── shop.js          # Shop routes (mixed)
│
├── views/               # EJS templates
│   ├── auth/            # Login and signup pages
│   ├── shop/            # Product listings, cart, orders
│   ├── admin/           # Admin product management
│   └── includes/        # Reusable partials (nav, header, footer)
│
├── public/              # Static assets served directly
│   ├── css/             # Stylesheets
│   └── js/              # Client-side JavaScript
│
├── middleware/          # Custom middleware functions
│   └── is-auth.js       # Authentication verification
│
├── util/                # Utility functions
│   └── path.js          # Path helpers
│
├── data/                # JSON data files (fallback/seed data)
├── .env                 # Environment variables (not in git)
├── .gitignore           # Git ignore rules
├── app.js               # Application entry point
└── package.json         # Dependencies and scripts
```

---

## Environment Variables

### `MONGODB_URI`
MongoDB connection string for database access. Format:
```
mongodb://[username:password@]host[:port]/database[?options]
```
Example:
```
MONGODB_URI=mongodb://localhost:27017/shop
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/shop
```

Fallback: `mongodb://localhost:27017/shop` if not set

### Recommended Additional Variables (Security)
```env
SESSION_SECRET=your-strong-random-secret-here
NODE_ENV=development
PORT=3000
```

---

## Server Configuration

### Port
- **Default:** 3000
- Accessible at: `http://localhost:3000`
- Can be configured via `PORT` environment variable (recommended for production)

### Session Settings
- **Lifetime:** 24 hours (86400000 ms)
- **Secret:** `'my secret'` (hardcoded - should use env variable in production)
- **Store:** MongoDB collection named `sessions`
- **Cookie Settings:**
  - `resave: false` - Don't save session if unmodified
  - `saveUninitialized: false` - Don't create session until something stored
  - `maxAge: 1 day` - Cookie expiration time

### Security Recommendations for Production
```javascript
{
  secret: process.env.SESSION_SECRET,
  cookie: {
    httpOnly: true,      // Prevent XSS attacks
    secure: true,        // HTTPS only
    sameSite: 'strict',  // CSRF protection
    maxAge: 24 * 60 * 60 * 1000
  }
}
```

---

## Scripts

### `npm start`
Runs the application in development mode with nodemon for auto-restart on file changes.
```bash
nodemon app.js
```

### `npm run start-server`
Runs the application in production mode with standard node (no auto-restart).
```bash
node app.js
```

### `npm test`
Currently not configured. Returns error message. Testing framework needs to be set up.

---

## Database Collections

### `users`
- `email` (String, required, unique)
- `password` (String, required, hashed)
- `cart` (Object with items array)
  - `productId` (ObjectId reference to Product)
  - `quantity` (Number)

### `products`
- `title` (String, required)
- `price` (Number, required)
- `description` (String, required)
- `imageUrl` (String, required)
- `userId` (ObjectId reference to User)

### `orders`
- `items` (Array of products with quantities)
- `user` (Object with user details)

### `sessions`
- Automatically managed by `connect-mongo`
- Stores serialized session data
- TTL (time-to-live) based on cookie maxAge

---

## Learning Concepts Demonstrated

This project demonstrates understanding of:

1. **Full-Stack Web Development** - Complete CRUD application with authentication
2. **Security Best Practices** - Password hashing, CSRF protection, session management
3. **Database Design** - Schema modeling, relationships, embedded documents
4. **Authentication & Authorization** - Session-based auth, protected routes
5. **MVC Architecture** - Separation of concerns, organized code structure
6. **Middleware Concepts** - Request/response pipeline, custom middleware
7. **Template Rendering** - Server-side rendering with EJS
8. **Error Handling** - Flash messages, validation, error pages
9. **RESTful API Design** - Resource-based routing, HTTP methods
10. **Environment Configuration** - Dotenv, configuration management

---

## Potential Enhancements

### Security
- [ ] Add input validation and sanitization
- [ ] Implement rate limiting for login attempts
- [ ] Add email verification for new accounts
- [ ] Implement password reset functionality
- [ ] Use environment variable for session secret
- [ ] Add HTTPS in production
- [ ] Implement password strength requirements
- [ ] Add two-factor authentication (2FA)

### Features
- [ ] Product search and filtering
- [ ] Product categories and tags
- [ ] User profile management
- [ ] Order status tracking
- [ ] Payment gateway integration
- [ ] Product reviews and ratings
- [ ] Image upload for products
- [ ] Email notifications
- [ ] Admin dashboard with analytics

### Testing
- [ ] Unit tests for models and controllers
- [ ] Integration tests for routes
- [ ] End-to-end tests with Cypress or Playwright
- [ ] API testing with Supertest
- [ ] Test coverage reporting

### Performance
- [ ] Add caching with Redis
- [ ] Implement pagination for product lists
- [ ] Optimize database queries with indexing
- [ ] Add image optimization and CDN
- [ ] Implement lazy loading

### Code Quality
- [ ] Add ESLint for code linting
- [ ] Implement Prettier for code formatting
- [ ] Add JSDoc comments for documentation
- [ ] Set up CI/CD pipeline
- [ ] Add logging with Winston or Morgan

---

## Dependencies Summary

| Package | Version | Type | Status | Purpose |
|---------|---------|------|--------|---------|
| express | 4.16.3 | Runtime | ✅ Active | Web framework |
| mongoose | 9.8.0 | Runtime | ✅ Active | MongoDB ODM |
| bcryptjs | 3.0.3 | Runtime | ✅ Active | Password hashing |
| express-session | 1.15.6 | Runtime | ✅ Active | Session management |
| connect-mongo | 6.0.0 | Runtime | ✅ Active | Session store |
| csurf | 1.11.0 | Runtime | ✅ Active | CSRF protection |
| connect-flash | 0.1.1 | Runtime | ✅ Active | Flash messages |
| ejs | 6.0.1 | Runtime | ✅ Active | Template engine |
| body-parser | 1.18.3 | Runtime | ✅ Active | Body parsing |
| dotenv | 17.4.2 | Runtime | ✅ Active | Env variables |
| mongodb | 7.5.0 | Runtime | ⚠️ Indirect | Used by Mongoose |
| mysql2 | 3.23.1 | Runtime | ❌ Unused | SQL alternative |
| sequelize | 6.37.8 | Runtime | ❌ Unused | ORM alternative |
| pug | 3.0.4 | Runtime | ❌ Unused | Template alternative |
| express-handlebars | 9.0.1 | Runtime | ❌ Unused | Template alternative |
| nodemon | 3.1.14 | Dev | ✅ Active | Auto-restart dev server |

**Total Dependencies:** 16 (11 active, 4 unused alternatives, 1 indirect)
