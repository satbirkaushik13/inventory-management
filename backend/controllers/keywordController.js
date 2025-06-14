const db = require("../db"); // Import MySQL connection
const { constants } = require("../constants"); // Import constants

const all = (req, res, next) => {
    let searchString = req.body.keyword_name || "";
    let sql = "SELECT * FROM im_keywords";
    let params = [];

    if (searchString.length > 0) {
        sql += " WHERE keyword_name LIKE ?";
        params.push(`%${searchString}%`); // Proper wildcard usage for LIKE
    }

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

        res.json({
            statusCode: constants.HTTP_STATUS.OK,
            status: constants.TRUE,
            message: results.length ? "Success" : "No data found",
            data: results,
        });
    });
};

const add = (req, res, next) => {
    let insertData = req.body;
    // Define sensitive columns that should NOT be updated
    const sensitiveColumn = "keyword_id";

    // Remove sensitive column from each object
    insertData = insertData.map((item) => {
        delete item[sensitiveColumn];
        return item;
    });

    // Ensure insertData is an array and not empty
    if (!Array.isArray(insertData) || insertData.length === 0) {
        res.status(400);
        return next(new Error("Invalid data format or empty data"));
    }

    // Extract only the "keyword_name" values
    const values = insertData.map((item) => [item.keyword_name]);

    // Create placeholders (?), for each row
    const placeholders = values.map(() => "(?)").join(", ");

    // Construct the SQL query
    const sql = `INSERT INTO im_keywords (keyword_name) VALUES ${placeholders}`;

    // Flatten values for query execution
    const flatValues = values.flat();

    // Execute the query
    db.query(sql, flatValues, (err, results) => {
        if (err) {
            console.error("❌ Database error:", err);
            res.status(500);
            return next(new Error("Database error"));
        }

        res.json({
            statusCode: constants.HTTP_STATUS.OK,
            status: constants.TRUE,
            message: "Keywords added successfully",
            insertedRows: results.affectedRows,
        });
    });
};

module.exports = {
    all,
    add,
};
