const express = require('express');
const path = require('path');
var cors = require('cors');
var bodyParser = require('body-parser');
const mysql = require('mysql2');

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json()); // for parsing application/json

// Update the static file path to serve images from client/public/images
app.use('/images', express.static(path.join(__dirname, '../client/public/images')));

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});

// Connect to the database
const db = mysql.createConnection({
    user: 'root2',
    socketPath: '/Applications/MAMP/tmp/mysql/mysql.sock',
    database: 'frencheez',
});

db.connect((err) => {
    if (err) throw err;
    console.log('Connected to database');
});

// Get all cheeses
app.get('/api/cheeses', (req, res) => {
    const sql = 'SELECT * FROM CheeseInfo';
    db.query(sql, (err, results) => {
        if (err) {
            res.status(500).send('Error retrieving cheeses from database');
            throw err;
        }
        res.json(results);
    });
});

// Get a single cheese by ID
app.get('/api/cheeses/:id', (req, res) => {
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
  