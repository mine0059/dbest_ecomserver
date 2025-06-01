const express = require('express');
const router = express.Router();

const { 
    getUserCount, 
    deleteUser, 
    addCategory,
    editCategory,
    deleteCategory,
} = require('../controllers/admin/users.controller');

const {
    getOrders,
    getOrdersCount,
    changeOrderStatus,
    deleteOrders,
} = require('../controllers/admin/orders.controller');

const {
    getProductsCount,
    getProducts,
    addProduct,
    editProduct,
    deleteProductImages,
    deleteProduct
} = require('../controllers/admin/products.controller');

// USERS
router.get('/users/count', getUserCount);
router.delete('/users/:id', deleteUser);

// CATEGORIES
router.post('/categories', addCategory);
router.put('/categories/id', editCategory);
router.delete('/categories/id', deleteCategory);

// PRODUCTS
router.get('/products/count', getProductsCount);
router.get('/products', getProducts);
router.post('/products', addProduct);
router.put('/products/:id', editProduct);
router.delete('/products/:id/images', deleteProductImages);
router.delete('/products/:id', deleteProduct);

// ORDERS
router.get('/orders', getOrders);
router.get('/orders/count', getOrdersCount);
router.put('/orders/:id', changeOrderStatus);
router.delete('/orders/:id', deleteOrders);

module.exports = router;