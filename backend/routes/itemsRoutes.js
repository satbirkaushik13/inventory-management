const express = require('express');
const router = express.Router();
const db = require("../db"); // Import MySQL connection

const fs = require('fs');
const sharp = require('sharp');
const multer = require("multer");


// Set storage engine for multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/images/"); // Save in uploads/images directory
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + path.extname(file.originalname)); // Unique file name
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
router.route("/all").post((req, res) => {
	const { page = 1, pageSize = 10 } = req.body; // Default values if not provided

	// Calculate the offset for pagination
	const offset = (parseInt(page) - 1) * pageSize;

	const sql = "SELECT * FROM im_items LIMIT ?, ?";
	db.query(sql, [offset, parseInt(pageSize)], (err, results) => {
		if (err) {
			console.error("❌ Database error:", err);
			return res.status(500).json({ message: "Database error" });
		}

		res.json({
			message: results.length ? "Success" : "Failed",
			page,
			pageSize,
			data: results,
		});
	});
});

// Route to create/add single item
router.route("/").post((req, res) => {
	let insert = req.body;

	// Define sensitive columns that should NOT be updated
	const sensitiveColumns = ["item_id", "item_added_on", "item_updated_on"];

	// Filter out sensitive columns
	insert = Object.keys(insert)
		.filter(key => !sensitiveColumns.includes(key)) // Exclude sensitive keys
		.reduce((obj, key) => {
			obj[key] = insert[key];
			return obj;
		}, {});

	if (Object.keys(insert).length === 0) {
		return res.status(400).json({ message: "No valid fields provided for update" });
	}

	// Generate dynamic SQL query
	const fields = Object.keys(insert).join(", ");
	const placeholders = Object.keys(insert).map(() => "?").join(", "); // Use `?` as placeholders
	const values = Object.values(insert);
	const sql = `INSERT INTO im_items (${fields}) VALUES (${placeholders})`;
	db.query(sql, values, (err, result) => {
		if (err) {
			console.error("❌ Database error:", err);
			return res.status(500).json({ message: "Database error" });
		}

		res.json({
			message: "Success",
			insertedId: result.insertId,
		});
	});
});

// Route to get a single item by item_id
router.route("/:item_id").get((req, res) => {
	const { item_id } = req.params; // Extract item_id from request params

	const sql = `SELECT * FROM im_items
    INNER JOIN im_categories ON category_id = item_category_id
    WHERE im_items.item_id = ?`;


	db.query(sql, [item_id], (err, itemResult) => {
		if (err) {
			console.error("❌ Database error:", err);
			return res.status(500).json({ message: "Database error" });
		}

		if (itemResult.length === 0) {
			return res.status(404).json({ message: "Item not found" });
		}

		let sql = `
			SELECT 
				k.keyword_id, 
				k.keyword_name 
			FROM im_item_keywords ik
			INNER JOIN im_keywords k ON k.keyword_id = ik.keyword_id
			WHERE ik.item_id = ?
		`;

		db.query(sql, [item_id], (err, keywords) => {
			if (err) {
				console.error("❌ Database error:", err);
				return res.status(500).json({ message: "Database error" });
			}

			let itemResultObject = itemResult[0];
			itemResultObject['keywords'] = keywords;

			let sql = `
				SELECT 
					at.attachment_id,
					at.attachment_name
				FROM im_attachments at
				INNER JOIN im_items i ON i.item_id = at.attachment_record_id
				WHERE i.item_id = ?
			`;

			db.query(sql, [item_id], (err, attachmentsResult) => {
				if (err) {
					console.error("❌ Database error:", err);
					return res.status(500).json({ message: "Database error" });
				}
				// Transform data: Collect all keyword details in a single array
				let attachments = attachmentsResult.map(({ attachment_id, attachment_name }) => ({
					attachment_id,
					attachment_url: {
						'orignal': path.join('item', 'image', attachment_name),
						'custom': path.join("item", "image", "500X500", "50", attachment_name)
					}
				}));
				itemResultObject['attachments'] = attachments;
				res.json({
					message: "Success",
					data: itemResultObject
				});
			});
		});
	});
});

// Route to update a single item by item_id
router.route("/:item_id").patch((req, res) => {
	const { item_id } = req.params;
	let updates = req.body;

	// Define sensitive columns that should NOT be updated
	const sensitiveColumns = ["item_id", "item_added_on", "item_updated_on"];

	// Filter out sensitive columns
	updates = Object.keys(updates)
		.filter(key => !sensitiveColumns.includes(key)) // Exclude sensitive keys
		.reduce((obj, key) => {
			obj[key] = updates[key];
			return obj;
		}, {});

	if (Object.keys(updates).length === 0) {
		return res.status(400).json({ message: "No valid fields provided for update" });
	}

	// Generate dynamic SQL query
	const fields = Object.keys(updates).map(key => `${key} = ?`).join(", ");
	const values = Object.values(updates);
	const sql = `UPDATE im_items SET ${fields} WHERE item_id = ?`;

	db.query(sql, [...values, item_id], (err, result) => {
		if (err) {
			console.error("❌ Database error:", err);
			return res.status(500).json({ message: "Database error" });
		}

		if (result.affectedRows === 0) {
			return res.status(404).json({ message: "Item not found or no changes made" });
		}

		res.json({
			message: "Success",
			affectedRows: result.affectedRows,
		});
	});
});

// Route to delete a single item by item_id
router.route("/:item_id").delete((req, res) => {
	const { item_id } = req.params;

	const sql = "DELETE FROM im_items WHERE item_id = ?";

	db.query(sql, [item_id], (err, result) => {
		if (err) {
			console.error("❌ Database error:", err);
			return res.status(500).json({ message: "Database error" });
		}

		if (result.affectedRows === 0) {
			return res.status(404).json({ message: "Item not found" });
		}

		res.json({ message: "Item deleted successfully" });
	});
});

// Route to get keywords for a specific item by item_id
router.route("/:item_id/keywords").get((req, res) => {
	let { item_id } = req.params;

	if (!item_id) {
		return res.status(400).json({ message: "No item ID was provided." });
	}

	let sql = `
		SELECT 
			i.item_id, 
			i.item_name, 
			k.keyword_id, 
			k.keyword_name 
		FROM im_item_keywords ik
		INNER JOIN im_items i ON i.item_id = ik.item_id
		INNER JOIN im_keywords k ON k.keyword_id = ik.keyword_id
		WHERE i.item_id = ?
	`;

	db.query(sql, [item_id], (err, results) => {
		if (err) {
			console.error("❌ Database error:", err);
			return res.status(500).json({ message: "Database error" });
		}

		if (results.length === 0) {
			return res.status(404).json({ message: "No keyword found for the given item." });
		}

		// Extract item details from the first row (since they are the same for all rows)
		let { item_id, item_name } = results[0];

		// Transform data: Collect all keyword details in a single array
		let keywords = results.map(({ keyword_id, keyword_name }) => ({
			keyword_id,
			keyword_name
		}));

		// Send formatted response
		res.json({
			message: "Success",
			data: {
				item_id,
				item_name,
				keywords
			},
		});
	});
});

// Bind keywords to an item
router.route("/:item_id/keywords").post( (req, res) => {
	let { item_id } = req.params;
	let keywords = req.body;

	if (!item_id) {
		return res.status(400).json({ message: "No item ID was provided." });
	}

	if (!Array.isArray(keywords) || keywords.length === 0) {
		return res.status(400).json({ message: "Invalid or empty keywords array." });
	}

	let keywordIds = keywords.map(k => parseInt(k.keyword_id)).filter(id => !isNaN(id));

	if (keywordIds.length === 0) {
		return res.status(400).json({ message: "No valid keyword IDs provided." });
	}

	// Prepare data for inserting into im_item_keywords
	let itemKeywordValues = keywordIds.map(id => [item_id, id]);

	let itemKeywordInsertQuery = `
        INSERT INTO im_item_keywords (item_id, keyword_id) 
        VALUES ? 
        ON DUPLICATE KEY UPDATE item_id = VALUES(item_id), keyword_id = VALUES(keyword_id)
    `;

	db.query(itemKeywordInsertQuery, [itemKeywordValues], (err, linkResults) => {
		if (err) {
			console.error("❌ Linking Error:", err);
			return res.status(500).json({ message: "Database error while linking keywords." });
		}

		res.json({
			message: "Keywords successfully linked to item",
			linkedKeywords: keywordIds
		});
	});
});

// Route to upload an image for an item
router.route("/:item_id/image/upload/:item_id").post(upload.single("image"), (req, res) => {
	const { item_id } = req.params;

	if (!req.file) {
		return res.status(400).json({ message: "No file uploaded" });
	}

	const sql = `
        INSERT INTO im_attachments (attachment_record_id, attachment_name, attachment_type)
        VALUES (?, ?, ?)
    `;

	db.query(sql, [item_id, req.file.filename, 0], (err, result) => {
		if (err) {
			console.error("❌ Database error:", err);
			return res.status(500).json({ message: "Database error while saving image" });
		}

		res.json({
			message: "Image uploaded successfully",
			attachment_url: {
				'fileName': req.file.filename,
				'orignal': path.join('item', 'image', req.file.filename),
				'custom': path.join("item", "image", "500X500", "50", req.file.filename)
			}
		});
	});
});

// Display customized image
router.route('/image/:dimensions/:quality/:filename').get(async (req, res) => {
	try {
		const { dimensions, quality, filename } = req.params;

		// Parse dimensions - Check if it's single value (like 150) or widthXheight (like 150x150)
		let width, height;
		if (dimensions.includes('x') || dimensions.includes('X')) {
			// If dimensions contain x or X, split into width and height
			[width, height] = dimensions.split(/x|X/).map(Number);
		} else {
			// If it's a single value, use it for both width and height
			width = height = Number(dimensions);
		}

		// Parse the quality
		const qualityPercentage = parseInt(quality, 10);
		if (isNaN(qualityPercentage) || qualityPercentage < 1 || qualityPercentage > 100) {
			return res.status(400).send('Invalid quality percentage. It should be between 1 and 100.');
		}

		// Construct the path to the image file
		const imagePath = path.join(IMAGE_DIR, filename);

		// Check if the file exists
		if (!fs.existsSync(imagePath)) {
			return res.status(404).send('Image not found');
		}

		// Process and resize the image using sharp
		const transformedImage = await sharp(imagePath)
			.resize(width, height) // Resize based on dimensions
			.jpeg({ quality: qualityPercentage }) // Set JPEG quality
			.toBuffer(); // Convert to buffer for sending in response

		// Set the content type to JPEG
		res.set('Content-Type', 'image/jpeg');
		res.send(transformedImage);

	} catch (error) {
		console.error(error);
		res.status(500).send('Internal Server Error');
	}
});

module.exports = router;