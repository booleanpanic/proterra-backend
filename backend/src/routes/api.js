const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const productController = require('../controllers/productController');
const textureController = require('../controllers/textureController');
const heroSlideController = require('../controllers/heroSlideController');
const projectController = require('../controllers/projectController');
const authController = require('../controllers/authController');

// Auth
router.post('/auth/login', authController.login);

// Categories
router.get('/admin/categories', categoryController.getAdminCategories);
router.post('/categories', categoryController.createCategory); // Needed for admin create
router.put('/categories/:id', categoryController.updateCategory);
router.delete('/categories/:id', categoryController.deleteCategory);
router.get('/categories', categoryController.getCategories); // Public route

// Products
router.get('/admin/products', productController.getAdminProducts);
router.get('/admin/products/:id', productController.getProduct);
router.post('/admin/products', productController.createProduct);
router.put('/admin/products/:id', productController.updateProduct);
router.delete('/admin/products/:id', productController.deleteProduct);

// Textures
router.get('/textures', textureController.getAll); // Public & Admin can use
router.post('/admin/textures', textureController.create);
router.put('/admin/textures/:id', textureController.update);
router.delete('/admin/textures/:id', textureController.delete);

// Hero Slides
router.get('/hero-slides', heroSlideController.getAll);
router.post('/admin/hero-slides', heroSlideController.create);
router.put('/admin/hero-slides/:id', heroSlideController.update);
router.delete('/admin/hero-slides/:id', heroSlideController.delete);

// Projects
router.get('/admin/projects', projectController.getAll);
router.post('/admin/projects', projectController.create);
router.put('/admin/projects/:id', projectController.update);
router.delete('/admin/projects/:id', projectController.remove);

// Public Routes
router.get('/products', productController.getProducts);
router.get('/products/:id', productController.getProductDetail);
router.get('/projects', projectController.getAll);

module.exports = router;
