const express = require('express');
const router = express.Router();
const authMiddleware = require('./authMiddleware');
const db = require('./db');

// Add a favorite
router.post('/favorites', authMiddleware, (req, res) => {
  const { cheeseId } = req.body;
  if (!cheeseId) {
    res.status(400).send('Missing cheeseId');
    return;
  }

  const sql = 'INSERT INTO UserFavorites (user_id, cheese_id) VALUES (?, ?)';
  db.query(sql, [req.user.id, cheeseId], (err) => {
    if (err) {
      console.error('Error adding favorite:', err);
      res.status(500).send('Error adding favorite');
      return;
    }
    res.status(201).send('Favorite added successfully');
  });
});

// Remove a favorite
router.delete('/favorites/:cheeseId', authMiddleware, (req, res) => {
  const cheeseId = req.params.cheeseId;
  const sql = 'DELETE FROM UserFavorites WHERE user_id = ? AND cheese_id = ?';
  db.query(sql, [req.user.id, cheeseId], (err) => {
    if (err) {
      console.error('Error removing favorite:', err);
      res.status(500).send('Error removing favorite');
      return;
    }
    res.send('Favorite removed successfully');
  });
});

// Fetch user favorites with cheese details
router.get('/favorites', authMiddleware, (req, res) => {
  const sql = `
  SELECT 
    UserFavorites.cheese_id, 
    CheeseInfo.name, 
    CheeseInfo.image_path
  FROM 
    UserFavorites
  INNER JOIN 
    CheeseInfo 
  ON 
    UserFavorites.cheese_id = CheeseInfo.id
  WHERE 
    UserFavorites.user_id = ?
  `;
  db.query(sql, [req.user.id], (err, results) => {
    if (err) {
      res.status(500).send('Error retrieving favorites');
      return;
    }
    
    res.json(results);
  });
});

module.exports = router;