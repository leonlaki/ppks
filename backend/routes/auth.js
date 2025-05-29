  const express = require('express');
  const bcrypt = require('bcrypt');
  const jwt = require('jsonwebtoken');
  const pool = require('../db');

  const router = express.Router();

  require('dotenv').config();

  const JWT_SECRET = process.env.JWT_SECRET;

  //Signup
  router.post('/signup', async (req, res) => {
    const { username, email, password } = req.body;

    try {
      const hashedPassword = await bcrypt.hash(password, 10);

      const result = await pool.query(
        `INSERT INTO users (username, email, password_hash, created_at)
        VALUES ($1, $2, $3, NOW())
        RETURNING id, username, email`,
        [username, email, hashedPassword]
      );

      res.status(201).json(result.rows[0]);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Registration failed.' });
    }
  });

  //Login 
  // Login a user using username instead of email
  router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
      const result = await pool.query(
        `SELECT * FROM users WHERE username = $1`,
        [username]
      );

      if (result.rows.length === 0) return res.status(401).json({ error: 'Invalid credentials.' });

      const user = result.rows[0];
      const isMatch = await bcrypt.compare(password, user.password_hash);

      if (!isMatch) return res.status(401).json({ error: 'Invalid credentials.' });

      const token = jwt.sign({ user_id: user.id }, JWT_SECRET, { expiresIn: '1h' });

      res.json({ token, user: { id: user.id, username: user.username, email: user.email } });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Login failed.' });
    }
  });

  module.exports = router;