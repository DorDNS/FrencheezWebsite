const mysql = require('mysql2');

// Set up the database connection
const db = mysql.createConnection({
    user: 'root2',
    socketPath: '/Applications/MAMP/tmp/mysql/mysql.sock',
    database: 'frencheez',
});

// Connect to the database
db.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err);
        process.exit(1);
    } else {
        console.log('Connected to the database');
    }
});

module.exports = db;
