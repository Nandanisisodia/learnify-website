const express = require('express');
const pool = require('../config/database');
const router = express.Router();

// GET messages for a user
router.get('/messages/:userId', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT m.*, u.full_name as sender_name 
       FROM messages m
       JOIN user_details u ON m.sender_id = u.id
       WHERE m.receiver_id = $1
       ORDER BY m.created_at DESC LIMIT 5`,
      [req.params.userId]
    );
    res.status(200).json({ success: true, data: result.rows });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// SEND message
router.post('/messages', async (req, res) => {
  try {
    const { sender_id, receiver_id, message } = req.body;
    const result = await pool.query(
      'INSERT INTO messages (sender_id, receiver_id, message) VALUES ($1,$2,$3) RETURNING *',
      [sender_id, receiver_id, message]
    );
    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;