# 🛒 Shopping Cart Page - How It Works

## What Does This Page Do?

This page shows all the items you want to buy! It's like your shopping basket where you collect things before going to checkout.

Think of it like your Halloween candy bag - you can see what you've collected, and you can take things out if you change your mind!

## 🎯 File Location

**View File**: `views/shop/cart.ejs`

## 🔄 How This Page Works (Step by Step)

### Step 1: You Click "Cart" in the Menu
- You click the "Cart" link in the navigation bar
- Your browser visits: `http://localhost:3000/cart`

### Step 2: The Route Catches Your Request
**File**: `routes/shop.js`
```javascript
router.get('/cart', shopController.getCart);
```

**What this means:**
- When someone visits `/cart`, run the `getCart` function
- Like asking to see what's in your shopping basket

### Step 3: The Controller Gets Cart Items
**File**: `controllers/shop.js` → Function: `getCart`

```javascript
exports.getCart = (req, res, next) => {
  Cart.getCart(cart => {
    Product.fetchAll(products => {
      const cartProducts = [];
      for (product of products) {
        const cartProductData = cart.products.find(
          prod => prod.id === product.id
        );
        if (cartProductData) {
          cartProducts.push({ 
            productData: product, 
            qty: cartProductData.qty 
          });
        }
      }
      res.render('shop/cart', {
        path: '/cart',
        pageTitle: 'Your Cart',
        products: cartProducts
      });
    });
  });
};
```

**This is complex - let's break it down!**

1. **Get the cart data**: `Cart.getCart(...)`
   - Reads `data/cart.json`
   - Gets list of product IDs and quantities
   - Example: `[{id: "abc", qty: 2}, {id: "xyz", qty: 1}]`

2. **Get all products**: `Product.fetchAll(...)`
   - Reads `data/products.json`
   - Gets full info about ALL products

3. **Match them together**: The `for` loop
   - For each product, check if it's in the cart
   - If yes, combine the info:
     - Product details (name, price, image)
     - Quantity (how many you want)

4. **Send to view**: `res.render(...)`
   - Show the cart page with the combined data

**Why so complicated?**
- Cart file only stores: product ID + quantity
- Product file stores: all the product details
- We need BOTH to show a nice cart page!

### Step 4: The Cart Model Gets Cart Data
**File**: `models/cart.js` → Function: `getCart`

```javascript
static getCart(cb) {
  fs.readFile(p, (err, fileContent) => {
    const cart = JSON.parse(fileContent);
    if (err) {
      cb(null);
    } else {
      cb(cart);
    }
  });
}
```

**What it does:**
1. Opens `data/cart.json`
2. Reads the cart contents
3. Returns it to the controller

**Cart.json looks like:**
```json
{
  "products": [
    { "id": "abc123", "qty": 2 },
    { "id": "xyz789", "qty": 1 }
  ],
  "totalPrice": 59.97
}
```

### Step 5: The View Shows Your Cart
**File**: `views/shop/cart.ejs`

```ejs
<%- include('../includes/head.ejs') %>
</head>

<body>
    <%- include('../includes/navigation.ejs') %>
    
    <main>
        <% if (products.length > 0) { %>
            <ul>
                <% products.forEach(p => { %>
                    <li>
                        <!-- Product Title -->
                        <p><%= p.productData.title %></p>
                        
                        <!-- Quantity -->
                        <p>Quantity: <%= p.qty %></p>
                        
                        <!-- Delete Button -->
                        <form action="/cart-delete-item" method="post">
                            <input 
                                type="hidden" 
                                value="<%= p.productData.id %>" 
                                name="productId"
                            >
                            <button class="btn" type="submit">
                                Delete
                            </button>
                        </form>
                    </li>
                <% }) %>
            </ul>
        <% } else { %>
            <h1>No Products in Cart!</h1>
        <% } %>
    </main>
    
<%- include('../includes/end.ejs') %>
```

## 🧩 Components Working Together

```
User clicks "Cart"
    ↓
Browser sends request to /cart
    ↓
app.js receives request
    ↓
routes/shop.js → matches "/cart"
    ↓
controllers/shop.js → getCart function
    ↓
models/cart.js → getCart (reads cart.json)
    ↓        ↓
    ↓        Returns: [{id: "abc", qty: 2}]
    ↓
models/product.js → fetchAll (reads products.json)
    ↓
    Returns: [{id: "abc", title: "Book", price: 19.99}]
    ↓
Controller combines them together
    ↓
Result: [{productData: {...}, qty: 2}]
    ↓
views/shop/cart.ejs → creates HTML
    ↓
Browser displays cart page!
```

## 📦 What Each Cart Item Shows

Each item in your cart displays:

1. **Product Title**
   ```ejs
   <p><%= p.productData.title %></p>
   ```
   - What the product is called

2. **Quantity**
   ```ejs
   <p>Quantity: <%= p.qty %></p>
   ```
   - How many you have (1, 2, 3, etc.)

3. **Delete Button**
   ```ejs
   <form action="/cart-delete-item" method="post">
       <input type="hidden" value="<%= p.productData.id %>" name="productId">
       <button type="submit">Delete</button>
   </form>
   ```
   - Removes the item from your cart

## 🔘 Actions You Can Do

### 1. View Cart Items
- See everything you've added
- Check quantities

### 2. Delete Items
When you click "Delete":

**Route**: `routes/shop.js`
```javascript
router.post('/cart-delete-item', shopController.postCartDeleteProduct);
```

**Controller**: `controllers/shop.js`
```javascript
exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId, product => {
    Cart.deleteProduct(prodId, product.price);
    res.redirect('/cart');
  });
};
```

**What happens:**
1. Get product ID from the form
2. Find the product to get its price
3. Tell Cart model to delete it
4. Refresh the cart page

**Cart Model**: `models/cart.js`
```javascript
static deleteProduct(id, productPrice) {
  fs.readFile(p, (err, fileContent) => {
    if (err) return;
    
    const updatedCart = { ...JSON.parse(fileContent) };
    const product = updatedCart.products.find(prod => prod.id === id);
    
    if (!product) return;
    
    const productQty = product.qty;
    updatedCart.products = updatedCart.products.filter(
      prod => prod.id !== id
    );
    updatedCart.totalPrice = updatedCart.totalPrice - productPrice * productQty;
    
    fs.writeFile(p, JSON.stringify(updatedCart), err => {
      console.log(err);
    });
  });
}
```

**Simple explanation:**
1. Read current cart
2. Find the product to delete
3. Remove it from the products array
4. Subtract its total price from cart total
5. Save the updated cart

## ➕ Adding Items to Cart

When you click "Add to Cart" on any page:

**Route**: `routes/shop.js`
```javascript
router.post('/cart', shopController.postCart);
```

**Controller**: `controllers/shop.js`
```javascript
exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId, product => {
    Cart.addProduct(prodId, product.price);
  });
  res.redirect('/cart');
};
```

**Cart Model**: `models/cart.js`
```javascript
static addProduct(id, productPrice) {
  fs.readFile(p, (err, fileContent) => {
    let cart = { products: [], totalPrice: 0 };
    if (!err) {
      cart = JSON.parse(fileContent);
    }
    
    const existingProductIndex = cart.products.findIndex(
      prod => prod.id === id
    );
    const existingProduct = cart.products[existingProductIndex];
    
    let updatedProduct;
    if (existingProduct) {
      // Already in cart - increase quantity
      updatedProduct = { ...existingProduct };
      updatedProduct.qty = updatedProduct.qty + 1;
      cart.products[existingProductIndex] = updatedProduct;
    } else {
      // New item - add to cart
      updatedProduct = { id: id, qty: 1 };
      cart.products = [...cart.products, updatedProduct];
    }
    
    cart.totalPrice = cart.totalPrice + +productPrice;
    
    fs.writeFile(p, JSON.stringify(cart), err => {
      console.log(err);
    });
  });
}
```

**Simple explanation:**
1. Read current cart (or create empty one)
2. Check if product already in cart
3. If yes: increase quantity by 1
4. If no: add new product with quantity 1
5. Add price to total
6. Save updated cart

## 📊 Data Structure

**What controller sends to view:**

```javascript
{
  products: [
    {
      productData: {
        id: 'abc123',
        title: 'JavaScript Book',
        imageUrl: 'https://example.com/book.jpg',
        description: 'Learn JS',
        price: 29.99
      },
      qty: 2
    },
    {
      productData: {
        id: 'xyz789',
        title: 'Laptop',
        imageUrl: 'https://example.com/laptop.jpg',
        description: 'Powerful laptop',
        price: 999.99
      },
      qty: 1
    }
  ],
  pageTitle: 'Your Cart',
  path: '/cart'
}
```

## 🎨 Page Layout

```
╔══════════════════════════════════════╗
║           Your Cart                  ║
╠══════════════════════════════════════╣
║                                      ║
║  • JavaScript Book                   ║
║    Quantity: 2                       ║
║    [Delete]                          ║
║                                      ║
║  • Laptop                            ║
║    Quantity: 1                       ║
║    [Delete]                          ║
║                                      ║
╚══════════════════════════════════════╝
```

## 🎓 Summary for a 5-Year-Old

Imagine you're shopping with a shopping cart:

### **Looking at Your Cart:**
1. **You want to see** what's in your cart (click Cart link)
2. **The store helper** checks your cart (controller)
3. **They look at two things**:
   - Your cart notes: "2 toy cars, 1 doll" (cart.json)
   - The store catalog: "Toy car is $5, Doll is $10" (products.json)
4. **They match them together**: 
   - "You have 2 toy cars ($5 each)"
   - "You have 1 doll ($10)"
5. **They show you** everything nicely (view displays)

### **Adding to Cart:**
1. **You see a toy** you like (on product page)
2. **You click** "Add to Cart" (submit form)
3. **The helper** writes it down in your cart notes
4. **If you already have one**, they add +1 to the count
5. **If it's new**, they write it down fresh
6. **They update** the total price

### **Removing from Cart:**
1. **You changed your mind** about a toy (click Delete)
2. **The helper** crosses it off your cart notes
3. **They subtract** its price from the total
4. **They show you** the updated cart

That's exactly how the Shopping Cart works! 🛒✨

## 🔗 Related Pages

- **Product Pages** - Where you add items to cart
- **Checkout Page** - Where you'd go to pay (not fully implemented yet)
- **Orders Page** - Where you see past orders
