const express = require('express');
const pool = require('../config/database');
const router = express.Router();

// ============ ADMIN ROUTES ============

// CREATE quiz with questions
router.post('/quizzes', async (req, res) => {
  const client = await pool.connect();
  try {
    const { title, subject, questions } = req.body;

    await client.query('BEGIN');

    const quizResult = await client.query(
      'INSERT INTO quizzes (title, subject) VALUES ($1, $2) RETURNING *',
      [title, subject]
    );
    const quizId = quizResult.rows[0].id;

    for (const q of questions) {
      await client.query(
        `INSERT INTO quiz_questions 
         (quiz_id, question, option_a, option_b, option_c, option_d, correct_option) 
         VALUES ($1,$2,$3,$4,$5,$6,$7)`,
        [quizId, q.question, q.option_a, q.option_b, q.option_c, q.option_d, q.correct_option]
      );
    }

    await client.query('COMMIT');
    res.status(201).json({ success: true, data: quizResult.rows[0] });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Create quiz error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  } finally {
    client.release();
  }
});

// GET all quizzes (for admin list)
router.get('/quizzes', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT q.*, COUNT(qq.id) as question_count 
      FROM quizzes q
      LEFT JOIN quiz_questions qq ON q.id = qq.quiz_id
      GROUP BY q.id
      ORDER BY q.created_at DESC
    `);
    res.status(200).json({ success: true, data: result.rows });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// DELETE quiz
router.delete('/quizzes/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM quizzes WHERE id = $1', [req.params.id]);
    res.status(200).json({ success: true, message: 'Deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ============ STUDENT ROUTES ============

// GET quiz questions to attempt (without correct answers exposed)
router.get('/quizzes/:id/attempt', async (req, res) => {
  try {
    const quizResult = await pool.query('SELECT * FROM quizzes WHERE id = $1', [req.params.id]);
    if (quizResult.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Quiz not found' });
    }

    const questionsResult = await pool.query(
      'SELECT id, question, option_a, option_b, option_c, option_d FROM quiz_questions WHERE quiz_id = $1',
      [req.params.id]
    );

    res.status(200).json({
      success: true,
      data: { quiz: quizResult.rows[0], questions: questionsResult.rows }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// SUBMIT quiz answers and calculate score
router.post('/quizzes/:id/submit', async (req, res) => {
  try {
    const { user_id, answers } = req.body; // answers = { questionId: 'A', ... }
    const quizId = req.params.id;

    const questionsResult = await pool.query(
      'SELECT id, correct_option FROM quiz_questions WHERE quiz_id = $1',
      [quizId]
    );

    let score = 0;
    questionsResult.rows.forEach((q) => {
      if (answers[q.id] === q.correct_option) score++;
    });

    const total = questionsResult.rows.length;

    const result = await pool.query(
      'INSERT INTO quiz_results (quiz_id, user_id, score, total_questions) VALUES ($1,$2,$3,$4) RETURNING *',
      [quizId, user_id, score, total]
    );

    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Submit quiz error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// GET student's quiz results (performance history)
router.get('/quiz-results/:userId', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT qr.*, q.title, q.subject 
      FROM quiz_results qr
      JOIN quizzes q ON qr.quiz_id = q.id
      WHERE qr.user_id = $1
      ORDER BY qr.attempted_at DESC
    `, [req.params.userId]);
    res.status(200).json({ success: true, data: result.rows });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;