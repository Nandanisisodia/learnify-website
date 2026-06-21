const express = require('express');
const pool = require('../config/database');
const bcrypt = require('bcryptjs');
const router = express.Router();

router.post('/login', async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    const userQuery = `
      SELECT id, full_name, email, password, role
      FROM user_details
      WHERE email = $1
    `;
    const result = await pool.query(userQuery, [email]);

    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    const user = result.rows[0];

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // LOGIN SUCCESS
    res.status(200).json({
      success: true,
      message: 'Login successful',
      role: user.role,
      user: {
        id: user.id,
        name: user.full_name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Dashboard overview - full data
router.get('/dashboard-overview', async (req, res) => {
  try {
    const studentsResult = await pool.query("SELECT COUNT(*) as count FROM user_details WHERE role = 'student'");
    const companiesResult = await pool.query("SELECT COUNT(*) as count FROM companies WHERE status = 'approved'");
    const hiresResult = await pool.query("SELECT COALESCE(SUM(hires),0) as total FROM companies");
    const costResult = await pool.query("SELECT COUNT(*) as count FROM projects");

    // Recent projects (replacing "Top Courses")
    const recentProjects = await pool.query(
      "SELECT title, mentor, students FROM projects ORDER BY created_at DESC LIMIT 5"
    );

    // Recent assignments with completion % (replacing "Assignment Progress")
    const assignmentStats = await pool.query(`
      SELECT subject, 
        COUNT(*) as total,
        COUNT(*) FILTER (WHERE status = 'Completed') as completed
      FROM assignments
      GROUP BY subject
      ORDER BY total DESC
      LIMIT 5
    `);

    // Domain interest distribution (replacing "Topic Interest")
    const domainResult = await pool.query(
      "SELECT domains_of_interest FROM user_details WHERE role = 'student' AND domains_of_interest IS NOT NULL"
    );
    const domainCounts = {};
    domainResult.rows.forEach(row => {
      (row.domains_of_interest || []).forEach(domain => {
        domainCounts[domain] = (domainCounts[domain] || 0) + 1;
      });
    });
    const topDomains = Object.entries(domainCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, value]) => ({ name, value }));

    // Top mentors (replacing "Popular Instructors")
    const mentorsResult = await pool.query(`
      SELECT mentor, COUNT(*) as project_count, SUM(students) as total_students
      FROM projects
      GROUP BY mentor
      ORDER BY project_count DESC
      LIMIT 5
    `);

    res.status(200).json({
      success: true,
      data: {
        totalStudents: Number(studentsResult.rows[0].count),
        totalCompanies: Number(companiesResult.rows[0].count),
        totalHires: Number(hiresResult.rows[0].total),
        totalProjects: Number(costResult.rows[0].count),
        recentProjects: recentProjects.rows,
        assignmentStats: assignmentStats.rows,
        topDomains,
        topMentors: mentorsResult.rows
      }
    });
  } catch (error) {
    console.error('Dashboard overview error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;