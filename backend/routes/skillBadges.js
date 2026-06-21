const express = require('express');
const pool = require('../config/database');
const router = express.Router();

// GET badges by user
router.get('/skill-badges/:userId', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM skill_badges WHERE user_id = $1 ORDER BY created_at DESC',
      [req.params.userId]
    );
    res.status(200).json({ success: true, data: result.rows });
  } catch (error) {
    console.error('Skill badges error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ADD badge
router.post('/skill-badges', async (req, res) => {
  try {
    const { user_id, badge_name, badge_description, verified } = req.body;
    const result = await pool.query(
      'INSERT INTO skill_badges (user_id, badge_name, badge_description, verified) VALUES ($1,$2,$3,$4) RETURNING *',
      [user_id, badge_name, badge_description, verified || false]
    );
    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Add badge error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// DELETE badge
router.delete('/skill-badges/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM skill_badges WHERE id = $1', [req.params.id]);
    res.status(200).json({ success: true, message: 'Deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;