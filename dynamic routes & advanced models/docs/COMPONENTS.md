# 🧩 Reusable Components - How They Work

## What Are Components?

Components are small pieces of HTML that are used on MANY pages! Instead of writing the same code over and over, we write it once and include it everywhere.

Think of it like LEGO blocks - you build the block once, then use it in many different creations!

## 📁 Location

**Folder**: `views/includes/`

## 🎯 Available Components

### 1. Head Component (`head.ejs`)

**File**: `views/includes/head.ejs`

**What it does:**
- Creates the `<head>` section of every page
- Includes page title
- Links to CSS files
- Sets up meta tags

**Example usage:**
```ejs
<%- include('../includes/head.ejs') %>
```

**Typical content:**
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><%= pageTitle %></title>
    <link rel="stylesheet" href="/css/main.css">
```

**Why use it?**
- Every page needs a `<head>` section
- Instead of copying 10 lines to every page
- We include this ONE component!

---

### 2. Navigation Component (`navigation.ejs`)

**File**: `views/includes/navigation.ejs`

**What it does:**
- Creates the menu bar at the top
- Shows links to all main pages
- Highlights the current page

**Example usage:**
```ejs
<%- include('../includes/navigation.ejs') %>
```

**Typical content:**
```html
<nav class="main-header">
    <ul class="main-header__item-list">
        <li class="main-header__item">
            <a class="<%= path === '/' ? 'active' : '' %>" href="/">Shop</a>
        </li>
        <li class="main-header__item">
            <a class="<%= path === '/products' ? 'active' : '' %>" href="/products">Products</a>
        </li>
        <li class="main-header__item">
            <a class="<%= path === '/cart' ? 'active' : '' %>" href="/cart">Cart</a>
        </li>
        <li class="main-header__item">
            <a class="<%= path === '/orders' ? 'active' : '' %>" href="/orders">Orders</a>
        </li>
        <li class="main-header__item">
            <a class="<%= path === '/admin/add-product' ? 'active' : '' %>" 
               href="/admin/add-product">Add Product</a>
        </li>
        <li class="main-header__item">
            <a class="<%= path === '/admin/products' ? 'active' : '' %>" 
               href="/admin/products">Admin Products</a>
        </li>
    </ul>
</nav>
```

**Special feature - Active highlighting:**
```ejs
<a class="<%= path === '/' ? 'active' : '' %>" href="/">Shop</a>
```

**How it works:**
- Each page passes a `path` variable
- If `path === '/'`, add `active` class
- CSS makes active links look different (highlighted)
- Shows users which page they're on!

**Why use it?**
- Every page needs a menu
- Keeps navigation consistent
- Change menu once, updates everywhere!

---

### 3. End Component (`end.ejs`)

**File**: `views/includes/end.ejs`

**What it does:**
- Closes the HTML document properly
- Can include scripts
- Closes `<body>` and `<html>` tags

**Example usage:**
```ejs
<%- include('../includes/end.ejs') %>
```

**Typical content:**
```html
    <script src="/js/main.js"></script>
</body>
</html>
```

**Why use it?**
- Every page needs to close properly
- Ensures no unclosed tags
- Place for shared JavaScript

---

### 4. Add to Cart Component (`add-to-cart.ejs`)

**File**: `views/includes/add-to-cart.ejs`

**What it does:**
- Creates an "Add to Cart" button
- Includes hidden form with product ID
- Works on any page with product data

**Example usage:**
```ejs
<%- include('../includes/add-to-cart.ejs', {product: product}) %>
```

**Typical content:**
```html
<form action="/cart" method="post">
    <button class="btn" type="submit">Add to Cart</button>
    <input type="hidden" name="productId" value="<%= product.id %>">
</form>
```

**How it works:**
1. **Form**: Sends POST request to `/cart`
2. **Button**: What users click
3. **Hidden input**: Secretly sends product ID
4. **When clicked**: Adds that product to cart!

**Receiving data:**
```ejs
<%- include('../includes/add-to-cart.ejs', {product: product}) %>
```
- The `{product: product}` passes product data to component
- Component uses `product.id` to know which product

**Why use it?**
- "Add to Cart" appears on multiple pages
- Same button everywhere (consistent)
- Update button once, changes everywhere!

---

## 🔄 How Includes Work

### The Include Syntax

```ejs
<%- include('path/to/component.ejs') %>
```

**Parts explained:**
- `<%-` - Start EJS tag (with hyphen = don't escape HTML)
- `include` - EJS function to insert another file
- `'path/to/component.ejs'` - Path to the component file
- `%>` - End EJS tag

### With Data

```ejs
<%- include('path/to/component.ejs', {key: value}) %>
```

**Passing data:**
- Second parameter is an object
- Example: `{product: product}`
- Component can use `product.id`, `product.title`, etc.

### Relative Paths

From a page in `views/shop/index.ejs`:
```ejs
<%- include('../includes/head.ejs') %>
```
- `..` means "go up one folder"
- From `views/shop/` → `views/`
- Then into `includes/` folder

From a page in `views/admin/products.ejs`:
```ejs
<%- include('../includes/head.ejs') %>
```
- Same path! Components are reused everywhere

## 📋 Typical Page Structure

**Most pages follow this pattern:**

```ejs
<%- include('../includes/head.ejs') %>
    <!-- Optional: page-specific CSS links -->
    <link rel="stylesheet" href="/css/forms.css">
</head>

<body>
    <%- include('../includes/navigation.ejs') %>
    
    <main>
        <!-- Page-specific content here -->
        <h1>Welcome!</h1>
    </main>
    
<%- include('../includes/end.ejs') %>
```

**Breakdown:**
1. **Top**: Include head component
2. **Head extras**: Any page-specific styles
3. **Close head**: `</head>` and open `<body>`
4. **Navigation**: Include navigation component
5. **Main content**: The unique stuff for this page
6. **Bottom**: Include end component

## 🎨 Why Components Are Awesome

### Before Components (Bad)

**home.ejs:**
```html
<!DOCTYPE html>
<html>
<head>
    <title>Home</title>
    <link rel="stylesheet" href="/css/main.css">
</head>
<body>
    <nav>
        <a href="/">Home</a>
        <a href="/products">Products</a>
    </nav>
    <h1>Welcome!</h1>
</body>
</html>
```

**products.ejs:**
```html
<!DOCTYPE html>
<html>
<head>
    <title>Products</title>
    <link rel="stylesheet" href="/css/main.css">
</head>
<body>
    <nav>
        <a href="/">Home</a>
        <a href="/products">Products</a>
    </nav>
    <h1>Our Products</h1>
</body>
</html>
```

**Problem:** Same code repeated! If you want to add a link to the menu, you have to change EVERY file! 😰

### After Components (Good)

**home.ejs:**
```ejs
<%- include('../includes/head.ejs') %>
</head>
<body>
    <%- include('../includes/navigation.ejs') %>
    <main>
        <h1>Welcome!</h1>
    </main>
<%- include('../includes/end.ejs') %>
```

**products.ejs:**
```ejs
<%- include('../includes/head.ejs') %>
</head>
<body>
    <%- include('../includes/navigation.ejs') %>
    <main>
        <h1>Our Products</h1>
    </main>
<%- include('../includes/end.ejs') %>
```

**Benefit:** Change navigation ONCE in `navigation.ejs`, updates on ALL pages! 🎉

## 🔧 Creating Your Own Component

### Step 1: Create the Component File

**File**: `views/includes/footer.ejs`
```html
<footer class="main-footer">
    <p>&copy; 2024 My Shop. All rights reserved.</p>
    <ul>
        <li><a href="/about">About</a></li>
        <li><a href="/contact">Contact</a></li>
        <li><a href="/privacy">Privacy</a></li>
    </ul>
</footer>
```

### Step 2: Include It On Pages

**Any page:**
```ejs
<%- include('../includes/head.ejs') %>
</head>
<body>
    <%- include('../includes/navigation.ejs') %>
    
    <main>
        <!-- Page content -->
    </main>
    
    <%- include('../includes/footer.ejs') %>  <!-- New! -->
<%- include('../includes/end.ejs') %>
```

### Step 3: Enjoy!
Now every page has a footer automatically! ✅

## 📊 Component Data Flow

### Navigation Component Example

**Controller sends:**
```javascript
res.render('shop/index', {
  prods: products,
  pageTitle: 'Shop',
  path: '/'  // ← This is for navigation!
});
```

**Navigation component uses:**
```ejs
<a class="<%= path === '/' ? 'active' : '' %>" href="/">Shop</a>
```

**Result:**
- If on home page (`path === '/'`), adds `active` class
- CSS styles active links differently
- User sees which page they're on!

### Add to Cart Component Example

**Page passes product:**
```ejs
<%- include('../includes/add-to-cart.ejs', {product: product}) %>
```

**Component uses:**
```ejs
<input type="hidden" name="productId" value="<%= product.id %>">
```

**Result:**
- Component knows which product
- Sends correct product ID when clicked
- Works for any product!

## 🎓 Summary for a 5-Year-Old

### **The LEGO Block Story:**

Imagine building with LEGOs:

**Without Components:**
1. You build a house - make a door by hand
2. You build a car - make a door by hand
3. You build a school - make a door by hand
4. SO MUCH WORK! 😫

**With Components:**
1. You have a **door LEGO block**
2. Use it for house ✅
3. Use it for car ✅
4. Use it for school ✅
5. If you want to change all doors, just modify the door block!
6. EASY! 😄

**That's exactly how components work!**

Components are like reusable blocks:
- **Head block** - Goes on top of every page
- **Navigation block** - The menu on every page
- **Footer block** - Goes on bottom
- **Add to Cart block** - Button on product pages

Build once, use everywhere! 🧩✨

## 🔗 Related Concepts

- **DRY Principle**: "Don't Repeat Yourself" - write code once, reuse it
- **Partials**: Another name for components/includes
- **Templates**: The full pages that use components
- **Layouts**: Master templates with placeholders for content

## 💡 Best Practices

1. **Keep components small** - Each does ONE thing
2. **Name clearly** - `navigation.ejs`, not `nav.ejs`
3. **Document data needs** - What variables does it expect?
4. **Make reusable** - Avoid page-specific logic
5. **Use the includes folder** - Keep organized

Your project follows these practices well! ✅
