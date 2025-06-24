const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blogController');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { isAuthenticated } = require('../middleware/auth');

// Multer configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    },
});

const upload = multer({ storage: storage });

// Blog routes - public access for viewing blogs
router.get('/', blogController.showBlogs);
// Protected and static routes must come before dynamic :id route
router.get('/add', isAuthenticated, blogController.showAddBlog);
router.post('/add', isAuthenticated, upload.single('image'), blogController.addBlog);
router.get('/update', isAuthenticated, blogController.showUpdateBlog);
router.get('/delete/:id', isAuthenticated, blogController.deleteBlog);
// Dynamic route last
router.get('/:id', blogController.showSingleBlog);

module.exports = router; 