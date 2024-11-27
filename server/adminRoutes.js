const express = require("express");
const router = express.Router();
const { authMiddleware, adminMiddleware } = require("./authMiddleware");
const db = require("./db");

router.get("/users", authMiddleware, adminMiddleware, (req, res) => {
  const sql = "SELECT id, username, full_name, admin FROM Users";
  db.query(sql, (err, results) => {
    if (err) return res.status(500).send("Error fetching users");
    res.json(results);
  });
});

router.post("/users", authMiddleware, adminMiddleware, (req, res) => {
  const { full_name, username, password } = req.body;
  const bcrypt = require("bcrypt");
  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) return res.status(500).send("Error creating user");
    const sql = "INSERT INTO Users (full_name, username, password_hash) VALUES (?, ?, ?)";
    db.query(sql, [full_name, username, hashedPassword], (err) => {
      if (err) return res.status(500).send("Error adding user");
      res.send("User added successfully");
    });
  });
});

router.delete("/users/:id", authMiddleware, adminMiddleware, (req, res) => {
  const sql = "DELETE FROM Users WHERE id = ?";
  db.query(sql, [req.params.id], (err) => {
    if (err) return res.status(500).send("Error deleting user");
    res.send("User deleted");
  });
});

router.patch("/users/:id", authMiddleware, adminMiddleware, (req, res) => {
  const sql = "UPDATE Users SET admin = ? WHERE id = ?";
  db.query(sql, [req.body.admin ? 1 : 0, req.params.id], (err) => {
    if (err) return res.status(500).send("Error updating admin status");
    res.send("Admin status updated");
  });
});

module.exports = router;