const { constants } = require("../constants");
const db = require("../db"); // Import MySQL connection
const crypto = require("crypto");
const { STATUS_CODES } = require("http");
const jwt = require("jsonwebtoken");
// Secret key for JWT (store this securely)
const JWT_SECRET = process.env.JWT_SECRET;

const login = (req, res, next) => {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
        res.status(400);
        return next(new Error("Email and password are required"));
    }

    // Query database for admin user
    const sql = "SELECT * FROM im_admin_users WHERE au_email = ?";
    db.query(sql, [email], (err, results) => {
        if (err) {
            res.status(500);
            return next(new Error("Database error"));
        }

        // If no user found
        if (results.length === 0) {
            res.status(401);
            return next(new Error("Invalid email or password"));
        }

        // Compare hashed password
        const user = results[0];

        // Generate MD5 hash of the input password
        const inputHash = crypto.createHash("md5").update(password).digest("hex");
        if (inputHash !== user.au_password_hash) {
            res.status(401);
            return next(new Error("Invalid email or password"));
        }

        // Generate JWT Token
        const token = jwt.sign(
            {
                id: user.au_id,
                email: user.au_email,
                role: user.au_role,
            },
            JWT_SECRET,
            { expiresIn: "1h" } // Token expires in 1 hour
        );

        // Update last login time
        const updateLoginTime = "UPDATE im_admin_users SET au_last_login = NOW() WHERE au_id = ?";
        db.query(updateLoginTime, [user.au_id]);

        // Exclude password before sending response
        const { au_password_hash, ...userData } = user;

        // Login successful
        res.json({
            statusCode: constants.HTTP_STATUS.OK,
            status: constants.TRUE,
            message: "Login successful",
            token,
            user: userData,
        });
    });
};

module.exports = {
    login,
};
