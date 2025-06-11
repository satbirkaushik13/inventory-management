const express = require('express');
const router = express.Router();
const { all, add } = require('../controllers/keywordController');

// Route to get all keywords with optional search and pagination
router.route("/all").post(all);

// Route to create/add multiple keywords
router.route("/").post(add);

module.exports = router;