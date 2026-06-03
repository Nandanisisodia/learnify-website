const express = require('express');
const pool = require('../config/database');
const router = express.Router();

// GET all students
router.get('/students', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, full_name, email, contact_number, role, status, 
       created_at FROM user_details WHERE role = 'student' ORDER BY created_at DESC`
    );
    res.status(200).json({ success: true, data: result.rows });
  } catch (error) {
    console.error('Students error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// UPDATE student status
router.patch('/students/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const result = await pool.query(
      'UPDATE user_details SET status = $1 WHERE id = $2 RETURNING *',
      [status, req.params.id]
    );
    res.status(200).json({ success: true, data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;