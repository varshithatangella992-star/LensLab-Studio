
const express = require("express");
const router = express.Router();
const db = require("../config/database");

// GET all cameras and search by kind
router.get("/", (req, res) => {
    const { kind } = req.query;

    let sql = "SELECT * FROM cameras";
    let params = [];

    if (kind) {
        sql += " WHERE LOWER(kind) = LOWER(?)";
        params.push(kind);
    }

    db.all(sql, params, (err, rows) => {
        if (err) {
            return res.status(500).json({
                message: "Error fetching cameras",
                error: err.message
            });
        }

        res.status(200).json({
            message: "Cameras fetched successfully",
            data: rows
        });
    });
});

// GET camera summary by kind
router.get("/summary", (req, res) => {
    const sql = `
        SELECT kind, COUNT(*) AS count
        FROM cameras
        GROUP BY kind
    `;

    db.all(sql, [], (err, rows) => {
        if (err) {
            return res.status(500).json({
                message: "Error fetching camera summary",
                error: err.message
            });
        }

        res.status(200).json({
            message: "Camera summary fetched successfully",
            data: rows
        });
    });
});

// GET one camera
router.get("/:id", (req, res) => {
    const id = req.params.id;

    db.get(
        "SELECT * FROM cameras WHERE id = ?",
        [id],
        (err, row) => {
            if (err) {
                return res.status(500).json({
                    error: err.message
                });
            }

            if (!row) {
                return res.status(404).json({
                    message: "Camera not found"
                });
            }

            res.status(200).json({
                message: "Camera fetched successfully",
                data: row
            });
        }
    );
});

// ADD camera
router.post("/", (req, res) => {
    const { name, kind } = req.body;

    if (!name || !kind || !name.trim() || !kind.trim()) {
        return res.status(400).json({
            message: "Camera name and kind are required"
        });
    }

    db.run(
        "INSERT INTO cameras (name, kind) VALUES (?, ?)",
        [name.trim(), kind.trim()],
        function (err) {
            if (err) {
                return res.status(500).json({
                    message: "Error adding camera",
                    error: err.message
                });
            }

            res.status(201).json({
                message: "Camera added successfully",
                id: this.lastID
            });
        }
    );
});

// UPDATE camera
router.put("/:id", (req, res) => {
    const id = req.params.id;
    const { name, kind } = req.body;

    if (!name || !kind || !name.trim() || !kind.trim()) {
        return res.status(400).json({
            message: "Camera name and kind are required"
        });
    }

    db.run(
        "UPDATE cameras SET name = ?, kind = ? WHERE id = ?",
        [name.trim(), kind.trim(), id],
        function (err) {
            if (err) {
                return res.status(500).json({
                    message: "Error updating camera",
                    error: err.message
                });
            }

            if (this.changes === 0) {
                return res.status(404).json({
                    message: "Camera not found"
                });
            }

            res.status(200).json({
                message: "Camera updated successfully"
            });
        }
    );
});

// DELETE camera
router.delete("/:id", (req, res) => {
    const id = req.params.id;

    db.run(
        "DELETE FROM cameras WHERE id = ?",
        [id],
        function (err) {
            if (err) {
                return res.status(500).json({
                    message: "Cannot delete camera",
                    error: err.message
                });
            }

            if (this.changes === 0) {
                return res.status(404).json({
                    message: "Camera not found"
                });
            }

            res.status(200).json({
                message: "Camera deleted successfully"
            });
        }
    );
});

module.exports = router;
