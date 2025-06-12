const db = require("../db"); // Import MySQL connection
const { constants } = require("../constants"); // Import constants

const all = (req, res, next) => {
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
            res.status(500);
            return next(new Error("Database error"));
        }

        if (results.length === 0) {
            res.status(404);
            return next(new Error("No category found."));
        }

        // Send formatted response
        res.json({
            statusCode: constants.HTTP_STATUS.OK,
            status: constants.TRUE,
            message: "Success",
            data: results,
        });
    });
};

const add = (req, res, next) => {
    let categories = req.body;
    if (!Array.isArray(categories) || categories.length === 0) {
        res.status(400);
        return next(new Error("Invalid or empty categories array."));
    }

    let categoriesInsertQry = `
        INSERT INTO im_categories (category_name, category_parent_id) 
        VALUES ? 
        ON DUPLICATE KEY UPDATE category_name = VALUES(category_name), category_name = VALUES(category_name)
    `;

    let categoriesNamesArr = categories.map((category) => [category.category_name, category.category_parent_id || 0]);
    if (!Array.isArray(categoriesNamesArr) || categoriesNamesArr.length === 0) {
        res.status(400);
        return next(new Error("Invalid or empty categories array."));
    }

    db.query(categoriesInsertQry, [categoriesNamesArr], (err, results) => {
        if (err) {
            console.error("❌ Linking Error:", err);
            res.status(500);
            return next(new Error("Database error while creating categories."));
        }

        res.json({
            statusCode: constants.HTTP_STATUS.OK,
            status: constants.TRUE,
            message: "Categories added successsfully!",
            affectedRows: results.affectedRows,
        });
    });
};

module.exports = {
    all,
    add,
};
