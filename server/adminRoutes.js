const express = require("express");
const fs = require("fs");
const path = require("path");
const router = express.Router();
const { authMiddleware, adminMiddleware } = require("./authMiddleware");
const db = require("./db");

// Chemin du dossier contenant les fichiers JSON des quiz
const dataDir = path.join(__dirname, "../server/data");

// Routes existantes pour les utilisateurs
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

// ----------------------
// Routes pour gérer les fichiers JSON des quiz
// ----------------------

// Récupérer la liste des fichiers JSON
router.get("/quizzes", authMiddleware, adminMiddleware, (req, res) => {
  fs.readdir(dataDir, (err, files) => {
    if (err) return res.status(500).send("Error fetching quiz files");
    const quizzes = files.filter((file) => file.endsWith(".json")).map((file) => file.replace(".json", ""));
    res.json(quizzes);
  });
});

// Lire le contenu d'un fichier JSON spécifique
router.get("/quizzes/:quizId", authMiddleware, adminMiddleware, (req, res) => {
  const quizId = req.params.quizId;
  const filePath = path.join(dataDir, `${quizId}.json`);
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: "Quiz not found" });
  }

  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) return res.status(500).send("Error reading quiz file");
    res.json(JSON.parse(data));
  });
});

// Créer ou mettre à jour un fichier JSON de quiz
router.post("/quizzes", authMiddleware, adminMiddleware, (req, res) => {
  const { quizId, content } = req.body;
  if (!quizId || !content) {
    return res.status(400).send("Quiz ID and content are required");
  }
  const filePath = path.join(dataDir, `${quizId}.json`);
  fs.writeFile(filePath, JSON.stringify(content, null, 2), (err) => {
    if (err) return res.status(500).send("Error saving quiz file");
    res.send("Quiz saved successfully");
  });
});

// Supprimer un fichier JSON de quiz
router.delete("/quizzes/:quizId", authMiddleware, adminMiddleware, (req, res) => {
  const quizId = req.params.quizId;
  const filePath = path.join(dataDir, `${quizId}.json`);
  if (!fs.existsSync(filePath)) {
    return res.status(404).send("Quiz not found");
  }

  fs.unlink(filePath, (err) => {
    if (err) return res.status(500).send("Error deleting quiz file");
    res.send("Quiz deleted successfully");
  });
});

module.exports = router;
