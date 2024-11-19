const express = require('express');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const authRoutes = require('./authRoutes');
const authMiddleware = require('./authMiddleware'); // Middleware for protecting routes
const db = require('./db'); // Import the centralized database connection
const favoriteRoutes = require('./favorites');


const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json()); // Parse JSON requests

// Serve static images from the client/public/images directory
app.use('/images', express.static(path.join(__dirname, '../client/public/images')));

// Routes for authentication (login, register)
app.use('/api/auth', authRoutes);

// Routes for favorites
app.use('/api', favoriteRoutes);

// Simple root route
app.get('/', (req, res) => {
    res.send('Hello World!');
});

// Start server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});

// Protected route: Get all cheeses (requires authentication)
app.get('/api/cheeses', authMiddleware, (req, res) => {
    const sql = 'SELECT * FROM CheeseInfo';
    db.query(sql, (err, results) => {
        if (err) {
            res.status(500).send('Error retrieving cheeses from database');
            throw err;
        }
        res.json(results);
    });
});

// Protected route: Get a single cheese by ID (requires authentication)
app.get('/api/cheeses/:id', authMiddleware, (req, res) => {
    const cheeseId = req.params.id;
    const sql = 'SELECT * FROM CheeseInfo WHERE id = ?';
    db.query(sql, [cheeseId], (err, result) => {
        if (err) {
            res.status(500).send('Error retrieving cheese details');
            return;
        }
        res.json(result[0]);
    });
});

