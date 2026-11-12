const express = require("express");
const router = express.Router();
const db = require("../config/database");

// Get all photographers
router.get("/", (req, res) => {
    db.all("SELECT * FROM photographers", [], (err, rows) => {
        if (err) {
            return res.status(500).json({ message: err.message });
        }
        res.status(200).json(rows);
    });
});

// Get photographer by ID
router.get("/:id", (req, res) => {
    db.get(
        "SELECT * FROM photographers WHERE id = ?",
        [req.params.id],
        (err, row) => {
            if (err) {
                return res.status(500).json({ message: err.message });
            }
            if (!row) {
                return res.status(404).json({ message: "Photographer not found" });
            }
            res.status(200).json(row);
        }
    );
});

// ADD photographer
router.post("/", (req, res) => {
    const { name, email, phone } = req.body;

    if (!name || !email || !phone ||
        !name.trim() || !email.trim() || !phone.trim()) {
        return res.status(400).json({
            message: "Name, email and phone are required"
        });
    }

    db.run(
        "INSERT INTO photographers (name, email, phone) VALUES (?, ?, ?)",
        [name.trim(), email.trim(), phone.trim()],
        function (err) {
            if (err) {
                if (err.message.includes("UNIQUE")) {
                    return res.status(409).json({
                        message: "Email already exists"
                    });
                }

                return res.status(500).json({
                    message: err.message
                });
            }

            res.status(201).json({
                message: "Photographer added successfully",
                id: this.lastID
            });
        }
    );
});

// UPDATE photographer
router.put("/:id", (req, res) => {
    const { name, email, phone } = req.body;
    const id = req.params.id;

    if (!name || !email || !phone ||
        !name.trim() || !email.trim() || !phone.trim()) {
        return res.status(400).json({
            message: "Name, email and phone are required"
        });
    }

    db.run(
        "UPDATE photographers SET name = ?, email = ?, phone = ? WHERE id = ?",
        [name.trim(), email.trim(), phone.trim(), id],
        function (err) {
            if (err) {
                if (err.message.includes("UNIQUE")) {
                    return res.status(409).json({
                        message: "Email already exists"
                    });
                }

                return res.status(500).json({
                    message: err.message
                });
            }

            if (this.changes === 0) {
                return res.status(404).json({
                    message: "Photographer not found"
                });
            }

            res.status(200).json({
                message: "Photographer updated successfully"
            });
        }
    );
});

// DELETE photographer
router.delete("/:id", (req, res) => {
    const id = req.params.id;

    db.run(
        "DELETE FROM photographers WHERE id = ?",
        [id],
        function (err) {
            if (err) {
                return res.status(500).json({ message: err.message });
            }

            if (this.changes === 0) {
                return res.status(404).json({
                    message: "Photographer not found"
                });
            }

            res.status(200).json({
                message: "Photographer deleted successfully"
            });
        }
    );
});

module.exports = router;