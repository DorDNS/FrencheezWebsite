const express = require('express');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const authRoutes = require('./authRoutes');
const { authMiddleware, adminMiddleware } = require('./authMiddleware');
const db = require('./db');
const favoriteRoutes = require('./favorites');
const adminRoutes = require('./adminRoutes');
const quizRoutes = require('./quizRoutes');
const bcrypt = require('bcrypt');
const fs = require('fs');

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

// Serve JSON files statically (optional)
app.use('/data', express.static(path.join(__dirname, 'data')));

// Routes for authentication (login, register)
app.use('/api/auth', authRoutes);

// Routes for favorites
app.use('/api', favoriteRoutes);

// Routes for admin
app.use('/admin', adminRoutes);

// Routes for quizzes (dynamic JSON)
app.use('/api/quiz', quizRoutes);

// Serve uploaded images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Simple root route
app.get('/', (req, res) => {
    res.send('Hello World!');
});

// Get all cheeses
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

// Get a single cheese by ID
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

// User details route
app.get('/api/user', authMiddleware, (req, res) => {
    const sql = "SELECT id, username, full_name, admin FROM Users WHERE id = ?";
    db.query(sql, [req.user.id], (err, results) => {
        if (err) return res.status(500).send("Error fetching user details");
        if (results.length === 0) return res.status(404).send("User not found");
        res.json(results[0]); // Return the first result
    });
});

// Add a new cheese
app.post('/api/cheeses', authMiddleware, adminMiddleware, upload.single('image'), (req, res) => {
    const { name, region, type, milk_type, aging_period, flavor_profile, texture, serving_temperature, wine_pairing, bread_pairing, fruit_pairing } = req.body;
    const image_path = req.file ? `/uploads/${req.file.filename}` : null;
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
app.put('/api/cheeses/:id', authMiddleware, adminMiddleware, upload.single('image'), (req, res) => {
    const { id } = req.params;
    const { name, region, type, milk_type, aging_period, flavor_profile, texture, serving_temperature, wine_pairing, bread_pairing, fruit_pairing } = req.body;

    // Step 1: Fetch existing cheese details to get the current image path
    const fetchCheeseSql = 'SELECT image_path FROM CheeseInfo WHERE id = ?';
    db.query(fetchCheeseSql, [id], (err, results) => {
        if (err) {
            res.status(500).send('Error fetching cheese details');
            return;
        }

        if (results.length === 0) {
            res.status(404).send('Cheese not found');
            return;
        }

        const oldImagePath = results[0].image_path;
        let newImagePath = oldImagePath;

        // Step 2: Update the cheese details
        const updateParams = [
            name, region, type, milk_type, aging_period, flavor_profile, texture,
            serving_temperature, wine_pairing, bread_pairing, fruit_pairing
        ];
        let updateSql = `
            UPDATE CheeseInfo 
            SET name = ?, region = ?, type = ?, milk_type = ?, aging_period = ?, 
                flavor_profile = ?, texture = ?, serving_temperature = ?, wine_pairing = ?, 
                bread_pairing = ?, fruit_pairing = ?
        `;

        // Step 3: Handle new image upload if it exists
        if (req.file) {
            newImagePath = `/uploads/${req.file.filename}`;
            updateSql += ', image_path = ?';
            updateParams.push(newImagePath);
        }

        updateSql += ' WHERE id = ?';
        updateParams.push(id);

        // Execute update query
        db.query(updateSql, updateParams, (updateErr) => {
            if (updateErr) {
                res.status(500).send('Error updating cheese');
                return;
            }

            // Step 4: Delete old image if a new one was uploaded
            if (req.file && oldImagePath && oldImagePath !== newImagePath) {
                const absoluteOldImagePath = path.join(__dirname, oldImagePath);
                fs.unlink(absoluteOldImagePath, (unlinkErr) => {
                    if (unlinkErr) {
                        console.error('Error deleting old image:', unlinkErr);
                        // Log the error, but do not block the response
                    }
                });
            }

            res.status(200).send('Cheese updated successfully');
        });
    });
});

// Delete a cheese
app.delete('/api/cheeses/:id', authMiddleware, adminMiddleware, (req, res) => {
    const { id } = req.params;

    // Step 1: Fetch the cheese to get the image path
    const fetchCheeseSql = 'SELECT image_path FROM CheeseInfo WHERE id = ?';
    db.query(fetchCheeseSql, [id], (err, results) => {
        if (err) {
            res.status(500).send('Error fetching cheese details');
            return;
        }

        if (results.length === 0) {
            res.status(404).send('Cheese not found');
            return;
        }

        const imagePath = results[0].image_path;

        // Step 2: Delete the cheese from the database
        const deleteCheeseSql = 'DELETE FROM CheeseInfo WHERE id = ?';
        db.query(deleteCheeseSql, [id], (deleteErr) => {
            if (deleteErr) {
                res.status(500).send('Error deleting cheese');
                return;
            }

            // Step 3: Delete the associated file from the server
            if (imagePath) {
                const absolutePath = path.join(__dirname, imagePath);
                fs.unlink(absolutePath, (unlinkErr) => {
                    if (unlinkErr) {
                        console.error('Error deleting file:', unlinkErr);
                        // Log the error, but do not block the response
                    }
                });
            }

            res.send('Cheese deleted successfully');
        });
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Start server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
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

    try {
    let query = `
        UPDATE Users
        SET full_name = ?, username = ?, description = ?`;
    const params = [full_name, username, description];

    if (password) {
        const hashedPassword = await bcrypt.hash(password, 10);
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

app.get("/api/user/progress", authMiddleware, (req, res) => {
    const userId = req.user.id;
    const query = `
      SELECT 
        u.full_name, 
        u.username, 
        u.description,
        p.progress_percentage 
      FROM Users u
      JOIN UserProgress p ON u.id = p.user_id
      WHERE u.id = ?;
    `;
    db.query(query, [userId], (err, results) => {
      if (err) {
        console.error("Error fetching user progress:", err);
        res.status(500).json({ error: "Internal server error" });
        return;
      }
      if (results.length === 0) {
        res.status(404).json({ error: "User not found" });
        return;
      }
      res.json(results[0]);
    });
});
  
