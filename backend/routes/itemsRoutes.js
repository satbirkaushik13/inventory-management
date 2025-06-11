const express = require('express');
const router = express.Router();

const fs = require('fs');
const multer = require("multer");
const path = require("path");

const {
	all,
	add,
	get,
	update,
	deleteItem,
	getKeywords,
	bindKeywords,
	uploadAttachment
} = require("../controllers/itemController");

// Dynamic Multer storage setup based on attachment type
const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		const uploadDir = path.join(__dirname, "..", "uploads", 'images');

		// Ensure directory exists
		fs.mkdirSync(uploadDir, { recursive: true });
		cb(null, uploadDir);
	},
	filename: function (req, file, cb) {
		const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
		const ext = path.extname(file.originalname);
		cb(null, file.fieldname + "-" + uniqueSuffix + ext);
	}
});

// File filter to allow only images
const allowedFileType = (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Only JPEG, PNG, and GIF images are allowed"), false);
    }
};

// Multer middleware
const upload = multer({
    storage: storage,
    fileFilter: allowedFileType,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

// Route to get all items with pagination
router.route("/all").post(all);

// Route to create/add single item
router.route("/").post(add);

// Route to get, update and delete a single item by item_id
router.route("/:item_id").get(get).patch(update).delete(deleteItem);

// Route to get keywords and bind for a specific item by item_id
router.route("/:item_id/keywords").get(getKeywords).post(bindKeywords);


// Route to upload an image for an item
router.route("/:item_id/upload").post(upload.single("attachment_name"), uploadAttachment);

module.exports = router;