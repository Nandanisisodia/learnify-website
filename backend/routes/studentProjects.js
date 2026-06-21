const express = require('express');
const pool = require('../config/database');
const router = express.Router();

// GET projects by user
router.get('/student-projects/:userId', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM student_projects WHERE user_id = $1 ORDER BY created_at DESC',
      [req.params.userId]
    );
    res.status(200).json({ success: true, data: result.rows });
  } catch (error) {
    console.error('Student projects error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ADD project
router.post('/student-projects', async (req, res) => {
  try {
    const { user_id, title, description, tech_stack, contributions, is_open_source, github_pr_link } = req.body;
    const result = await pool.query(
      `INSERT INTO student_projects 
       (user_id, title, description, tech_stack, contributions, is_open_source, github_pr_link) 
       VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
      [user_id, title, description, tech_stack, contributions, is_open_source, github_pr_link]
    );
    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Add project error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// DELETE project
router.delete('/student-projects/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM student_projects WHERE id = $1', [req.params.id]);
    res.status(200).json({ success: true, message: 'Deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;