const path = require('path');

const express = require('express');

const shopController = require('../controllers/shop');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

// Route to display the shop homepage with all products
router.get(
    '/', 
    shopController.getIndex
);

// Route to display all products in the product list page
router.get(
    '/products', 
    shopController.getProducts
);

// Route to display detailed information for a specific product
// Product ID is extracted from the URL parameter
router.get(
    '/products/:productId', 
    shopController.getProduct
);

// Route to display the user's shopping cart
// Requires authentication to access
router.get(
    '/cart', 
    isAuth, 
    shopController.getCart
);

// Route to add a product to the shopping cart
// Requires authentication to add items
router.post(
    '/cart', 
    isAuth, 
    shopController.postCart
);

// Route to remove an item from the shopping cart
// Requires authentication to modify cart
router.post(
    '/cart-delete-item', 
    isAuth, 
    shopController.postCartDeleteProduct
);

// Route to create a new order from the cart items
// Requires authentication and converts cart to an order
router.post(
    '/create-order', 
    isAuth, 
    shopController.postOrder
);

// Route to display all orders for the authenticated user
// Requires authentication to view order history
router.get(
    '/orders', 
    isAuth, 
    shopController.getOrders
);

module.exports = router;
