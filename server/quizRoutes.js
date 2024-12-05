const express = require("express");
const fs = require("fs");
const path = require("path");
const db = require("./db"); // Import de la base de données
const { authMiddleware } = require("./authMiddleware"); // Middleware d'authentification

const router = express.Router();
const dataDir = path.join(__dirname, "../server/data"); // Chemin vers le dossier contenant les fichiers JSON

// Liste des quiz autorisés (pour validation)
const allowedQuizzes = ["basic-knowledge", "tasting-cheese", "pairing-cheese"];

function getTotalQuestions(quizName) {
    const filePath = path.join(dataDir, `${quizName}.json`);
    if (!fs.existsSync(filePath)) {
        throw new Error(`Quiz file not found: ${filePath}`);
    }

    const data = JSON.parse(fs.readFileSync(filePath, "utf8"));
    // Accès au tableau "quizz" pour compter les questions
    if (!data.quizz || !Array.isArray(data.quizz)) {
        throw new Error(`Invalid quiz structure in ${quizName}.json`);
    }

    return data.quizz.length; // Retourne le nombre total de questions
}
// Route pour obtenir les questions d'un quiz spécifique
router.get("/:quizId", (req, res) => {
    const quizId = req.params.quizId;

    if (!allowedQuizzes.includes(quizId)) {
        return res.status(400).json({ error: "Invalid quiz ID" });
    }

    const filePath = path.join(dataDir, `${quizId}.json`);

    if (!fs.existsSync(filePath)) {
        return res.status(404).json({ error: "Quiz not found" });
    }

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

    if (!allowedQuizzes.includes(quizId)) {
        return res.status(400).json({ error: "Invalid quiz ID" });
    }

    const columnName = `best_score_${quizId.replace(/-/g, "_")}`;
    const query = `
        SELECT COALESCE(${columnName}, 0) AS best_score
        FROM userprogress
        WHERE user_id = ?
    `;

    db.query(query, [userId], (err, results) => {
        if (err) {
            console.error("Error fetching best score:", err);
            return res.status(500).json({ error: "Error fetching best score" });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }

        res.json({ best_score: results[0].best_score });
    });
});

// Route pour mettre à jour le meilleur score et le pourcentage de progression
router.post("/update-score", authMiddleware, async (req, res) => {
    const { quizName, score } = req.body;
    const userId = req.user.id;

    if (!quizName || score === undefined) {
        return res.status(400).json({ error: "Quiz name and score are required" });
    }

    if (!allowedQuizzes.includes(quizName)) {
        return res.status(400).json({ error: "Invalid quiz name" });
    }

    const columnName = `best_score_${quizName.replace(/-/g, "_")}`;
    const updateScoreQuery = `
        UPDATE userprogress
        SET ${columnName} = GREATEST(${columnName}, ?)
        WHERE user_id = ?
    `;

    db.query(updateScoreQuery, [score, userId], async (err) => {
        if (err) {
            console.error("Error updating score:", err);
            return res.status(500).json({ error: "Error updating score" });
        }

        try {
            const totalQuestions =
                getTotalQuestions("basic-knowledge") +
                getTotalQuestions("pairing-cheese") +
                getTotalQuestions("tasting-cheese");

            const scoresQuery = `
                SELECT 
                    best_score_basic_knowledge, 
                    best_score_pairing_cheese, 
                    best_score_tasting_cheese 
                FROM userprogress
                WHERE user_id = ?
            `;

            db.query(scoresQuery, [userId], (err, results) => {
                if (err || results.length === 0) {
                    console.error("Error fetching scores:", err);
                    return res.status(500).json({ error: "Error fetching user progress" });
                }

                const { best_score_basic_knowledge, best_score_pairing_cheese, best_score_tasting_cheese } = results[0];
                const totalScore = best_score_basic_knowledge + best_score_pairing_cheese + best_score_tasting_cheese;

                const progressPercentage = Math.round((totalScore / totalQuestions) * 100);

                const updateProgressQuery = `
                    UPDATE userprogress
                    SET progress_percentage = ?
                    WHERE user_id = ?
                `;

                db.query(updateProgressQuery, [progressPercentage, userId], (err) => {
                    if (err) {
                        console.error("Error updating progress percentage:", err);
                        return res.status(500).json({ error: "Error updating progress percentage" });
                    }

                    res.json({ message: "Score and progress percentage updated successfully" });
                });
            });
        } catch (error) {
            console.error("Error calculating progress percentage:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    });
});

module.exports = router;
