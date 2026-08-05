const Product = require('../models/product');
const Order = require('../models/order');

exports.getProducts = (req, res, next) => {
  Product.find()
    .then(products => {
      console.log(products);
      res.render('shop/product-list', {
        prods: products,
        pageTitle: 'All Products',
        path: '/products',
        isAuthenticated: req.session.isLoggedIn
      });
    })
    .catch(err => {
      console.log(err);
    });
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findById(prodId)
    .then(product => {
      res.render('shop/product-detail', {
        product: product,
        pageTitle: product.title,
        path: '/products',
        isAuthenticated: req.session.isLoggedIn
      });
    })
    .catch(err => console.log(err));
};

exports.getIndex = (req, res, next) => {
  Product.find()
    .then(products => {
      res.render('shop/index', {
        prods: products,
        pageTitle: 'Shop',
        path: '/',
        isAuthenticated: req.session.isLoggedIn
      });
    })
    .catch(err => {
      console.log(err);
    });
};

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
        isAuthenticated: req.session.isLoggedIn
      });
    })
    .catch(err => console.log(err));
};

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
    .catch(err => console.log(err));
};

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
          name: req.user.name,
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
      console.log('Error creating order:', err);
      res.redirect('/cart');
    });
};

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
        isAuthenticated: req.session.isLoggedIn
      });
    })
    .catch(err => {
      console.log('Error fetching orders:', err);
      res.redirect('/');
    });
};
