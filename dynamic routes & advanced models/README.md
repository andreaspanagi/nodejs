# 🏪 Online Shop Project - Main Overview

## What Is This Project?

This is an online shop website where people can:
- Look at products for sale
- Add products to their shopping cart
- Admins can add, edit, and delete products

Think of it like a toy store where you can browse toys, put them in your basket, and the store owner can add new toys to the shelves!

## 🎯 How Does Everything Work Together?

Imagine the project like a restaurant:

### 1. **App.js (The Restaurant Manager)**
- This is the boss of everything!
- It starts the web server (like opening the restaurant doors)
- It tells everyone where to find things
- It connects all the different parts together

### 2. **Routes (The Menu)**
- `routes/shop.js` - Customer menu (browse products, cart, orders)
- `routes/admin.js` - Kitchen menu (add/edit/delete products)
- These files list what pages customers and admins can visit

### 3. **Controllers (The Waiters)**
- `controllers/shop.js` - Takes customer orders (handles shopping requests)
- `controllers/admin.js` - Takes kitchen requests (handles product management)
- They listen to what people want and get it for them

### 4. **Models (The Recipe Book)**
- `models/product.js` - Knows everything about products (like recipe cards)
- `models/cart.js` - Knows everything about shopping carts (like order slips)
- They store and manage data

### 5. **Views (The Dining Room Decoration)**
- `views/shop/` - What customers see (product displays, cart)
- `views/admin/` - What admin sees (add/edit product forms)
- These are the actual web pages people look at

### 6. **Data (The Storage Room)**
- `data/products.json` - All product information stored here
- `data/cart.json` - Shopping cart information stored here

### 7. **Public (The Restaurant Furniture & Decorations)**
- `public/css/` - Makes pages look pretty (colors, spacing)
- `public/js/` - Makes pages interactive

## 🚀 How to Start the Project

1. **Install everything** (like stocking the restaurant):
   ```bash
   npm install
   ```

2. **Start the server** (like opening the restaurant):
   ```bash
   npm start
   ```

3. **Visit the website**:
   - Open your web browser
   - Go to: `http://localhost:3000`

## 📁 Project Structure

```
section-9/
├── app.js                    # Main application (the boss)
├── routes/                   # URL paths (the menu)
│   ├── shop.js              # Customer routes
│   └── admin.js             # Admin routes
├── controllers/             # Request handlers (the waiters)
│   ├── shop.js             # Customer actions
│   └── admin.js            # Admin actions
├── models/                  # Data management (recipe book)
│   ├── product.js          # Product data
│   └── cart.js             # Cart data
├── views/                   # Web pages (what you see)
│   ├── shop/               # Customer pages
│   └── admin/              # Admin pages
├── data/                    # Stored information (storage room)
│   ├── products.json       # All products
│   └── cart.json           # Shopping cart
└── public/                  # Styling & scripts (decorations)
    ├── css/                # Make it pretty
    └── js/                 # Make it interactive
```

## 🎨 Technologies Used

- **Node.js** - The kitchen (runs JavaScript on the server)
- **Express** - The restaurant framework (makes building web apps easy)
- **EJS** - Template engine (creates HTML pages with dynamic data)
- **Body-parser** - Reads form data (understands what customers submit)

## 📚 Detailed Documentation

### 🛍️ Customer Pages
- [Home Page (Index)](./docs/HOME_PAGE.md) - Main shop page showing all products
- [Product List Page](./docs/PRODUCT_LIST.md) - Browse all products with details
- [Product Detail Page](./docs/PRODUCT_DETAIL.md) - View one specific product
- [Shopping Cart Page](./docs/CART_PAGE.md) - Your shopping basket
- [Orders Page](./docs/ORDERS_PAGE.md) - Past orders (not implemented yet)
- [Checkout Page](./docs/CHECKOUT_PAGE.md) - Payment & shipping (not implemented yet)

### 🔧 Admin Pages
- [Admin - Add/Edit Product](./docs/ADMIN_EDIT_PRODUCT.md) - Create or modify products
- [Admin - Product List](./docs/ADMIN_PRODUCTS.md) - Manage all products

### 🧩 Technical Documentation
- [Complete File Guide](./docs/FILE_GUIDE.md) - **START HERE!** Explains every file in the project
- [Reusable Components](./docs/COMPONENTS.md) - How includes work (head, navigation, footer)
- [Data Models](./docs/DATA_MODELS.md) - How Product and Cart models work
- [404 Error Page](./docs/404_PAGE.md) - What happens when page not found

## 🔄 Complete Journey Example

**When someone buys a product:**

1. Customer visits website → Browser asks `app.js`
2. `app.js` checks `routes/shop.js` → "Which page?"
3. Route tells `controllers/shop.js` → "Get the homepage"
4. Controller asks `models/product.js` → "Give me all products"
5. Model reads `data/products.json` → Gets product list
6. Controller sends data to `views/shop/index.ejs` → Creates HTML
7. Customer sees beautiful product page! 🎉

## ❓ Simple Explanations

- **Server**: A computer program that listens for requests and sends back web pages
- **Route**: A path/URL like `/products` or `/cart`
- **Controller**: Functions that handle what happens when you visit a route
- **Model**: Code that manages data (like products or cart)
- **View**: The actual HTML page you see in your browser
- **JSON**: A way to store data in text format (like a shopping list)

---

**Need help with a specific page?** Check the `docs/` folder for detailed explanations!
