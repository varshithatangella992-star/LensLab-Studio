
const express = require("express");
const db = require("./config/database");

// Import route files
const photographerRoutes = require("./routes/photographers");
const cameraRoutes = require("./routes/cameras");
const rentalRoutes = require("./routes/rentals");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Main routes
app.use("/photographers", photographerRoutes);
app.use("/cameras", cameraRoutes);
app.use("/rentals", rentalRoutes);
// Home route
app.get("/", (req, res) => {
    res.status(200).json({
        message: "Welcome to LensLab Studio",
        description: "Camera Rental Management System",
        status: "Server is running successfully"
    });
});

// Health check route
app.get("/health", (req, res) => {
    res.status(200).json({
        message: "LensLab Studio API is working",
        status: "OK"
    });
});

// Handle invalid routes
app.use((req, res) => {
    res.status(404).json({
        message: "Route not found"
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`LensLab Studio server running on port ${PORT}`);
});
