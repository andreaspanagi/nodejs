# ✏️ Admin - Add/Edit Product Page - How It Works

## What Does This Page Do?

This is the ADMIN page where the shop owner can:
- **Add NEW products** to the shop
- **Edit EXISTING products** to change details

Think of it like being the store manager who decides what toys go on the shelves and can change the price tags!

## 🎯 File Location

**View File**: `views/admin/edit-product.ejs`

## 🔄 Two Different Modes

This ONE page works in TWO ways:

### Mode 1: Add New Product
- URL: `/admin/add-product`
- Empty form
- Button says "Add Product"

### Mode 2: Edit Existing Product  
- URL: `/admin/edit-product/abc123`
- Form filled with current product info
- Button says "Update Product"

It's like a magic form that changes based on what you need!

## 🔄 How ADD Mode Works (Step by Step)

### Step 1: You Want to Add a Product
- You click "Add Product" in the admin menu
- Your browser visits: `http://localhost:3000/admin/add-product`

### Step 2: The Route Catches Your Request
**File**: `routes/admin.js`
```javascript
router.get('/add-product', adminController.getAddProduct);
```

### Step 3: The Controller Shows Empty Form
**File**: `controllers/admin.js` → Function: `getAddProduct`

```javascript
exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false  // This is the KEY - says "add mode"
  });
};
```

**Important:**
- `editing: false` tells the view this is ADD mode
- No product data sent (form will be empty)

### Step 4: You Fill Out the Form
The form has fields for:
- Title (product name)
- Image URL (link to product picture)
- Price (how much it costs)
- Description (what the product is)

### Step 5: You Click "Add Product"
The form submits to: `/admin/add-product` (POST request)

**Route**: `routes/admin.js`
```javascript
router.post('/add-product', adminController.postAddProduct);
```

### Step 6: The Controller Saves the New Product
**File**: `controllers/admin.js` → Function: `postAddProduct`

```javascript
exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  
  const product = new Product(null, title, imageUrl, description, price);
  product.save();
  
  res.redirect('/');
};
```

**What happens:**
1. **Get form data**: Extract all the values you typed
2. **Create new Product**: `new Product(null, ...)` 
   - `null` means "no ID yet - this is new!"
3. **Save it**: `product.save()` adds it to products.json
4. **Redirect**: Takes you back to home page

### Step 7: The Model Saves to File
**File**: `models/product.js` → Function: `save`

```javascript
save() {
  getProductsFromFile(products => {
    if (this.id) {
      // EDIT mode (has ID)
      const existingProductIndex = products.findIndex(
        prod => prod.id === this.id
      );
      const updatedProducts = [...products];
      updatedProducts[existingProductIndex] = this;
      fs.writeFile(p, JSON.stringify(updatedProducts), err => {
        console.log(err);
      });
    } else {
      // ADD mode (no ID)
      this.id = Math.random().toString();  // Create new ID
      products.push(this);  // Add to array
      fs.writeFile(p, JSON.stringify(products), err => {
        console.log(err);
      });
    }
  });
}
```

**Simple explanation:**
1. Read current products
2. If no ID: Create random ID and add to list
3. If has ID: Find and update existing product
4. Save everything back to file

## 🔄 How EDIT Mode Works (Step by Step)

### Step 1: You Want to Edit a Product
- You're on the Admin Products page
- You click "Edit" button on a product
- Your browser visits: `http://localhost:3000/admin/edit-product/abc123?edit=true`

### Step 2: The Route Catches Your Request
**File**: `routes/admin.js`
```javascript
router.get('/edit-product/:productId', adminController.getEditProduct);
```

### Step 3: The Controller Gets Product & Shows Form
**File**: `controllers/admin.js` → Function: `getEditProduct`

```javascript
exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;  // Get ?edit=true
  if (!editMode) {
    return res.redirect('/');
  }
  
  const prodId = req.params.productId;  // Get ID from URL
  Product.findById(prodId, product => {
    if (!product) {
      return res.redirect('/');
    }
    
    res.render('admin/edit-product', {
      pageTitle: 'Edit Product',
      path: '/admin/edit-product',
      editing: editMode,  // true = EDIT mode
      product: product    // Send product data to fill form
    });
  });
};
```

**What happens:**
1. **Check edit mode**: Make sure `?edit=true` is in URL
2. **Get product ID**: Extract from URL
3. **Find the product**: Ask model to get it from file
4. **Show form**: With `editing: true` and product data

### Step 4: Form is Pre-filled
The form now shows the current product information in all fields!

### Step 5: You Change Some Details
Maybe you change the price or fix a typo in description.

### Step 6: You Click "Update Product"
The form submits to: `/admin/edit-product` (POST request)

**Route**: `routes/admin.js`
```javascript
router.post('/edit-product', adminController.postEditProduct);
```

### Step 7: The Controller Updates the Product
**File**: `controllers/admin.js` → Function: `postEditProduct`

```javascript
exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;  // Hidden field in form
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedImageUrl = req.body.imageUrl;
  const updatedDesc = req.body.description;
  
  const updatedProduct = new Product(
    prodId,  // Keep same ID
    updatedTitle,
    updatedImageUrl,
    updatedDesc,
    updatedPrice
  );
  
  updatedProduct.save();
  res.redirect('/admin/products');
};
```

**What happens:**
1. **Get all form data**: Including hidden productId field
2. **Create Product with ID**: Same ID but new values
3. **Save it**: Updates existing product in file
4. **Redirect**: Go to admin products list

## 🎨 The Form (View)

**File**: `views/admin/edit-product.ejs`

```ejs
<%- include('../includes/head.ejs') %>
<link rel="stylesheet" href="/css/forms.css">

<body>
   <%- include('../includes/navigation.ejs') %>

    <main>
        <form 
            class="product-form" 
            action="/admin/<% if (editing) { %>edit-product<% } else { %>add-product<% } %>" 
            method="POST"
        >
            <!-- Title Field -->
            <div class="form-control">
                <label for="title">Title</label>
                <input 
                    type="text" 
                    name="title" 
                    id="title" 
                    value="<% if (editing) { %><%= product.title %><% } %>"
                >
            </div>
            
            <!-- Image URL Field -->
            <div class="form-control">
                <label for="imageUrl">Image URL</label>
                <input 
                    type="text" 
                    name="imageUrl" 
                    id="imageUrl" 
                    value="<% if (editing) { %><%= product.imageUrl %><% } %>"
                >
            </div>
            
            <!-- Price Field -->
            <div class="form-control">
                <label for="price">Price</label>
                <input 
                    type="number" 
                    name="price" 
                    id="price" 
                    step="0.01" 
                    value="<% if (editing) { %><%= product.price %><% } %>"
                >
            </div>
            
            <!-- Description Field -->
            <div class="form-control">
                <label for="description">Description</label>
                <textarea 
                    name="description" 
                    id="description" 
                    rows="5"
                ><% if (editing) { %><%= product.description %><% } %></textarea>
            </div>
            
            <!-- Hidden ID Field (only in EDIT mode) -->
            <% if (editing) { %>
                <input type="hidden" value="<%= product.id %>" name="productId">
            <% } %>

            <!-- Submit Button -->
            <button class="btn" type="submit">
                <% if (editing) { %>Update Product<% } else { %>Add Product<% } %>
            </button>
        </form>
    </main>
    
<%- include('../includes/end.ejs') %>
```

## 🎭 Key Differences Between Modes

| Feature | Add Mode | Edit Mode |
|---------|----------|-----------|
| **URL** | `/admin/add-product` | `/admin/edit-product/abc123?edit=true` |
| **Form Action** | `/admin/add-product` | `/admin/edit-product` |
| **Form Values** | Empty | Pre-filled with product data |
| **Hidden ID Field** | No | Yes - sends product ID |
| **Button Text** | "Add Product" | "Update Product" |
| **editing variable** | `false` | `true` |
| **product variable** | Not sent | Sent with product data |

## 🧩 How the Form Adapts

The SAME form file shows different things:

### Form Action
```ejs
<form action="/admin/<% if (editing) { %>edit-product<% } else { %>add-product<% } %>" method="POST">
```
- ADD mode: action="/admin/add-product"
- EDIT mode: action="/admin/edit-product"

### Form Values
```ejs
<input 
    type="text" 
    name="title" 
    value="<% if (editing) { %><%= product.title %><% } %>"
>
```
- ADD mode: value="" (empty)
- EDIT mode: value="Current Product Title"

### Hidden ID Field
```ejs
<% if (editing) { %>
    <input type="hidden" value="<%= product.id %>" name="productId">
<% } %>
```
- ADD mode: Not included
- EDIT mode: Sends the product ID

### Button Text
```ejs
<button type="submit">
    <% if (editing) { %>Update Product<% } else { %>Add Product<% } %>
</button>
```
- ADD mode: "Add Product"
- EDIT mode: "Update Product"

## 📦 Form Fields Explained

1. **Title** - Product name
   - Text input
   - Required for knowing what it is

2. **Image URL** - Link to product image
   - Text input
   - Should be a valid URL
   - Example: `https://example.com/product.jpg`

3. **Price** - How much it costs
   - Number input
   - `step="0.01"` allows decimals (like $19.99)

4. **Description** - Details about product
   - Textarea (multiline)
   - Explain what the product does

5. **Product ID** (hidden in EDIT mode)
   - Not visible to user
   - Tells server which product to update

## 🔄 Complete Flow Diagrams

### ADD Flow:
```
Click "Add Product"
    ↓
GET /admin/add-product
    ↓
adminController.getAddProduct
    ↓
Render form with editing=false
    ↓
User fills form
    ↓
Click "Add Product" button
    ↓
POST /admin/add-product
    ↓
adminController.postAddProduct
    ↓
Create new Product (id=null)
    ↓
product.save() → Generate ID, add to array
    ↓
Save to products.json
    ↓
Redirect to home page
```

### EDIT Flow:
```
Click "Edit" on product
    ↓
GET /admin/edit-product/abc123?edit=true
    ↓
adminController.getEditProduct
    ↓
Extract product ID from URL
    ↓
Product.findById(abc123)
    ↓
Render form with editing=true & product data
    ↓
User changes some fields
    ↓
Click "Update Product" button
    ↓
POST /admin/edit-product
    ↓
adminController.postEditProduct
    ↓
Create Product with existing ID
    ↓
product.save() → Update existing product
    ↓
Save to products.json
    ↓
Redirect to /admin/products
```

## 🎓 Summary for a 5-Year-Old

### Adding a Toy to the Store:

1. **You're the store owner** (admin)
2. **You want to sell a new toy** (add product)
3. **You fill out a card** with:
   - Toy name
   - Picture of toy
   - Price
   - What the toy does
4. **You give it to your helper** (click Add Product)
5. **Helper puts it on the shelf** (saves to products.json)
6. **Helper gives the toy a tag number** (generates ID)
7. **Now customers can buy it!** (appears on shop)

### Changing a Toy's Information:

1. **You notice** the price tag is wrong (need to edit)
2. **You pick up that toy's card** (click Edit)
3. **The card already has** all the info filled in
4. **You change** what needs fixing (maybe lower the price)
5. **You give it back to your helper** (click Update Product)
6. **Helper updates** the toy on the shelf (updates products.json)
7. **Same toy, same tag number**, just different info!

That's exactly how the Add/Edit Product page works! ✏️🏪

## 🔗 Related Pages

- **Admin Products List** - Shows all products with Edit/Delete buttons
- **Product Detail** - What customers see when browsing
- **Product List** - Customer view of all products
