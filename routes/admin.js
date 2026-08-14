const path = require('path');

const express = require('express');
const { body } = require('express-validator');

const adminController = require('../controllers/admin');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

// Route to display the add product form
// Includes validation rules for product fields and requires authentication
// /admin/add-product => GET
router.get('/add-product',
    [
        body('title')
            .isString()
            .isLength({ min: 3 })
            .trim(),
        body('imageUrl')
            .isURL(),
        body('price')
            .isFloat(),
        body('description')
            .isLength({ min: 5, max: 400})
            .trim()
    ],
    isAuth, 
    adminController.getAddProduct);

// Route to display all products created by the authenticated admin user
// /admin/products => GET
router.get(
    '/products', 
    isAuth, 
    adminController.getProducts
);

// Route to handle product creation form submission
// Processes the validated data and creates a new product
// /admin/add-product => POST
router.post(
    '/add-product', 
    isAuth, 
    adminController.postAddProduct
);

// Route to display the edit product form with existing product data
// Retrieves product by ID from URL parameter
router.get(
    '/edit-product/:productId', 
    isAuth, 
    adminController.getEditProduct
);

// Route to handle product update form submission
// Validates input fields and updates the product in the database
router.post('/edit-product',
    [
        body('title')
            .isString()
            .isLength({ min: 3 })
            .trim(),
        body('imageUrl')
            .isURL(),
        body('price')
            .isFloat(),
        body('description')
            .isLength({ min: 5, max: 400})
            .trim()
    ],
    isAuth, 
    adminController.postEditProduct);

// Route to handle product deletion
// Removes the product from the database if owned by the authenticated user
router.post('/delete-product', 
    isAuth, 
    adminController.postDeleteProduct);

module.exports = router;
