const express = require('express');
const pool = require('../config/database');
const router = express.Router();

// GET all projects
router.get('/projects', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM projects ORDER BY created_at DESC');
    res.status(200).json({ success: true, data: result.rows });
  } catch (error) {
    console.error('Projects error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ADD project
router.post('/projects', async (req, res) => {
  try {
    const { title, mentor, students } = req.body;
    const result = await pool.query(
      'INSERT INTO projects (title, mentor, students) VALUES ($1,$2,$3) RETURNING *',
      [title, mentor, students || 0]
    );
    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// DELETE project
router.delete('/projects/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM projects WHERE id = $1', [req.params.id]);
    res.status(200).json({ success: true, message: 'Deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;