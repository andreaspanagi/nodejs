# Data Directory

This directory contains legacy JSON data files from an earlier version of the application.

## Files

### cart.json
- **Purpose**: Previously stored shopping cart data with product IDs and quantities
- **Status**: Legacy file - the application now uses MongoDB to store cart data in the User model
- **Structure**: Contains products array with id/qty pairs and totalPrice

### products.json
- **Purpose**: Previously stored product catalog data
- **Status**: Legacy file - the application now uses MongoDB with the Product model to store product data
- **Structure**: Array of product objects with id, title, imageUrl, description, and price fields

## Current Data Storage

The application currently uses **MongoDB** for all data persistence:
- **User data**: Stored in the `users` collection (includes cart data)
- **Product data**: Stored in the `products` collection
- **Order data**: Stored in the `orders` collection
- **Session data**: Stored in the `sessions` collection

These JSON files can be safely removed if not needed for reference purposes.
