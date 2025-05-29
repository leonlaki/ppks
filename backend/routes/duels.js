const express = require('express');
const verifyToken = require('../middleware/authMiddleware');
const pool = require('../db');

//Function to generate a random 6-character duel code
const generateDuelCode = () => {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
};

//Export as function to inject `io`
module.exports = (io) => {
  const router = express.Router();

  //Player 1 creates the game room
  router.post('/duels/create', verifyToken, async (req, res) => {
    const player1Id = req.user.user_id;

    try {
      const questionResult = await pool.query(
        `SELECT id FROM questions ORDER BY RANDOM() LIMIT 5`
      );
      const questionIds = questionResult.rows.map(row => row.id);
      const duelCode = generateDuelCode();

      const duelResult = await pool.query(
        `INSERT INTO duels (player1_id, questions, duel_code, status, created_at, updated_at)
         VALUES ($1, $2, $3, 'waiting', NOW(), NOW())
         RETURNING *`,
        [player1Id, JSON.stringify(questionIds), duelCode]
      );

      res.status(201).json({
        message: 'Duel created successfully.',
        duel: duelResult.rows[0]
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to create duel.' });
    }
  });

  //Player 2 joins the game room
  router.post('/duels/join', verifyToken, async (req, res) => {
    const player2Id = req.user?.user_id;
    if (!player2Id) return res.status(401).json({ error: "Unauthorized" });

    const { duelCode } = req.body;

    try {
      const duelRes = await pool.query(
        `SELECT * FROM duels WHERE duel_code = $1 AND status = 'waiting'`,
        [duelCode]
      );

      if (duelRes.rows.length === 0) {
        return res.status(404).json({ error: 'Duel not found or already started.' });
      }

      const duel = duelRes.rows[0];

      const updateRes = await pool.query(
        `UPDATE duels 
         SET player2_id = $1, status = 'active', updated_at = NOW() 
         WHERE id = $2 
         RETURNING *`,
        [player2Id, duel.id]
      );

      const updatedDuel = updateRes.rows[0];

      const roomName = `duel-${updatedDuel.duel_code}`;
      io.to(roomName).emit('duel-started', { duel: updatedDuel });

      res.json({ message: 'Joined duel successfully', duel: updatedDuel });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to join duel.' });
    }
  });

  //Get usernames for the final result
  router.get('/duels/:id/results', verifyToken, async (req, res) => {
    const duelId = req.params.id;
    try {
      const { rows } = await pool.query(`SELECT d.player1_id, d.player2_id, d.player1_score, d.player2_score,
        u1.username AS player1_username, u2.username AS player2_username FROM duels d JOIN users u1 ON u1.id = d.player1_id
        JOIN users u2 ON u2.id = d.player2_id WHERE d.id = $1`, [duelId]);
        if(!rows.length) {
          return res.status(404).json({ error: 'Duel not found.' });
        }
        res.json(rows[0]);
    } catch(err) {
      console.error(err);
      res.status(500).json({ error: 'Could not fetch duel results. '});
    }
  });

  return router;
};