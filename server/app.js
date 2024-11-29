const express = require('express');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const authRoutes = require('./authRoutes');
const { authMiddleware } = require('./authMiddleware'); // Middleware for protecting routes
const db = require('./db'); // Import the centralized database connection
const favoriteRoutes = require('./favorites');
const adminRoutes = require('./adminRoutes');
const multer = require('multer');
const bcrypt = require('bcrypt');

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`);
    }
  });
  const upload = multer({ storage });

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

// Routes for admin
app.use('/api/admin', adminRoutes);

// Serve uploaded images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

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

app.get("/api/user", authMiddleware, (req, res) => {
    const sql = "SELECT id, username, full_name, admin FROM Users WHERE id = ?";
    db.query(sql, [req.user.id], (err, results) => {
      if (err) return res.status(500).send("Error fetching user details");
      if (results.length === 0) return res.status(404).send("User not found");
      res.json(results[0]); // Return the first result
    });
  });

// Add a new cheese
app.post('/api/cheeses', authMiddleware, upload.single('image'), (req, res) => {
    const { name, region, type, milk_type, aging_period, flavor_profile, texture, serving_temperature, wine_pairing, bread_pairing, fruit_pairing } = req.body;
    const image_path = `/uploads/${req.file.filename}`;
    const sql = 'INSERT INTO CheeseInfo (name, region, type, milk_type, aging_period, flavor_profile, texture, serving_temperature, wine_pairing, bread_pairing, fruit_pairing, image_path) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    db.query(sql, [name, region, type, milk_type, aging_period, flavor_profile, texture, serving_temperature, wine_pairing, bread_pairing, fruit_pairing, image_path], (err) => {
      if (err) {
        res.status(500).send('Error adding cheese');
        throw err;
      }
      res.status(201).send('Cheese added successfully');
    });
});

// Update a cheese
app.put('/api/cheeses/:id', authMiddleware, upload.single('image'), (req, res) => {
    const { id } = req.params;
    const { name, region, type, milk_type, aging_period, flavor_profile, texture, serving_temperature, wine_pairing, bread_pairing, fruit_pairing } = req.body;
    let sql = 'UPDATE CheeseInfo SET name = ?, region = ?, type = ?, milk_type = ?, aging_period = ?, flavor_profile = ?, texture = ?, serving_temperature = ?, wine_pairing = ?, bread_pairing = ?, fruit_pairing = ?';
    const params = [name, region, type, milk_type, aging_period, flavor_profile, texture, serving_temperature, wine_pairing, bread_pairing, fruit_pairing];
    if (req.file) {
        const image_path = `/uploads/${req.file.filename}`;
        sql += ', image_path = ?';
        params.push(image_path);
    }
    sql += ' WHERE id = ?';
    params.push(id);
    db.query(sql, params, (err) => {
        if (err) {
            res.status(500).send('Error updating cheese');
            throw err;
        }
        res.send('Cheese updated successfully');
    });
});

// Delete a cheese
app.delete('/api/cheeses/:id', authMiddleware, (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM CheeseInfo WHERE id = ?';
    db.query(sql, [id], (err) => {
      if (err) {
        res.status(500).send('Error deleting cheese');
        throw err;
      }
      res.send('Cheese deleted successfully');
    });
});

// Get user profile
app.get('/api/user/profile', authMiddleware, (req, res) => {
  const userId = req.user.id; 

  const query = 'SELECT username, full_name, description FROM Users WHERE id = ?';
  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error('Error fetching user profile:', err);
      return res.status(500).json({ error: 'Failed to fetch user profile' });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = results[0];
    res.json({
      full_name: user.full_name,
      username: user.username,
      description: user.description,
    });
  });
});

// Update user profile
app.put('/api/user/profile', authMiddleware, async (req, res) => {
  const userId = req.user.id;
  const { full_name, username, description, password } = req.body;

  console.log('Received data:', { full_name, username, description, password }); // Debug log

  try {
    let query = `
      UPDATE Users
      SET full_name = ?, username = ?, description = ?`;
    const params = [full_name, username, description];

    if (password) {
      console.log('Hashing password...'); // Debug log
      const hashedPassword = await bcrypt.hash(password, 10);
      console.log('Hashed password:', hashedPassword); // Debug log
      query += `, password_hash = ?`;
      params.push(hashedPassword);
    }

    query += ` WHERE id = ?`;
    params.push(userId);

    db.query(query, params, (err, results) => {
      if (err) {
        console.error('Error updating user profile:', err);
        return res.status(500).json({ error: 'Failed to update profile' });
      }

      if (results.affectedRows === 0) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.json({ message: 'Profile updated successfully' });
    });
  } catch (error) {
    console.error('Error hashing password:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});
