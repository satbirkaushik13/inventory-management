const db = require("../db"); // Import MySQL connection

const all = (req, res) => {
	let orderBy = req.query.orderBy || "category_id"; // Default order by category_id
	let params = [];
	let sql = `
		SELECT
			category_id,
			category_parent_id,
			category_name
		FROM im_categories
	`;

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

		if (results.length === 0) {
			return res.status(404).json({ message: "No category found." });
		}

		// Send formatted response
		res.json({
			message: "Success",
			data: results,
		});
	});
};

const add = (req, res) => {
	let categories = req.body;
	if (!Array.isArray(categories) || categories.length === 0) {
		return res.status(400).json({ message: "Invalid or empty categories array." });
	}

	let categoriesInsertQry = `
        INSERT INTO im_categories (category_name, category_parent_id) 
        VALUES ? 
        ON DUPLICATE KEY UPDATE category_name = VALUES(category_name), category_name = VALUES(category_name)
    `;

	let categoriesNamesArr = categories.map(category => [category.category_name, category.category_parent_id || 0]);
	if (!Array.isArray(categoriesNamesArr) || categoriesNamesArr.length === 0) {
		return res.status(400).json({ message: "Invalid or empty categories array." });
	}

	db.query(categoriesInsertQry, [categoriesNamesArr], (err, results) => {
		if (err) {
			console.error("❌ Linking Error:", err);
			return res.status(500).json({ message: "Database error while creating categories." });
		}

		res.json({
			message: "Categories added successsfully!",
			affectedRows: results.affectedRows
		});
	});
};

module.exports = {
    all,
    add
};