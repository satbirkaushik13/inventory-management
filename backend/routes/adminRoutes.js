const express = require('express');
const router = express.Router();
const db = require("../db"); // Import MySQL connection
const crypto = require('crypto');
const jwt = require("jsonwebtoken");
// Secret key for JWT (store this securely)
const JWT_SECRET = process.env.JWT_SECRET;

router.route("/").post((req, res) => {
	const { email, password } = req.body;

	// Validate input
	if (!email || !password) {
		return res.status(400).json({ message: "Email and password are required" });
	}

	// Query database for admin user
	const sql = "SELECT * FROM im_admin_users WHERE au_email = ?";
	db.query(sql, [email], (err, results) => {
		if (err) {
			console.error("❌ Database error:", err);
			return res.status(500).json({ message: "Database error" });
		}

		// If no user found
		if (results.length === 0) {
			return res.status(401).json({ message: "Invalid email or password", email });
		}

		// Compare hashed password
		const user = results[0];

		// Generate MD5 hash of the input password
		const inputHash = crypto.createHash('md5').update(password).digest('hex');
		if (inputHash !== user.au_password_hash) {
			return res.status(401).json({ message: "Invalid email or password" });
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
			message: "Login successful",
			token,
			user: userData,
		});
	});
});

module.exports = router;