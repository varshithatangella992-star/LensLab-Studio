
const sqlite3 = require("sqlite3").verbose();
const path = require("path");

// Create database file inside the project
const dbPath = path.join(__dirname, "..", "database.db");

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error("Database connection failed:", err.message);
    } else {
        console.log("LensLab Studio database connected successfully");
    }
});

// Enable foreign key relationships
db.run("PRAGMA foreign_keys = ON");

// Create tables
db.serialize(() => {

    // Photographers table
    db.run(`
        CREATE TABLE IF NOT EXISTS photographers (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL UNIQUE,
            phone TEXT NOT NULL
        )
    `);

    // Cameras table
    db.run(`
        CREATE TABLE IF NOT EXISTS cameras (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            kind TEXT NOT NULL
        )
    `);

    // Rentals table
    db.run(`
        CREATE TABLE IF NOT EXISTS rentals (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            photographer_id INTEGER NOT NULL,
            camera_id INTEGER NOT NULL,
            rental_date TEXT NOT NULL,
            return_date TEXT NOT NULL,

            FOREIGN KEY (photographer_id)
                REFERENCES photographers(id),

            FOREIGN KEY (camera_id)
                REFERENCES cameras(id),

            CHECK (return_date >= rental_date)
        )
    `);

    console.log("All three database tables created successfully");
});

module.exports = db;
