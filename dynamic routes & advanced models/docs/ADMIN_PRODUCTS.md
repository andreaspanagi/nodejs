# 🔧 Admin - Products List Page - How It Works

## What Does This Page Do?

This is the ADMIN view where the shop owner can see ALL products and manage them with two special powers:
- **Edit** any product (change details)
- **Delete** any product (remove from shop)

Think of it like the store manager's office where they can see their entire inventory and make changes!

## 🎯 File Location

**View File**: `views/admin/products.ejs`

## 🔄 How This Page Works (Step by Step)

### Step 1: You Visit Admin Products Page
- You click "Admin Products" in the navigation menu
- Your browser visits: `http://localhost:3000/admin/products`

### Step 2: The Route Catches Your Request
**File**: `routes/admin.js`
```javascript
router.get('/products', adminController.getProducts);
```

**What this means:**
- When someone visits `/admin/products`, run the `getProducts` function
- The `/admin` prefix comes from `app.js` where we mount admin routes

**In app.js:**
```javascript
app.use('/admin', adminRoutes);
```
- This adds `/admin` before all admin routes
- So `router.get('/products')` becomes `/admin/products`

### Step 3: The Controller Gets All Products
**File**: `controllers/admin.js` → Function: `getProducts`

```javascript
exports.getProducts = (req, res, next) => {
  Product.fetchAll(products => {
    res.render('admin/products', {
      prods: products,
      pageTitle: 'Admin Products',
      path: '/admin/products'
    });
  });
};
```

**What happens:**
1. **Ask Product model**: "Give me ALL products!"
2. **Model reads**: `data/products.json`
3. **Controller renders**: The admin/products view
4. **Sends product list**: So view can display them

### Step 4: The Model Gets Products
**File**: `models/product.js` → Function: `fetchAll`

```javascript
static fetchAll(cb) {
  getProductsFromFile(cb);
}
```

Same as customer pages - reads all products from the JSON file!

### Step 5: The View Shows Product List
**File**: `views/admin/products.ejs`

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
                        <header class="card__header">
                            <h1 class="product__title">
                                <%= product.title %>
                            </h1>
                        </header>
                        
                        <!-- Product Image -->
                        <div class="card__image">
                            <img 
                                src="<%= product.imageUrl %>" 
                                alt="<%= product.title %>"
                            >
                        </div>
                        
                        <!-- Product Details -->
                        <div class="card__content">
                            <h2 class="product__price">$<%= product.price %></h2>
                            <p class="product__description">
                                <%= product.description %>
                            </p>
                        </div>
                        
                        <!-- Admin Actions -->
                        <div class="card__actions">
                            <!-- Edit Button -->
                            <a 
                                href="/admin/edit-product/<%= product.id %>?edit=true" 
                                class="btn"
                            >
                                Edit
                            </a>
                            
                            <!-- Delete Button -->
                            <form action="/admin/delete-product" method="POST">
                                <input 
                                    type="hidden" 
                                    value="<%= product.id %>" 
                                    name="productId"
                                >
                                <button class="btn" type="submit">Delete</button>
                            </form>
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
Admin clicks "Admin Products"
    ↓
Browser sends request to /admin/products
    ↓
app.js receives request
    ↓
Checks routes with /admin prefix
    ↓
routes/admin.js → matches "/products"
    ↓
controllers/admin.js → getProducts function
    ↓
models/product.js → fetchAll (reads products.json)
    ↓
Returns all products to controller
    ↓
views/admin/products.ejs → creates HTML with Edit/Delete buttons
    ↓
Browser displays admin product list!
```

## 🎭 Difference from Customer Product List

| Customer View | Admin View |
|---------------|------------|
| Shows "Details" button | Shows "Edit" button |
| Shows "Add to Cart" button | Shows "Delete" button |
| URL: `/products` | URL: `/admin/products` |
| Read-only | Can modify products |
| For shopping | For management |

## 🔘 Admin Actions

### 1. Edit Product (Link)

```ejs
<a href="/admin/edit-product/<%= product.id %>?edit=true" class="btn">
    Edit
</a>
```

**What it does:**
- Takes you to edit form
- URL includes product ID and `?edit=true`
- Example: `/admin/edit-product/abc123?edit=true`
- See [ADMIN_EDIT_PRODUCT.md](./ADMIN_EDIT_PRODUCT.md) for details

**Flow:**
```
Click "Edit"
    ↓
Navigate to /admin/edit-product/abc123?edit=true
    ↓
Load edit form pre-filled with product data
    ↓
Make changes
    ↓
Submit form
    ↓
Product updated in products.json
    ↓
Redirect back to /admin/products
```

### 2. Delete Product (Form)

```ejs
<form action="/admin/delete-product" method="POST">
    <input 
        type="hidden" 
        value="<%= product.id %>" 
        name="productId"
    >
    <button class="btn" type="submit">Delete</button>
</form>
```

**Why a form and not a link?**
- Deleting is a DESTRUCTIVE action
- Must use POST request (not GET)
- GET = view things (safe)
- POST = change things (careful!)

**What happens when you click Delete:**

#### Step 1: Form Submits
Sends POST request to `/admin/delete-product` with product ID

#### Step 2: Route Catches It
**File**: `routes/admin.js`
```javascript
router.post('/delete-product', adminController.postDeleteProduct);
```

#### Step 3: Controller Deletes Product
**File**: `controllers/admin.js` → Function: `postDeleteProduct`

```javascript
exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.deleteById(prodId);
  res.redirect('/admin/products');
};
```

**Simple explanation:**
1. Get product ID from form
2. Tell Product model to delete it
3. Redirect back to admin products page

#### Step 4: Model Deletes from File
**File**: `models/product.js` → Function: `deleteById`

```javascript
static deleteById(id) {
  getProductsFromFile(products => {
    const product = products.find(prod => prod.id === id);
    const updatedProducts = products.filter(prod => prod.id !== id);
    
    fs.writeFile(p, JSON.stringify(updatedProducts), err => {
      if (!err) {
        Cart.deleteProduct(id, product.price);
      }
    });
  });
}
```

**What it does:**
1. **Read all products** from products.json
2. **Find the product** we want to delete (to get its price)
3. **Filter it out** - create new array without this product
4. **Save updated list** back to products.json
5. **Also remove from cart** - if anyone had it in cart, delete it!

**Important:** It cleans up the cart too!

## 🗑️ Delete Flow Diagram

```
Click "Delete" button
    ↓
POST /admin/delete-product (with product ID)
    ↓
adminController.postDeleteProduct
    ↓
Extract product ID
    ↓
Product.deleteById(id)
    ↓
Read products.json
    ↓
Find product (get price for cart cleanup)
    ↓
Filter out product from array
    ↓
Save updated array to products.json
    ↓
Cart.deleteProduct(id, price) - clean up carts
    ↓
Redirect to /admin/products
    ↓
Page reloads - product is gone!
```

## 📦 What Each Product Card Shows

Each product in the admin list shows:

1. **Product Title**
   ```ejs
   <h1><%= product.title %></h1>
   ```

2. **Product Image**
   ```ejs
   <img src="<%= product.imageUrl %>" alt="<%= product.title %>">
   ```

3. **Product Price**
   ```ejs
   <h2>$<%= product.price %></h2>
   ```

4. **Product Description**
   ```ejs
   <p><%= product.description %></p>
   ```

5. **Edit Button** (link)
   - Opens edit form for this product

6. **Delete Button** (form)
   - Permanently removes this product

## 🎨 Page Layout

```
╔═══════════════════════════════════════════════════╗
║            Admin Products                         ║
╠═══════════════════════════════════════════════════╣
║                                                   ║
║  ┌────────────┐  ┌────────────┐  ┌────────────┐  ║
║  │  Product 1 │  │  Product 2 │  │  Product 3 │  ║
║  │  [Image]   │  │  [Image]   │  │  [Image]   │  ║
║  │  Title     │  │  Title     │  │  Title     │  ║
║  │  $19.99    │  │  $29.99    │  │  $39.99    │  ║
║  │            │  │            │  │            │  ║
║  │ [Edit]     │  │ [Edit]     │  │ [Edit]     │  ║
║  │ [Delete]   │  │ [Delete]   │  │ [Delete]   │  ║
║  └────────────┘  └────────────┘  └────────────┘  ║
║                                                   ║
╚═══════════════════════════════════════════════════╝
```

## ⚠️ Important Details

### Cart Cleanup on Delete

When a product is deleted, the system is smart:

```javascript
static deleteById(id) {
  // ... delete from products.json ...
  if (!err) {
    Cart.deleteProduct(id, product.price);  // Clean up carts!
  }
}
```

**Why is this important?**
- Imagine: Customer added "Book" to cart
- Admin deletes "Book" from shop
- Customer's cart would have a product that doesn't exist anymore!
- So we automatically remove it from all carts

### No Confirmation Dialog

**Notice:** There's no "Are you sure?" popup!

To add one, you could use JavaScript:
```html
<button 
    class="btn" 
    type="submit" 
    onclick="return confirm('Are you sure you want to delete this product?')"
>
    Delete
</button>
```

But this project doesn't have it yet.

### Why Hidden Input for Delete?

```ejs
<input type="hidden" value="<%= product.id %>" name="productId">
```

**Why hidden?**
- We need to send the product ID
- But users don't need to see it
- It's automatically sent when form submits
- Like a secret note attached to the delete request!

## 📊 Data Flow Example

**What controller sends to view:**

```javascript
{
  prods: [
    {
      id: 'abc123',
      title: 'JavaScript Book',
      imageUrl: 'https://example.com/book.jpg',
      description: 'Learn JavaScript',
      price: 29.99
    },
    {
      id: 'xyz789',
      title: 'Laptop',
      imageUrl: 'https://example.com/laptop.jpg',
      description: 'Powerful laptop',
      price: 999.99
    }
  ],
  pageTitle: 'Admin Products',
  path: '/admin/products'
}
```

## 🎓 Summary for a 5-Year-Old

Imagine you run a toy store and have a special manager's notebook:

### **Viewing Your Inventory:**
1. **You open your manager notebook** (visit /admin/products)
2. **You see all toys** you have in stock
3. **Each toy has two special stickers**:
   - Green sticker: "Edit me!" (change details)
   - Red sticker: "Remove me!" (take out of store)

### **Editing a Toy:**
1. **You press the green sticker** (click Edit)
2. **You get the toy's card** with all info
3. **You change what you want** (price, description)
4. **You put it back** (click Update)
5. **Toy is updated!** Same toy, new info

### **Deleting a Toy:**
1. **You press the red sticker** (click Delete)
2. **The toy disappears** from your store
3. **It's also removed** from everyone's shopping baskets
4. **Customers can't buy** it anymore

### **The Magic Cleanup:**
When you delete a toy:
- It disappears from the shelf (products.json)
- It disappears from shopping baskets (cart.json)
- Everything stays clean and organized!

That's exactly how the Admin Products page works! 🔧🏪

## 🔗 Related Pages

- **Add Product** - Create new products from scratch
- **Edit Product** - Modify existing product details
- **Customer Product List** - What customers see (read-only)
- **Cart Page** - Where deleted products are also removed from
