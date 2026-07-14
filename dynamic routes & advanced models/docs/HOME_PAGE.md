# 🏠 Home Page - How It Works

## What Does This Page Do?

The home page is the first thing you see when you visit the shop! It shows all the products available for sale, just like walking into a toy store and seeing all the toys on display.

## 🎯 File Location

**View File**: `views/shop/index.ejs`

## 🔄 How This Page Works (Step by Step)

### Step 1: You Visit the Website
- You open your browser and go to `http://localhost:3000/`
- Your browser sends a message: "Hey, show me the home page!"

### Step 2: The Route Catches Your Request
**File**: `routes/shop.js`
```javascript
router.get('/', shopController.getIndex);
```
- This line says: "When someone visits `/`, call the `getIndex` function"
- Think of it like a doorbell - when pressed, it calls someone specific

### Step 3: The Controller Gets the Products
**File**: `controllers/shop.js` → Function: `getIndex`

```javascript
exports.getIndex = (req, res, next) => {
  Product.fetchAll(products => {
    res.render('shop/index', {
      prods: products,
      pageTitle: 'Shop',
      path: '/'
    });
  });
};
```

**What happens here?**
1. Controller says to Product model: "Give me ALL the products!"
2. Product model reads from `data/products.json` (the storage file)
3. Product model gives back a list of all products
4. Controller says: "Show the `shop/index` page with these products"

### Step 4: The Model Gets Data
**File**: `models/product.js` → Function: `fetchAll`

```javascript
static fetchAll(cb) {
  getProductsFromFile(cb);
}
```

**Simple explanation:**
- This function opens the `products.json` file
- Reads all the products inside
- Gives them back to whoever asked (the controller)

### Step 5: The View Shows the Page
**File**: `views/shop/index.ejs`

The page is built in sections:

#### Section A: The Head (Top of Page)
```ejs
<%- include('../includes/head.ejs') %>
```
- This adds the HTML `<head>` section
- Includes title, links to CSS styles
- Like putting on a hat!

#### Section B: Navigation Menu
```ejs
<%- include('../includes/navigation.ejs') %>
```
- This adds the menu bar at the top
- Links to other pages (Products, Cart, Orders, Admin)
- Like the signs in a store telling you where things are

#### Section C: Product Display
```ejs
<% if (prods.length > 0) { %>
    <div class="grid">
        <% for (let product of prods) { %>
            <article class="card product-item">
                <h1><%= product.title %></h1>
                <img src="<%= product.imageUrl %>">
                <h2>$<%= product.price %></h2>
                <p><%= product.description %></p>
                <%- include('../includes/add-to-cart.ejs') %>
            </article>
        <% } %>
    </div>
<% } else { %>
    <h1>No Products Found!</h1>
<% } %>
```

**What's happening?**
1. **Check if there are products**: `if (prods.length > 0)`
   - If yes, show them!
   - If no, show "No Products Found!"

2. **Loop through each product**: `for (let product of prods)`
   - For each product, create a card
   - Show: title, image, price, description
   - Add an "Add to Cart" button

3. **Display as a grid**
   - Products appear in rows and columns
   - Like items on store shelves!

#### Section D: The Footer (Bottom of Page)
```ejs
<%- include('../includes/end.ejs') %>
```
- This closes the HTML page properly
- Like closing the door when you leave!

## 🧩 Components Working Together

```
Browser Request
    ↓
app.js (receives request)
    ↓
routes/shop.js (checks: is it "/"?)
    ↓
controllers/shop.js (getIndex function)
    ↓
models/product.js (fetchAll - reads data/products.json)
    ↓
controllers/shop.js (receives products)
    ↓
views/shop/index.ejs (creates HTML with products)
    ↓
Browser (displays beautiful page!)
```

## 📦 What Data Is Used?

The page receives an object with:

```javascript
{
  prods: [
    {
      id: '123',
      title: 'A Book',
      imageUrl: 'https://image.com/book.jpg',
      description: 'A nice book',
      price: 19.99
    },
    // ... more products
  ],
  pageTitle: 'Shop',
  path: '/'
}
```

## 🎨 Styling

The page uses CSS files to look nice:
- `public/css/main.css` - General styles (colors, fonts)
- `public/css/product.css` - Product card styles (boxes, layout)

## 🔘 What Can You Do On This Page?

1. **View all products** - See everything in the shop
2. **Click on products** - Each product is clickable (goes to detail page)
3. **Add to cart** - Click the "Add to Cart" button on any product
4. **Navigate** - Use the top menu to go to other pages

## 🌟 Special Features

### Include Files
The page uses "includes" - small reusable pieces:
- `head.ejs` - Page header HTML
- `navigation.ejs` - Menu bar
- `add-to-cart.ejs` - Add to cart button
- `end.ejs` - Page footer HTML

**Why?** So we don't have to write the same code on every page!

### Dynamic Content
The `<%= %>` tags mean "put data here":
- `<%= product.title %>` - Shows the product name
- `<%= product.price %>` - Shows the price
- `<%= product.imageUrl %>` - Shows the image link

## 🎓 Summary for a 5-Year-Old

Imagine you walk into a candy store:

1. **You open the door** (visit the website)
2. **The shopkeeper greets you** (the route catches your visit)
3. **The shopkeeper gets all the candy jars** (controller asks for products)
4. **The storage room gives candy jars** (model reads from file)
5. **The shopkeeper arranges them nicely on shelves** (view creates page)
6. **You see all the yummy candies!** (browser shows the page)
7. **You can pick which ones you want!** (add to cart)

That's exactly how this home page works! 🍬🏪
