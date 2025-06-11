const express = require('express');
const router = express.Router();

const { all, add } = require('../controllers/categoryController');
// Route to get all categories
router.route('/all').post(all);

// Route to create/add multiple categories
router.route('/').post(add);

module.exports = router;