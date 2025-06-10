const express = require("express");
const cors = require("cors");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const path = require("path");
// Secret key for JWT (store this securely)
const JWT_SECRET = process.env.JWT_SECRET;

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
	res.send("Inventory Management API is running...");
});

// Serve the "uploads" directory as a static folder
const IMAGE_DIR = path.join(__dirname, "uploads", "images");

// Display orignal image
app.use('/items/image', express.static(IMAGE_DIR));

// ✅ Middleware to Verify JWT Token
const authenticateToken = (req, res, next) => {
	const token = req.header("Authorization");
	if (!token) {
		return res.status(401).json({ message: "Access denied. No token provided." });
	}

	// Verify token
	jwt.verify(token.replace("Bearer ", ""), JWT_SECRET, (err, user) => {
		if (err) {
			return res.status(403).json({ message: "Invalid or expired token" });
		}
		console.log(user);
		// req.user = user; // Attach user data to request/
		next();
	});
};

// Sample route to fetch users from MySQL
app.use("/admin/login", require("./routes/adminRoutes"));

// Items Management Routes
app.use("/items", authenticateToken, require("./routes/itemsRoutes"));

// Keywords Management Routes
app.use("/keywords", authenticateToken, require("./routes/keywordsRoutes"));

// Categories Management Routes
app.use("/categories", authenticateToken, require("./routes/categoriesRoute"));
// Brands Management Routes
app.use("/brands", authenticateToken, require("./routes/brandsRoutes"));

const PORT = process.env.PORT || 5050;
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
