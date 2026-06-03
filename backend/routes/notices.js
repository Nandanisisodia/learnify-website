const express = require('express');
const pool = require('../config/database');
const router = express.Router();

router.get('/notices', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM notices ORDER BY created_at DESC LIMIT 5'
    );
    res.status(200).json({ success: true, data: result.rows });
  } catch (error) {
    console.error('Notices error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;