# 📦 Product List Page - How It Works

## What Does This Page Do?

This page shows ALL the products in the shop in a neat list. It's very similar to the home page, but it's specifically for browsing the product catalog.

Think of it like going to a library and looking at all the books on the shelves!

## 🎯 File Location

**View File**: `views/shop/product-list.ejs`

## 🔄 How This Page Works (Step by Step)

### Step 1: You Click "Products" in the Menu
- You click the "Products" link in the navigation bar
- Your browser visits: `http://localhost:3000/products`

### Step 2: The Route Catches Your Request
**File**: `routes/shop.js`
```javascript
router.get('/products', shopController.getProducts);
```

**What this means:**
- When someone visits `/products`, run the `getProducts` function
- Like a sign saying "For product list, talk to the products department"

### Step 3: The Controller Gets Products
**File**: `controllers/shop.js` → Function: `getProducts`

```javascript
exports.getProducts = (req, res, next) => {
  Product.fetchAll(products => {
    res.render('shop/product-list', {
      prods: products,
      pageTitle: 'All Products',
      path: '/products'
    });
  });
};
```

**Simple breakdown:**
1. Controller asks Product model: "Give me all products!"
2. Product model reads `data/products.json`
3. Product model returns the list
4. Controller says: "Show the product-list page with these products"

### Step 4: The Model Fetches Data
**File**: `models/product.js` → Function: `fetchAll`

Same as home page - it reads from the `products.json` file!

### Step 5: The View Creates the Page
**File**: `views/shop/product-list.ejs`

The page structure:

```ejs
<%- include('../includes/head.ejs') %>
<link rel="stylesheet" href="/css/product.css">

<body>
    <%- include('../includes/navigation.ejs') %>
    
    <main>
        <% if (prods.length > 0) { %>
            <div class="grid">
                <% for (let product of prods) { %>
                    <article class="card product-item">
                        <!-- Product Title -->
                        <h1><%= product.title %></h1>
                        
                        <!-- Product Image -->
                        <img src="<%= product.imageUrl %>">
                        
                        <!-- Product Price & Description -->
                        <h2>$<%= product.price %></h2>
                        <p><%= product.description %></p>
                        
                        <!-- Action Buttons -->
                        <div class="card__actions">
                            <a href="/products/<%= product.id %>" class="btn">
                                Details
                            </a>
                            <%- include('../includes/add-to-cart.ejs') %>
                        </div>
                    </article>
                <% } %>
            </div>
        <% } else { %>
            <h1>No Products Found!</h1>
        <% } %>
    </main>
    
<%- include('../includes/end.ejs') %>
```

## 🧩 Components Working Together

```
User clicks "Products"
    ↓
Browser sends request to /products
    ↓
app.js receives request
    ↓
routes/shop.js → matches "/products"
    ↓
controllers/shop.js → getProducts function
    ↓
models/product.js → fetchAll (reads data/products.json)
    ↓
Returns product array to controller
    ↓
views/shop/product-list.ejs → creates HTML
    ↓
Browser displays the page!
```

## 🎭 What's Different from Home Page?

Both pages look similar, but there are small differences:

| Feature | Home Page | Product List Page |
|---------|-----------|------------------|
| **URL** | `/` | `/products` |
| **Page Title** | "Shop" | "All Products" |
| **Active Menu** | "Shop" highlighted | "Products" highlighted |
| **Buttons** | "Add to Cart" only | "Details" + "Add to Cart" |
| **Purpose** | Welcome page | Browse catalog |

## 📦 What Each Product Card Shows

Each product displays:

1. **Title** - Name of the product
   ```ejs
   <h1><%= product.title %></h1>
   ```

2. **Image** - Picture of the product
   ```ejs
   <img src="<%= product.imageUrl %>" alt="<%= product.title %>">
   ```

3. **Price** - How much it costs
   ```ejs
   <h2>$<%= product.price %></h2>
   ```

4. **Description** - What the product is about
   ```ejs
   <p><%= product.description %></p>
   ```

5. **Details Button** - Link to see more details
   ```ejs
   <a href="/products/<%= product.id %>" class="btn">Details</a>
   ```

6. **Add to Cart Button** - Add item to shopping cart
   ```ejs
   <%- include('../includes/add-to-cart.ejs') %>
   ```

## 🔗 The "Details" Button

**Special feature of this page!**

```ejs
<a href="/products/<%= product.id %>" class="btn">Details</a>
```

**What it does:**
- When you click "Details", it takes you to `/products/123` (where 123 is the product ID)
- This shows you a detailed page just about that one product
- Like clicking on a book to read the back cover!

## 🎨 Page Layout

Products are displayed in a **grid layout**:

```
┌──────────┐  ┌──────────┐  ┌──────────┐
│ Product  │  │ Product  │  │ Product  │
│    1     │  │    2     │  │    3     │
└──────────┘  └──────────┘  └──────────┘

┌──────────┐  ┌──────────┐  ┌──────────┐
│ Product  │  │ Product  │  │ Product  │
│    4     │  │    5     │  │    6     │
└──────────┘  └──────────┘  └──────────┘
```

The CSS file `public/css/product.css` makes this grid!

## 🔘 What Can You Do On This Page?

1. **Browse products** - Scroll through all available items
2. **View details** - Click "Details" to see more about a product
3. **Add to cart** - Click "Add to Cart" to add without seeing details
4. **Navigate** - Use top menu to go to other pages

## 📊 Example Data Flow

When the page loads, it receives:

```javascript
{
  prods: [
    {
      id: 'abc123',
      title: 'JavaScript Book',
      imageUrl: 'https://example.com/book.jpg',
      description: 'Learn JavaScript programming',
      price: 29.99
    },
    {
      id: 'def456',
      title: 'Laptop',
      imageUrl: 'https://example.com/laptop.jpg',
      description: 'Powerful laptop for coding',
      price: 999.99
    }
  ],
  pageTitle: 'All Products',
  path: '/products'
}
```

## 🎓 Summary for a 5-Year-Old

Imagine you're at a toy store:

1. **You tell the shopkeeper**: "I want to see ALL the toys!" (click Products)
2. **The shopkeeper goes to the back room** (controller asks model)
3. **They check the inventory list** (model reads products.json)
4. **They bring out every toy box** (model returns products)
5. **They arrange toys on a big table** (view creates grid)
6. **Each toy has a tag** with:
   - Name
   - Picture
   - Price
   - What it does
   - Two buttons: "Tell me more!" and "I want it!"
7. **You can look at everything** and decide what you want!

That's exactly how the Product List page works! 🎁🛍️

## 🔗 Related Pages

- **Product Detail Page** - Click "Details" to see more about one product
- **Cart Page** - Click "Add to Cart" to add items to your basket
- **Home Page** - Very similar, but this is the official catalog view
