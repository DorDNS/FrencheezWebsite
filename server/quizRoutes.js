const express = require("express");
const fs = require("fs");
const path = require("path");
const db = require("./db"); // Import de la base de données
const { authMiddleware } = require("./authMiddleware"); // Middleware d'authentification

const router = express.Router();
const dataDir = path.join(__dirname, "../server/data"); // Chemin vers le dossier contenant les fichiers JSON

// Liste des quiz autorisés (pour validation)
const allowedQuizzes = ["basic-knowledge", "tasting-cheese", "pairing-cheese"];

// Route pour obtenir les questions d'un quiz spécifique
router.get("/:quizId", (req, res) => {
const quizId = req.params.quizId;

// Vérifier si le quizId est valide
if (!allowedQuizzes.includes(quizId)) {
    return res.status(400).json({ error: "Invalid quiz ID" });
}

const filePath = path.join(dataDir, `${quizId}.json`);

// Vérifier si le fichier existe
if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: "Quiz not found" });
}

// Lire et envoyer les données JSON
fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
    console.error("Error reading quiz file:", err);
    return res.status(500).json({ error: "Failed to read quiz data" });
    }
    res.json(JSON.parse(data));
});
});

// Nouvelle route pour récupérer le meilleur score de l'utilisateur pour un quiz spécifique
router.get("/:quizId/best-score", authMiddleware, (req, res) => {
const quizId = req.params.quizId;
const userId = req.user.id;

// Valider si le quizId est autorisé
if (!allowedQuizzes.includes(quizId)) {
    return res.status(400).json({ error: "Invalid quiz ID" });
}

// Construire le nom de la colonne pour le quiz
const columnName = `best_score_${quizId.replace(/-/g, "_")}`;

// Vérifier si la colonne existe et récupérer le score
const query = `
    SELECT COALESCE(${columnName}, 0) AS best_score
    FROM userprogress
    WHERE id = ?
`;

db.query(query, [userId], (err, results) => {
    if (err) {
    console.error("Error fetching best score:", err);
    return res.status(500).json({ error: "Error fetching best score" });
    }

    if (results.length === 0) {
    return res.status(404).json({ error: "User not found" });
    }

    const bestScore = results[0].best_score;
    res.json({ best_score: bestScore });
});
});

// Route pour mettre à jour le meilleur score de l'utilisateur
router.post("/update-score", authMiddleware, (req, res) => {
const { quizName, score } = req.body; // Assurez-vous que le client envoie ces champs
const userId = req.user.id;

if (!quizName || score === undefined) {
    console.error("Quiz name or score is missing");
    return res.status(400).json({ error: "Quiz name and score are required" });
}

// Vérifier si le quizName est valide
if (!allowedQuizzes.includes(quizName)) {
    return res.status(400).json({ error: "Invalid quiz name" });
}

const columnName = `best_score_${quizName.replace(/-/g, "_")}`;

const query = `
    UPDATE userprogress
    SET ${columnName} = GREATEST(${columnName}, ?)
    WHERE id = ?
`;

db.query(query, [score, userId], (err) => {
    if (err) {
    console.error("Error updating score:", err);
    return res.status(500).json({ error: "Error updating score" });
    }

    res.json({ message: "Best score updated successfully" });
});
});

module.exports = router;
