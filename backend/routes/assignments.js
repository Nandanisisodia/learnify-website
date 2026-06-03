const express = require('express');
const pool = require('../config/database');
const router = express.Router();

// GET assignments by user
router.get('/assignments/:userId', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM assignments WHERE user_id = $1 ORDER BY created_at DESC',
      [req.params.userId]
    );
    res.status(200).json({ success: true, data: result.rows });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ADD assignment
router.post('/assignments', async (req, res) => {
  try {
    const { user_id, task, subject, due_date, status } = req.body;
    const result = await pool.query(
      'INSERT INTO assignments (user_id, task, subject, due_date, status) VALUES ($1,$2,$3,$4,$5) RETURNING *',
      [user_id, task, subject, due_date, status || 'Not Started']
    );
    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// DELETE assignment
router.delete('/assignments/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM assignments WHERE id = $1', [req.params.id]);
    res.status(200).json({ success: true, message: 'Deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// UPDATE status
router.patch('/assignments/:id', async (req, res) => {
  try {
    const { status } = req.body;
    const result = await pool.query(
      'UPDATE assignments SET status = $1 WHERE id = $2 RETURNING *',
      [status, req.params.id]
    );
    res.status(200).json({ success: true, data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// GET all assignments with student name (for admin)
router.get('/all-assignments', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT a.*, u.full_name FROM assignments a 
       JOIN user_details u ON a.user_id = u.id 
       ORDER BY a.created_at DESC`
    );
    res.status(200).json({ success: true, data: result.rows });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;