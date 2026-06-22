const express = require('express');
const pool = require('../config/database');
const router = express.Router();

router.post('/contact', async (req, res) => {
  try {
    const { name, email, inquiryType, message } = req.body;

    if (!name || !email) {
      return res.status(400).json({ success: false, message: 'Name and email are required' });
    }

    const result = await pool.query(
      'INSERT INTO contact_messages (name, email, inquiry_type, message) VALUES ($1,$2,$3,$4) RETURNING *',
      [name, email, inquiryType, message]
    );

    res.status(201).json({ success: true, message: 'Message sent successfully', data: result.rows[0] });
  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// GET all contact messages
router.get('/contact', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM contact_messages ORDER BY created_at DESC'
    );
    res.status(200).json({ success: true, data: result.rows });
  } catch (error) {
    console.error('Get contacts error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// DELETE contact message
router.delete('/contact/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM contact_messages WHERE id = $1', [req.params.id]);
    res.status(200).json({ success: true, message: 'Deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;