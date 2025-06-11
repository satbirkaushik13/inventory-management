const express = require("express");
const cors = require("cors");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const path = require("path");

const fs = require("fs");
const sharp = require("sharp");
const errorHandler = require("./middleware/errorHandler");
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
app.use("/items/image", express.static(IMAGE_DIR));
// Display customized image
app.get("/items/image/:dimensions/:quality/:filename", async (req, res, next) => {
    try {
        const { dimensions, quality, filename } = req.params;

        // Parse dimensions - Check if it's single value (like 150) or widthXheight (like 150x150)
        let width, height;
        if (dimensions.includes("x") || dimensions.includes("X")) {
            // If dimensions contain x or X, split into width and height
            [width, height] = dimensions.split(/x|X/).map(Number);
        } else {
            // If it's a single value, use it for both width and height
            width = height = Number(dimensions);
        }

        // Parse the quality
        const qualityPercentage = parseInt(quality, 10);
        if (isNaN(qualityPercentage) || qualityPercentage < 1 || qualityPercentage > 100) {
            res.status(400);
            return next(new Error("Invalid quality percentage. It should be between 1 and 100."));
        }

        // Construct the path to the image file
        const imagePath = path.join(IMAGE_DIR, filename);

        // Check if the file exists
        if (!fs.existsSync(imagePath)) {
            res.status(404);
            return next(new Error("Image not found"));
        }

        // Process and resize the image using sharp
        const transformedImage = await sharp(imagePath)
            .resize(width, height) // Resize based on dimensions
            .jpeg({ quality: qualityPercentage }) // Set JPEG quality
            .toBuffer(); // Convert to buffer for sending in response

        // Set the content type to JPEG
        res.set("Content-Type", "image/jpeg");
        res.send(transformedImage);
    } catch (error) {
        console.error(error);
        res.status(500);
        return next(new Error("Internal Server Error"));
    }
});

// ✅ Middleware to Verify JWT Token
const authenticateToken = (req, res, next) => {
    const token = req.header("Authorization");
    if (!token) {
        res.status(401);
        return next(new Error("Access denied. No token provided."));
    }

    // Verify token
    jwt.verify(token.replace("Bearer ", ""), JWT_SECRET, (err, user) => {
        if (err) {
            res.status(403);
            return next(new Error("Invalid or expired token"));
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

// Error Handling Middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5050;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
