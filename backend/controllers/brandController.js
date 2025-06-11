
const db = require("../db"); // Import MySQL connection

const all = (req, res) => {
	let searchString = req.body.brand_name || "";
	let orderBy = req.body.orderBy || "brand_id"; // Default order by brand_id
	let sql = "SELECT * FROM im_brands";
	let params = [];

	if (searchString.length > 0) {
		sql += " WHERE brand_name LIKE ?";
		params.push(`%${searchString}%`); // Proper wildcard usage for LIKE
	}
	sql += ` ORDER BY ${orderBy} ASC`; // Order by specified column
	sql += " LIMIT ?, ?";
	const page = parseInt(req.body.page) || 1;
	const pageSize = parseInt(req.body.pageSize) || 10;
	const offset = (page - 1) * pageSize;
	params.push(offset, pageSize);

	db.query(sql, params, (err, results) => {
		if (err) {
			console.error("❌ Database error:", err);
			return res.status(500).json({ message: "Database error" });
		}

		res.json({
			message: results.length ? "Success" : "No data found",
			data: results,
		});
	});
};

const add = (req, res) => {
	let insertData = req.body;
	// Define sensitive columns that should NOT be updated
	const sensitiveColumn = "brand_id";

	// Remove sensitive column from each object
	insertData = insertData.map(item => {
		delete item[sensitiveColumn];
		return item;
	});

	// Ensure insertData is an array and not empty
	if (!Array.isArray(insertData) || insertData.length === 0) {
		return res.status(400).json({ message: "Invalid data format or empty data" });
	}

	// Extract only the "brand_name" values
	const values = insertData.map(brand => [brand.brand_name]);

	// Create placeholders (?), for each row
	const placeholders = values.map(() => "(?)").join(", ");

	// Construct the SQL query
	const sql = `INSERT INTO im_brands (brand_name) VALUES ${placeholders} 
             ON DUPLICATE KEY UPDATE brand_name = VALUES(brand_name)`;

	// Flatten values for query execution
	const flatValues = values.flat();

	// Execute the query
	db.query(sql, flatValues, (err, results) => {
		if (err) {
			console.error("❌ Database error:", err);
			return res.status(500).json({ message: "Database error" });
		}

		res.json({
			message: "Brand`s added successfully",
			insertedRows: results.affectedRows
		});
	});
};

module.exports = {
    all,
	add
};