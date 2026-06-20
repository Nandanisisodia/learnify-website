const express = require('express');
const pool = require('../config/database');
const router = express.Router();

router.get('/analytics', async (req, res) => {
  try {
    // Total hires (sum of all companies' hires)
    const hiresResult = await pool.query('SELECT COALESCE(SUM(hires), 0) as total FROM companies');
    const totalHires = hiresResult.rows[0].total;

    // Top hiring companies (top 5 by hires)
    const topCompaniesResult = await pool.query(
      'SELECT name, hires FROM companies WHERE status = $1 ORDER BY hires DESC LIMIT 5',
      ['approved']
    );

    // Total approved companies
    const companiesCountResult = await pool.query(
      'SELECT COUNT(*) as count FROM companies WHERE status = $1',
      ['approved']
    );

    // Total students
    const studentsResult = await pool.query(
      "SELECT COUNT(*) as count FROM user_details WHERE role = 'student'"
    );

    // Approved students
    const approvedStudentsResult = await pool.query(
      "SELECT COUNT(*) as count FROM user_details WHERE role = 'student' AND status = 'approved'"
    );

    res.status(200).json({
      success: true,
      data: {
        totalHires: Number(totalHires),
        totalCompanies: Number(companiesCountResult.rows[0].count),
        totalStudents: Number(studentsResult.rows[0].count),
        approvedStudents: Number(approvedStudentsResult.rows[0].count),
        topCompanies: topCompaniesResult.rows
      }
    });
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;