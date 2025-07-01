/* global use, db */
// MongoDB Playground
// Use Ctrl+Space inside a snippet or a string literal to trigger completions.

// Select the database to use.
use('mongodbVSCodePlaygroundDB');

// Insert a few documents into the products collection.
db.getCollection('products').insertMany([
  {
    'name': 'Product 1',
    'description': 'Description for product 1',
    'price': 99.99,
    'category': 'Electronics'
  },
  {
    'name': 'Product 2',
    'description': 'Description for product 2',
    'price': 149.99,
    'category': 'Electronics'
  }
]);

// Find all products.
db.getCollection('products').find();