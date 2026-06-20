const express = require('express');
const pool = require('../config/database');
const router = express.Router();

// GET all reviews
router.get('/mentor-reviews', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM mentor_reviews ORDER BY created_at DESC');
    res.status(200).json({ success: true, data: result.rows });
  } catch (error) {
    console.error('Mentor reviews error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ADD review
router.post('/mentor-reviews', async (req, res) => {
  try {
    const { mentor, feedback, rating } = req.body;
    const result = await pool.query(
      'INSERT INTO mentor_reviews (mentor, feedback, rating) VALUES ($1,$2,$3) RETURNING *',
      [mentor, feedback, rating]
    );
    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// DELETE review
router.delete('/mentor-reviews/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM mentor_reviews WHERE id = $1', [req.params.id]);
    res.status(200).json({ success: true, message: 'Deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;