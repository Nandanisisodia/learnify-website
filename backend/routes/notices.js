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
// ADD notice
router.post('/notices', async (req, res) => {
  try {
    const { text, type } = req.body;
    const result = await pool.query(
      'INSERT INTO notices (text, type) VALUES ($1, $2) RETURNING *',
      [text, type]
    );
    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Add notice error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// DELETE notice
router.delete('/notices/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM notices WHERE id = $1', [req.params.id]);
    res.status(200).json({ success: true, message: 'Deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;