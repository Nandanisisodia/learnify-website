const express = require('express');
const pool = require('../config/database');
const bcrypt = require('bcrypt');
const router = express.Router();

// Create or update user profile
router.post('/profile', async (req, res) => {
  try {
    const {
      full_name,
      email,
      password,
      contact_number,
      linkedin_url,
      github_url,
      why_hire_me,
      ai_skill_summary,
      domainsOfInterest,
      othersDomain
    } = req.body;

    // ---------- VALIDATIONS ----------
    if (!full_name || !/^[A-Za-z ]+$/.test(full_name.trim())) {
      return res.status(400).json({ success: false, message: 'Valid full name is required' });
    }

    if (!email || !email.includes('@')) {
      return res.status(400).json({ success: false, message: 'Valid email is required' });
    }

    if (!password || password.length < 8) {
      return res.status(400).json({ success: false, message: 'Password must be at least 8 characters' });
    }

    if (!contact_number || !/^[0-9]{10}$/.test(contact_number)) {
      return res.status(400).json({ success: false, message: 'Valid 10-digit contact number required' });
    }

    if (linkedin_url && !/^https?:\/\/(www\.)?linkedin\.com\/.*$/.test(linkedin_url)) {
      return res.status(400).json({ success: false, message: 'Invalid LinkedIn URL' });
    }

    if (github_url && !/^https?:\/\/(www\.)?github\.com\/.*$/.test(github_url)) {
      return res.status(400).json({ success: false, message: 'Invalid GitHub URL' });
    }

    if (!why_hire_me || !why_hire_me.trim()) {
      return res.status(400).json({ success: false, message: 'Why-hire-me field is required' });
    }

    if (!ai_skill_summary || !ai_skill_summary.trim()) {
      return res.status(400).json({ success: false, message: 'AI skill summary is required' });
    }

    if (!Array.isArray(domainsOfInterest) || domainsOfInterest.length < 2) {
      return res.status(400).json({ success: false, message: 'Select at least two domains' });
    }

    // ---------- CHECK USER ----------
    const checkQuery = 'SELECT id FROM user_details WHERE email = $1';
    const checkResult = await pool.query(checkQuery, [email]);

    let result;

    // ---------- UPDATE PROFILE ----------
    if (checkResult.rows.length > 0) {
      const updateQuery = `
        UPDATE user_details
        SET full_name = $1,
            contact_number = $2,
            linkedin_url = $3,
            github_url = $4,
            why_hire_me = $5,
            ai_skill_summary = $6,
            domains_of_interest = $7,
            others_domain = $8,
            profile_completed = TRUE,
            updated_at = CURRENT_TIMESTAMP
        WHERE email = $9
        RETURNING *
      `;

      result = await pool.query(updateQuery, [
        full_name,
        contact_number,
        linkedin_url,
        github_url,
        why_hire_me,
        ai_skill_summary,
        domainsOfInterest,
        othersDomain,
        email
      ]);

    } 
    // ---------- INSERT NEW PROFILE ----------
    else {
      const hashedPassword = await bcrypt.hash(password, 10);

      const insertQuery = `
        INSERT INTO user_details
        (full_name, email, password, contact_number, linkedin_url, github_url,
         why_hire_me, ai_skill_summary, domains_of_interest, others_domain, profile_completed)
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,TRUE)
        RETURNING *
      `;

      result = await pool.query(insertQuery, [
        full_name,
        email,
        hashedPassword,
        contact_number,
        linkedin_url,
        github_url,
        why_hire_me,
        ai_skill_summary,
        domainsOfInterest,
        othersDomain
      ]);
    }

    // ---------- SUCCESS RESPONSE ----------
    res.status(200).json({
      success: true,
      message: 'Profile saved successfully',
      data: result.rows[0]
    });

  } catch (error) {
    console.error('Error saving profile:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// ---------- GET ALL PROFILES ----------
router.get('/profiles', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, full_name, email, contact_number FROM user_details ORDER BY created_at DESC'
    );
    res.status(200).json({ success: true, data: result.rows });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch profiles' });
  }
});

// ---------- GET PROFILE BY EMAIL ----------
router.get('/profile/:email', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM user_details WHERE email = $1',
      [req.params.email]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Profile not found' });
    }

    res.status(200).json({ success: true, data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch profile' });
  }
});

module.exports = router;