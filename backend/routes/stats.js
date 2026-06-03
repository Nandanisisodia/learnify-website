const express = require('express');
const pool = require('../config/database');
const router = express.Router();

// GET student stats by user_id
router.get('/stats/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const result = await pool.query(
      'SELECT * FROM student_stats WHERE user_id = $1',
      [userId]
    );

    if (result.rows.length === 0) {
      // Default stats if not found
      return res.status(200).json({
        success: true,
        data: {
          attendance: 0,
          tasks_completed: 0,
          tasks_in_progress: 0,
          reward_points: 0
        }
      });
    }

    res.status(200).json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// GET profile completion
router.get('/profile-completion/:userId', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM user_details WHERE id = $1',
      [req.params.userId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    const user = result.rows[0];
    const fields = ['full_name', 'email', 'contact_number', 'linkedin_url', 'github_url', 'why_hire_me', 'ai_skill_summary'];
    const filled = fields.filter(f => user[f] && user[f].toString().trim() !== '').length;
    const completion = Math.round((filled / fields.length) * 100);

    const strengthFields = ['linkedin_url', 'github_url', 'why_hire_me', 'ai_skill_summary', 'domains_of_interest'];
    const strengthFilled = strengthFields.filter(f => user[f] && user[f].toString().trim() !== '').length;
    const strength = Math.round((strengthFilled / strengthFields.length) * 100);

    res.status(200).json({ success: true, data: { completion, strength } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;