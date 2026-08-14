const Product = require('../models/product');
const Order = require('../models/order');

// Displays all available products in the shop
// Retrieves all products from the database and renders the product list page
exports.getProducts = (req, res, next) => {
  Product.find()
    .then(products => {
      console.log(products);
      res.render('shop/product-list', {
        prods: products,
        pageTitle: 'All Products',
        path: '/products',
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

// Displays detailed information for a single product
// Retrieves product by ID from the URL parameter and renders the product detail page
exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findById(prodId)
    .then(product => {
      res.render('shop/product-detail', {
        product: product,
        pageTitle: product.title,
        path: '/products',
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

// Renders the shop homepage with all products
// Displays all available products on the main index page
exports.getIndex = (req, res, next) => {
  Product.find()
    .then(products => {
      res.render('shop/index', {
        prods: products,
        pageTitle: 'Shop',
        path: '/',
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

// Displays the user's shopping cart
// Populates cart items with full product details and renders the cart page
exports.getCart = (req, res, next) => {
  if (!req.user) {
    return res.redirect('/login');
  }
  req.user
    .populate('cart.items.productId')
    .then(user => {
      const products = user.cart.items;
      res.render('shop/cart', {
        path: '/cart',
        pageTitle: 'Your Cart',
        products: products,
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

// Adds a product to the user's shopping cart
// Retrieves the product and calls the user's addToCart method to update the cart
exports.postCart = (req, res, next) => {
  if (!req.user) {
    return res.redirect('/login');
  }
  const prodId = req.body.productId;
  Product.findById(prodId)
    .then(product => {
      return req.user.addToCart(product);
    })
    .then(result => {
      console.log(result);
      res.redirect('/cart');
    });
};

// Removes a product from the user's shopping cart
// Calls the user's removeFromCart method to delete the specified item
exports.postCartDeleteProduct = (req, res, next) => {
  if (!req.user) {
    return res.redirect('/login');
  }
  const prodId = req.body.productId;
  req.user
    .removeFromCart(prodId)
    .then(result => {
      res.redirect('/cart');
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

// Creates a new order from the user's cart items
// Converts cart items to order format, saves the order, and clears the user's cart
exports.postOrder = (req, res, next) => {
  if (!req.user) {
    return res.redirect('/login');
  }
  req.user
    .populate('cart.items.productId')
    .then(user => {
      const products = user.cart.items.map(i => {
        return { 
          quantity: i.quantity, 
          product: {
            _id: i.productId._id,
            title: i.productId.title,
            price: i.productId.price,
            description: i.productId.description,
            imageUrl: i.productId.imageUrl
          }
        };
      });
      const order = new Order({
        user: {
          email: req.user.email,
          userId: req.user
        },
        products: products
      });
      return order.save();
    })
    .then(result => {
      return req.user.clearCart();
    })
    .then(() => {
      res.redirect('/orders');
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

// Displays all orders for the current user
// Retrieves orders by userId, filters out invalid product data, and renders the orders page
exports.getOrders = (req, res, next) => {
  if (!req.user) {
    return res.redirect('/login');
  }
  Order.find({ 'user.userId': req.user._id })
    .then(orders => {
      // Filter out any orders with invalid product data
      const validOrders = orders.map(order => {
        const validProducts = order.products.filter(p => p.product && p.product.title);
        return {
          ...order.toObject(),
          products: validProducts
        };
      }).filter(order => order.products.length > 0);
      
      res.render('shop/orders', {
        path: '/orders',
        pageTitle: 'Your Orders',
        orders: validOrders,
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};
