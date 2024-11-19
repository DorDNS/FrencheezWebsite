const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();
const db = require('./db'); 
const SECRET_KEY = process.env.JWT_SECRET || 'your-secret-key';

// Register route
router.post('/register', async (req, res) => {
  const { full_name, username, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert the new user into the database
    db.query(
      'INSERT INTO Users (full_name, username, password_hash) VALUES (?, ?, ?)',
      [full_name, username, hashedPassword],
      (error, results) => {
        if (error) return res.status(500).send('User registration failed');

        // User registered successfully, now generate a token for automatic login
        const user = { id: results.insertId, username }; // Use the inserted ID and username
        const token = jwt.sign(user, SECRET_KEY, { expiresIn: '1h' });

        // Send the token back to the client
        res.json({ token });
      }
    );
  } catch (error) {
    res.status(500).send('Registration error');
  }
});

// Login route
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  db.query('SELECT * FROM Users WHERE username = ?', [username], async (error, results) => {
    if (error || results.length === 0) return res.status(400).send('User not found');

    const user = results[0];
    const validPassword = await bcrypt.compare(password, user.password_hash);

    if (!validPassword) return res.status(400).send('Invalid password');

    const token = jwt.sign({ id: user.id, username: user.username }, SECRET_KEY, { expiresIn: '1h' });
    res.json({ token });
  });
});

module.exports = router;
