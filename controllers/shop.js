const fs = require('fs');
const path = require('path');

const PDFDocument = require('pdfkit');
const Product = require('../models/product');
const Order = require('../models/order');

const ITEMS_PER_PAGE = 2;

// Displays all available products in the shop
// Retrieves all products from the database and renders the product list page
exports.getProducts = (req, res, next) => {
  const page = +req.query.page || 1;
  let totalItems;

  Product.find()
  .countDocuments()
  .then(numProducts => {
    totalItems = numProducts
    return Product.find()
    .skip((page - 1) * ITEMS_PER_PAGE)
    .limit(ITEMS_PER_PAGE);
  })
  .then(products => {
      res.render('shop/product-list', {
        prods: products,
        pageTitle: 'Products',
        path: '/products',
        currentPage: page,
        hasNextPage: ITEMS_PER_PAGE * page < totalItems,
        hasPreviousPage: page > 1,
        nextPage: page + 1,
        previousPage: page - 1,
        lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE)
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
  const page = +req.query.page || 1;
  let totalItems;

  Product.find()
  .countDocuments()
  .then(numProducts => {
    totalItems = numProducts
    return Product.find()
    .skip((page - 1) * ITEMS_PER_PAGE)
    .limit(ITEMS_PER_PAGE);
  })
  .then(products => {
      res.render('shop/index', {
        prods: products,
        pageTitle: 'Shop',
        path: '/',
        currentPage: page,
        hasNextPage: ITEMS_PER_PAGE * page < totalItems,
        hasPreviousPage: page > 1,
        nextPage: page + 1,
        previousPage: page - 1,
        lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE)
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

exports.getInvoice = (req, res, next) => {
  const orderId = req.params.orderId;
  Order.findById(orderId)
  .then(order => {
    if (!order) {
      return next(new Error('No order is found'));
    }
    if (order.user.userId.toString() !== req.user._id.toString()) {
      return next(new Error('Unauthorized'));
    }
    const invoiceName = 'invoice-' + orderId + '.pdf';
    const invoicePath = path.join('data', 'invoices', invoiceName);

    const pdfDoc = new PDFDocument();
    res.setHeader(
      'Content-Type', 
      'application/pdf'
    );
    res.setHeader(
      'Content-Disposition', 
      'inline; filename="' + invoiceName + '"'
    );
    pdfDoc.pipe(fs.createWriteStream(invoicePath));
    pdfDoc.pipe(res);

    pdfDoc.fontSize(26).text('Invoice', {
      underline: true
    });
    pdfDoc.text('--------------------------------');

    let totalPrice = 0;
    order.products.forEach(prod => {
      totalPrice += prod.quantity * prod.product.price;
      pdfDoc.fontSize(16).text(
        prod.product.title + 
        ' - ' + 
        prod.quantity + 
        ' x ' + 
        '$' + 
        prod.product.price
      );
    });
    pdfDoc.text('--------------------------------');
    pdfDoc.text('Total Price: $' + totalPrice);

    pdfDoc.end();
    // fs.readFile(invoicePath, (err, data) => {
    //   if (err) {
    //     return next(err);
    //   }
    //   res.setHeader('Content-Type', 'application/pdf');
    //   res.setHeader('Content-Disposition', 'inline; filename="' + invoiceName + '"');
    //   res.send(data);
    // });

    // const file = fs.createReadStream(invoicePath);
    // res.setHeader(
    //   'Content-Type', 
    //   'application/pdf'
    // );
    // res.setHeader(
    //   'Content-Disposition', 
    //   'inline; filename="' + invoiceName + '"'
    // );
    // file.pipe(res);
  })
  .catch(err => next(err))
};