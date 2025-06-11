const express = require('express');
const router = express.Router();
const { all, add } = require('../controllers/brandController');

// Route to get all brands with optional search and pagination
router.route("/all").post(all);

// Route to create/add multiple brands
router.route("/").post(add);

module.exports = router;