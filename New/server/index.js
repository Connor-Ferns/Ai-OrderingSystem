const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// Database connection
const db = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'orderingSystemDB'
});

// Use Object.assign instead of util._extend
const dbConfig = Object.assign({}, {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'orderingSystemDB'
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to database');
});

// Registration endpoint
app.post('/api/register', async (req, res) => {
  const { username, password } = req.body;

  // Validate input
  if (!username || !password) {
    return res.status(400).json({ error: 'Please fill in all fields' });
  }

  // Check if username exists
  const checkUser = 'SELECT id FROM users WHERE username = ?';
  db.query(checkUser, [username], async (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Error checking username' });
    }

    if (results.length > 0) {
      return res.status(400).json({ error: 'This username is already taken' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user
    const insertUser = 'INSERT INTO users (username, password, role) VALUES (?, ?, "user")';
    db.query(insertUser, [username, hashedPassword], (err, result) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Error creating user' });
      }

      res.json({ success: true, message: 'Registration successful' });
    });
  });
});

// Update login endpoint to include role
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  const query = 'SELECT * FROM users WHERE username = ?';
  db.query(query, [username], async (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Error during login' });
    }

    if (results.length === 0) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const user = results[0];
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (passwordMatch) {
      res.json({ 
        success: true, 
        username: user.username,
        id: user.id,
        role: user.role
      });
    } else {
      res.status(401).json({ error: 'Invalid username or password' });
    }
  });
});

// Get food stock
app.get('/api/food-stock', (req, res) => {
  const query = 'SELECT * FROM food_stock';
  db.query(query, (err, results) => {
    if (err) {
      res.status(500).json({ error: 'Error fetching food stock' });
      return;
    }
    res.json(results);
  });
});

// Check and order food stock
app.post('/api/order-stock', (req, res) => {
  const query = 'SELECT * FROM food_stock WHERE quantity <= min_threshold';
  db.query(query, (err, results) => {
    if (err) {
      res.status(500).json({ error: 'Error checking stock' });
      return;
    }
    
    // Process orders for items below threshold
    const orders = [];
    const updatePromises = results.map(item => {
      return new Promise((resolve, reject) => {
        const quantityToOrder = item.items_per_box;
        const newQuantity = item.quantity + quantityToOrder;
        
        // Update the quantity in the database
        const updateQuery = 'UPDATE food_stock SET quantity = ? WHERE id = ?';
        db.query(updateQuery, [newQuantity, item.id], (updateErr) => {
          if (updateErr) {
            reject(updateErr);
            return;
          }
          
          orders.push({
            item_name: item.item_name,
            quantity_to_order: quantityToOrder
          });
          resolve();
        });
      });
    });

    // Wait for all updates to complete
    Promise.all(updatePromises)
      .then(() => {
        res.json({ orders });
      })
      .catch(error => {
        console.error('Error updating stock:', error);
        res.status(500).json({ error: 'Error updating stock quantities' });
      });
  });
});

// Add middleware to check admin role
const requireAdmin = (req, res, next) => {
  const user = req.headers.authorization;
  if (!user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const userData = JSON.parse(user);
    if (userData.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid authorization' });
  }
};

// Add admin-only endpoint example
app.post('/api/admin/update-stock', requireAdmin, (req, res) => {
  // Admin only functionality here
});

// Get all users (admin only)
app.get('/api/admin/users', (req, res) => {
  // Get user info from authorization header
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: 'No authorization header' });
  }

  try {
    const user = JSON.parse(authHeader);
    if (user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    // Fetch all users except passwords (removed created_at)
    const query = 'SELECT id, username, role FROM users';
    db.query(query, (err, results) => {
      if (err) {
        console.error('Error fetching users:', err);
        return res.status(500).json({ error: 'Error fetching users' });
      }
      res.json(results);
    });
  } catch (err) {
    res.status(401).json({ error: 'Invalid authorization' });
  }
});

// Delete user (admin only)
app.delete('/api/admin/users/:id', requireAdmin, (req, res) => {
  const userId = req.params.id;
  const adminUser = JSON.parse(req.headers.authorization);

  // Prevent admin from deleting themselves
  if (userId === adminUser.id.toString()) {
    return res.status(400).json({ error: 'Cannot delete your own account' });
  }

  const query = 'DELETE FROM users WHERE id = ?';
  db.query(query, [userId], (err, result) => {
    if (err) {
      console.error('Error deleting user:', err);
      return res.status(500).json({ error: 'Error deleting user' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ message: 'User deleted successfully' });
  });
});

// Update user (admin only)
app.put('/api/admin/users/:id', requireAdmin, (req, res) => {
  const userId = req.params.id;
  const { username, role } = req.body;
  const adminUser = JSON.parse(req.headers.authorization);

  // Validate input
  if (!username || !role) {
    return res.status(400).json({ error: 'Username and role are required' });
  }

  // Prevent admin from removing their own admin rights
  if (userId === adminUser.id.toString() && role !== 'admin') {
    return res.status(400).json({ error: 'Cannot remove your own admin rights' });
  }

  // Check if username already exists (excluding current user)
  const checkQuery = 'SELECT id FROM users WHERE username = ? AND id != ?';
  db.query(checkQuery, [username, userId], (checkErr, checkResults) => {
    if (checkErr) {
      console.error('Error checking username:', checkErr);
      return res.status(500).json({ error: 'Error updating user' });
    }

    if (checkResults.length > 0) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    // Update user
    const updateQuery = 'UPDATE users SET username = ?, role = ? WHERE id = ?';
    db.query(updateQuery, [username, role, userId], (err, result) => {
      if (err) {
        console.error('Error updating user:', err);
        return res.status(500).json({ error: 'Error updating user' });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.json({ message: 'User updated successfully' });
    });
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 