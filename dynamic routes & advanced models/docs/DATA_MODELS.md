# 💾 Data Models - How They Work

## What Are Data Models?

Models are like recipe cards that tell the app how to work with data! They handle:
- **Saving** data to files
- **Reading** data from files
- **Updating** existing data
- **Deleting** data

Think of models like a librarian who knows exactly where every book is and how to organize them!

## 📁 Location

**Folder**: `models/`

## 🎯 Available Models

### 1. Product Model (`product.js`)

**File**: `models/product.js`

**What it manages:**
- Product information (title, price, image, description)
- Saved in `data/products.json`

**Class structure:**
```javascript
class Product {
  constructor(id, title, imageUrl, description, price) {
    this.id = id;
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
  }
  
  // Methods:
  save()                    // Save or update product
  static fetchAll(cb)       // Get all products
  static findById(id, cb)   // Find one product by ID
  static deleteById(id)     // Delete a product
}
```

---

### 2. Cart Model (`cart.js`)

**File**: `models/cart.js`

**What it manages:**
- Shopping cart contents
- Product quantities
- Total price
- Saved in `data/cart.json`

**Class structure:**
```javascript
class Cart {
  // Methods:
  static addProduct(id, productPrice)      // Add item to cart
  static deleteProduct(id, productPrice)   // Remove item from cart
  static getCart(cb)                       // Get cart contents
}
```

---

## 📦 Product Model - Detailed Explanation

### Product Constructor

```javascript
constructor(id, title, imageUrl, description, price) {
  this.id = id;
  this.title = title;
  this.imageUrl = imageUrl;
  this.description = description;
  this.price = price;
}
```

**What it does:**
Creates a new product object with all its information.

**Example:**
```javascript
const book = new Product(
  'abc123',           // id
  'JavaScript Book',  // title
  'http://...',       // imageUrl
  'Learn JS',         // description
  29.99              // price
);
```

### save() Method

```javascript
save() {
  getProductsFromFile(products => {
    if (this.id) {
      // UPDATE existing product
      const existingProductIndex = products.findIndex(
        prod => prod.id === this.id
      );
      const updatedProducts = [...products];
      updatedProducts[existingProductIndex] = this;
      fs.writeFile(p, JSON.stringify(updatedProducts), err => {
        console.log(err);
      });
    } else {
      // ADD new product
      this.id = Math.random().toString();
      products.push(this);
      fs.writeFile(p, JSON.stringify(products), err => {
        console.log(err);
      });
    }
  });
}
```

**How it works - ADD mode:**
1. Read existing products from file
2. Check if product has ID - if NO, it's new!
3. Generate random ID: `Math.random().toString()`
4. Add product to array: `products.push(this)`
5. Save entire array back to file

**How it works - UPDATE mode:**
1. Read existing products from file
2. Check if product has ID - if YES, it's an update!
3. Find the product in array by ID
4. Replace old product with new data
5. Save entire array back to file

**Simple explanation:**
- No ID = "I'm new, add me!"
- Has ID = "I exist, update me!"

### fetchAll() Method

```javascript
static fetchAll(cb) {
  getProductsFromFile(cb);
}
```

**How it works:**
1. Calls helper function `getProductsFromFile`
2. That function reads `products.json`
3. Parses JSON to JavaScript array
4. Calls callback with array

**Usage:**
```javascript
Product.fetchAll(products => {
  // products is an array of all products
  console.log(products);
});
```

**Note: `static` means:**
- Call on the Class: `Product.fetchAll()`
- NOT on an instance: ~~`product.fetchAll()`~~

### findById() Method

```javascript
static findById(id, cb) {
  getProductsFromFile(products => {
    const product = products.find(p => p.id === id);
    cb(product);
  });
}
```

**How it works:**
1. Get all products from file
2. Search array for product with matching ID
3. Return that ONE product

**Usage:**
```javascript
Product.findById('abc123', product => {
  // product is the one with id 'abc123'
  console.log(product.title);
});
```

**Like:** Finding one specific book in a library by its catalog number!

### deleteById() Method

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

**How it works:**
1. Read all products
2. Find the product to delete (need price for cart cleanup)
3. Filter out that product: `filter(prod => prod.id !== id)`
   - Keeps all products EXCEPT the one to delete
4. Save filtered array back to file
5. Clean up cart: remove from any carts too!

**Simple explanation:**
- Like erasing a recipe card from your recipe box
- Also tell the shopping lists to remove it!

### Helper Function: getProductsFromFile()

```javascript
const getProductsFromFile = cb => {
  fs.readFile(p, (err, fileContent) => {
    if (err) {
      cb([]);  // If no file, return empty array
    } else {
      cb(JSON.parse(fileContent));  // Parse and return
    }
  });
};
```

**What it does:**
1. Read `products.json` file
2. If error (file doesn't exist), return empty array `[]`
3. If success, convert JSON string to JavaScript array
4. Call callback with the array

---

## 🛒 Cart Model - Detailed Explanation

### addProduct() Method

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

**Step-by-step breakdown:**

**Step 1: Read current cart**
```javascript
let cart = { products: [], totalPrice: 0 };
if (!err) {
  cart = JSON.parse(fileContent);
}
```
- Start with empty cart
- If file exists, read it
- Like opening your shopping basket

**Step 2: Check if product already in cart**
```javascript
const existingProductIndex = cart.products.findIndex(
  prod => prod.id === id
);
```
- Search for product by ID
- Returns index if found, -1 if not found

**Step 3: Update quantity OR add new**
```javascript
if (existingProduct) {
  // Increase quantity by 1
  updatedProduct.qty = updatedProduct.qty + 1;
} else {
  // Add with quantity 1
  updatedProduct = { id: id, qty: 1 };
}
```

**Step 4: Update total price**
```javascript
cart.totalPrice = cart.totalPrice + +productPrice;
```
- The `+productPrice` converts string to number
- Add price to total

**Step 5: Save cart**
```javascript
fs.writeFile(p, JSON.stringify(cart), err => {
  console.log(err);
});
```
- Write updated cart back to file

**Simple explanation:**
- Like adding an item to your shopping basket
- If you already have one, add another
- If it's new, put it in
- Update the price tag on the basket

### deleteProduct() Method

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

**How it works:**

**Step 1: Read cart and find product**
```javascript
const product = updatedCart.products.find(prod => prod.id === id);
if (!product) return;  // Not in cart, nothing to do
```

**Step 2: Calculate price to subtract**
```javascript
const productQty = product.qty;
```
- If you had 3 items at $10 each = $30 to subtract

**Step 3: Remove from cart**
```javascript
updatedCart.products = updatedCart.products.filter(
  prod => prod.id !== id
);
```
- Keep all products EXCEPT this one

**Step 4: Update total**
```javascript
updatedCart.totalPrice = updatedCart.totalPrice - productPrice * productQty;
```
- Subtract: price × quantity

**Step 5: Save**
```javascript
fs.writeFile(p, JSON.stringify(updatedCart), err => {
  console.log(err);
});
```

**Simple explanation:**
- Like removing an item from your basket
- Take out ALL of that item (not just one)
- Subtract its total from the price
- Update your basket

### getCart() Method

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

**How it works:**
1. Read `cart.json` file
2. If error, return `null`
3. If success, parse and return cart object

**Usage:**
```javascript
Cart.getCart(cart => {
  console.log(cart.products);
  console.log(cart.totalPrice);
});
```

**Simple explanation:**
- Like looking inside your shopping basket
- See what's there and how much it costs

---

## 📊 Data File Structure

### products.json

```json
[
  {
    "id": "0.12345",
    "title": "JavaScript Book",
    "imageUrl": "https://example.com/book.jpg",
    "description": "A comprehensive guide to JS",
    "price": 29.99
  },
  {
    "id": "0.67890",
    "title": "Laptop",
    "imageUrl": "https://example.com/laptop.jpg",
    "description": "Powerful laptop for coding",
    "price": 999.99
  }
]
```

**Structure:**
- Array of product objects
- Each product has: id, title, imageUrl, description, price
- Saved as JSON text file

### cart.json

```json
{
  "products": [
    {
      "id": "0.12345",
      "qty": 2
    },
    {
      "id": "0.67890",
      "qty": 1
    }
  ],
  "totalPrice": 1059.97
}
```

**Structure:**
- Single object (not array!)
- `products`: array of {id, qty}
- `totalPrice`: sum of all item prices
- Saved as JSON text file

**Why different?**
- Products: Many independent items → Array
- Cart: One cart with items → Object with array inside

---

## 🔄 Data Flow Examples

### Adding a Product

```
Admin fills form
    ↓
POST /admin/add-product
    ↓
Controller: adminController.postAddProduct
    ↓
Create new Product(null, title, imageUrl, desc, price)
    ↓
Call product.save()
    ↓
Model: Product.save()
    ↓
Read products.json
    ↓
Generate ID, add to array
    ↓
Write to products.json
    ↓
Done! ✅
```

### Viewing Products

```
User visits /products
    ↓
GET /products
    ↓
Controller: shopController.getProducts
    ↓
Call Product.fetchAll(callback)
    ↓
Model: Product.fetchAll()
    ↓
Read products.json
    ↓
Parse JSON to array
    ↓
Return array to controller
    ↓
Controller sends to view
    ↓
View displays products
    ↓
Done! ✅
```

### Adding to Cart

```
User clicks "Add to Cart"
    ↓
POST /cart (with productId)
    ↓
Controller: shopController.postCart
    ↓
Product.findById(id) - get product
    ↓
Cart.addProduct(id, price)
    ↓
Model: Cart.addProduct()
    ↓
Read cart.json
    ↓
Check if product already in cart
    ↓
If yes: qty + 1
If no: add with qty 1
    ↓
Update totalPrice
    ↓
Write to cart.json
    ↓
Redirect to /cart
    ↓
Done! ✅
```

### Deleting a Product

```
Admin clicks "Delete"
    ↓
POST /admin/delete-product (with productId)
    ↓
Controller: adminController.postDeleteProduct
    ↓
Product.deleteById(id)
    ↓
Model: Product.deleteById()
    ↓
Read products.json
    ↓
Filter out product with matching ID
    ↓
Write updated array to products.json
    ↓
Call Cart.deleteProduct() - cleanup
    ↓
Cart removes from all carts
    ↓
Done! ✅
```

---

## 🎓 Summary for a 5-Year-Old

### **The Library Story:**

Imagine you have a toy library:

### **Product Model = Librarian for Toys**

**Adding a toy:**
1. Someone brings a new toy (admin adds product)
2. Librarian writes info on a card (create Product)
3. Librarian files the card (save to products.json)
4. Now anyone can borrow it! (customers can see it)

**Finding toys:**
1. You ask "What toys do you have?" (fetchAll)
2. Librarian checks all cards (reads file)
3. Shows you the list (returns array)

**Finding one toy:**
1. You say "I want toy #123" (findById)
2. Librarian searches cards (search array)
3. Finds that one toy (returns product)

**Removing a toy:**
1. Librarian decides toy is too broken (admin deletes)
2. They tear up the card (deleteById)
3. They update the catalog (save file)
4. They tell everyone who borrowed it (clean cart)

### **Cart Model = Shopping Basket Helper**

**Adding to basket:**
1. You pick a toy to borrow (add to cart)
2. Helper checks your basket (read cart.json)
3. If toy already there: add +1 more (increase qty)
4. If toy new: put it in basket (add with qty 1)
5. Helper updates price tag (add to total)

**Removing from basket:**
1. You changed your mind (delete from cart)
2. Helper takes toy out of basket (filter array)
3. Helper subtracts from price tag (update total)

**Checking basket:**
1. You want to see what you picked (getCart)
2. Helper shows you the basket (return cart data)

That's exactly how the data models work! 💾📚

---

## 🔗 Related Concepts

### JSON (JavaScript Object Notation)
- Way to store data as text
- Easily converts between JavaScript and text
- `JSON.stringify()` - Object → Text
- `JSON.parse()` - Text → Object

### Callbacks
- Functions passed as arguments
- Called when operation completes
- Used for async file operations

### Static Methods
- Called on Class: `Product.fetchAll()`
- Not on instance: ~~`product.fetchAll()`~~
- Used for operations on ALL data

### Instance Methods
- Called on object: `product.save()`
- Work with specific instance
- Used for operations on ONE item

### File System (fs)
- Node.js module for file operations
- `fs.readFile()` - Read file
- `fs.writeFile()` - Write file
- Async operations use callbacks

---

## 💡 Future Improvements

### Use a Real Database
Instead of JSON files, use:
- **MongoDB** - NoSQL database
- **PostgreSQL** - SQL database
- **MySQL** - SQL database

**Benefits:**
- Faster searches
- Better for multiple users
- More reliable
- Built-in features (sorting, filtering)

### Add Validation
Check data before saving:
```javascript
save() {
  if (!this.title || this.title.length < 3) {
    throw new Error('Title too short');
  }
  if (this.price <= 0) {
    throw new Error('Price must be positive');
  }
  // ... save ...
}
```

### Use Promises/Async-Await
Instead of callbacks:
```javascript
static async fetchAll() {
  const data = await readFile(p);
  return JSON.parse(data);
}
```

Your project uses callbacks (older style but works fine)! ✅

---

## 📝 Current Status

**Status**: ✅ Working with JSON files

**What exists:**
- ✅ Product model with CRUD operations
- ✅ Cart model with add/remove/get
- ✅ Data persisted to JSON files
- ✅ Proper file handling

**What could be improved:**
- ⚠️ No validation
- ⚠️ Callbacks (could use async/await)
- ⚠️ JSON files (could use database)
- ⚠️ No error handling
- ⚠️ Random IDs (could use UUIDs)

But for learning, this is perfect! 🎯
