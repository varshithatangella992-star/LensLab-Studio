const express = require("express");
const router = express.Router();
const db = require("../config/database");

// ADD a new rental
router.post("/", (req, res) => {
    const {
        photographer_id,
        camera_id,
        rental_date,
        return_date
    } = req.body;

    // Validate required fields
    if (!photographer_id || !camera_id || !rental_date || !return_date) {
        return res.status(400).json({
            message: "Photographer ID, camera ID, rental date and return date are required"
        });
    }

    // Check date format
    const datePattern = /^\d{4}-\d{2}-\d{2}$/;

    if (!datePattern.test(rental_date) || !datePattern.test(return_date)) {
        return res.status(400).json({
            message: "Dates must be in YYYY-MM-DD format"
        });
    }

    if (return_date < rental_date) {
        return res.status(400).json({
            message: "Return date cannot be before rental date"
        });
    }

    // Check whether photographer exists
    db.get(
        "SELECT id FROM photographers WHERE id = ?",
        [photographer_id],
        (err, photographer) => {
            if (err) return res.status(500).json({ message: err.message });

            if (!photographer) {
                return res.status(404).json({
                    message: "Photographer not found"
                });
            }

            // Check whether camera exists
            db.get(
                "SELECT id FROM cameras WHERE id = ?",
                [camera_id],
                (err, camera) => {
                    if (err) return res.status(500).json({ message: err.message });

                    if (!camera) {
                        return res.status(404).json({
                            message: "Camera not found"
                        });
                    }

                    // Check for overlapping bookings
                    const sql = `
                        SELECT id FROM rentals
                        WHERE camera_id = ?
                        AND rental_date <= ?
                        AND return_date >= ?
                    `;

                    db.get(
                        sql,
                        [camera_id, return_date, rental_date],
                        (err, existingRental) => {
                            if (err) {
                                return res.status(500).json({ message: err.message });
                            }

                            if (existingRental) {
                                return res.status(409).json({
                                    message: "Camera is already booked for these dates"
                                });
                            }

                            // Add rental
                            db.run(
                                `INSERT INTO rentals
                                (photographer_id, camera_id, rental_date, return_date)
                                VALUES (?, ?, ?, ?)`,
                                [photographer_id, camera_id, rental_date, return_date],
                                function (err) {
                                    if (err) {
                                        return res.status(500).json({ message: err.message });
                                    }

                                    res.status(201).json({
                                        message: "Rental created successfully",
                                        rental_id: this.lastID
                                    });
                                }
                            );
                        }
                    );
                }
            );
        }
    );
});

// GET all rentals with photographer and camera details
router.get("/details", (req, res) => {
    const sql = `
        SELECT
            rentals.id,
            rentals.photographer_id,
            photographers.name AS photographer_name,
            rentals.camera_id,
            cameras.name AS camera_name,
            rentals.rental_date,
            rentals.return_date
        FROM rentals
        JOIN photographers
        ON rentals.photographer_id = photographers.id
        JOIN cameras
        ON rentals.camera_id = cameras.id
    `;

    db.all(sql, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ message: err.message });
        }

        res.status(200).json({
            message: "Rental details fetched successfully",
            data: rows
        });
    });
});
// GET all rentals
router.get("/", (req, res) => {
    db.all("SELECT * FROM rentals", [], (err, rows) => {
        if (err) {
            return res.status(500).json({
                message: err.message
            });
        }

        res.status(200).json({
            message: "Rentals fetched successfully",
            data: rows
        });
    });
});

// GET rental by ID
router.get("/:id", (req, res) => {
    const id = req.params.id;

    db.get(
        "SELECT * FROM rentals WHERE id = ?",
        [id],
        (err, row) => {
            if (err) {
                return res.status(500).json({
                    message: err.message
                });
            }

            if (!row) {
                return res.status(404).json({
                    message: "Rental not found"
                });
            }

            res.status(200).json({
                message: "Rental fetched successfully",
                data: row
            });
        }
    );
});

// DELETE rental
router.delete("/:id", (req, res) => {
    const id = req.params.id;

    db.run(
        "DELETE FROM rentals WHERE id = ?",
        [id],
        function (err) {
            if (err) {
                return res.status(500).json({
                    message: err.message
                });
            }

            if (this.changes === 0) {
                return res.status(404).json({
                    message: "Rental not found"
                });
            }

            res.status(200).json({
                message: "Rental deleted successfully"
            });
        }
    );
});

module.exports = router;