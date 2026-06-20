const express = require('express');
const pool = require('../config/database');
const router = express.Router();

// ============ ADMIN ROUTES ============

// ADD HR question
router.post('/hr-questions', async (req, res) => {
  try {
    const { question, category, keywords } = req.body;
    const result = await pool.query(
      'INSERT INTO hr_questions (question, category, keywords) VALUES ($1,$2,$3) RETURNING *',
      [question, category, keywords]
    );
    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Add HR question error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// GET all HR questions
router.get('/hr-questions', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM hr_questions ORDER BY created_at DESC');
    res.status(200).json({ success: true, data: result.rows });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// DELETE HR question
router.delete('/hr-questions/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM hr_questions WHERE id = $1', [req.params.id]);
    res.status(200).json({ success: true, message: 'Deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ============ STUDENT ROUTES ============

// Rule-based feedback generator
function generateFeedback(answer, keywords = []) {
  let score = 0;
  let feedbackPoints = [];

  const wordCount = answer.trim().split(/\s+/).length;

  // 1. Length check (40 points)
  if (wordCount < 20) {
    feedbackPoints.push("⚠️ Your answer is quite short. Try to elaborate more with specific examples.");
  } else if (wordCount >= 20 && wordCount < 50) {
    score += 20;
    feedbackPoints.push("✓ Good length, but you could add more detail.");
  } else {
    score += 40;
    feedbackPoints.push("✓ Great! Your answer has good depth and detail.");
  }

  // 2. Keyword matching (30 points)
  if (keywords && keywords.length > 0) {
    const answerLower = answer.toLowerCase();
    const matchedKeywords = keywords.filter(kw => answerLower.includes(kw.toLowerCase()));
    const keywordScore = Math.round((matchedKeywords.length / keywords.length) * 30);
    score += keywordScore;

    if (matchedKeywords.length > 0) {
      feedbackPoints.push(`✓ You touched on key points: ${matchedKeywords.join(', ')}`);
    } else {
      feedbackPoints.push(`⚠️ Consider mentioning: ${keywords.join(', ')}`);
    }
  } else {
    score += 15; // neutral if no keywords set
  }

  // 3. Structure check - STAR method indicators (30 points)
  const starIndicators = ['situation', 'task', 'action', 'result', 'example', 'when i', 'i was', 'i did', 'as a result'];
  const answerLower = answer.toLowerCase();
  const hasStructure = starIndicators.some(ind => answerLower.includes(ind));

  if (hasStructure) {
    score += 30;
    feedbackPoints.push("✓ Nice use of a real example/situation to support your answer.");
  } else {
    feedbackPoints.push("⚠️ Try using the STAR method (Situation, Task, Action, Result) with a specific example.");
  }

  score = Math.min(score, 100);

  let overall = "";
  if (score >= 80) overall = "Excellent answer! 🌟";
  else if (score >= 60) overall = "Good answer, with room for improvement. 👍";
  else overall = "Needs improvement. Keep practicing! 💪";

  const feedback = `${overall}\n\n${feedbackPoints.join('\n')}`;
  return { score, feedback };
}

// SUBMIT practice answer and get feedback
router.post('/hr-practice', async (req, res) => {
  try {
    const { user_id, question_id, answer } = req.body;

    const questionResult = await pool.query('SELECT * FROM hr_questions WHERE id = $1', [question_id]);
    if (questionResult.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Question not found' });
    }

    const { score, feedback } = generateFeedback(answer, questionResult.rows[0].keywords);

    const result = await pool.query(
      'INSERT INTO hr_practice_answers (user_id, question_id, answer, feedback, score) VALUES ($1,$2,$3,$4,$5) RETURNING *',
      [user_id, question_id, answer, feedback, score]
    );

    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Practice submit error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// GET student's practice history
router.get('/hr-practice/:userId', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT pa.*, q.question, q.category 
      FROM hr_practice_answers pa
      JOIN hr_questions q ON pa.question_id = q.id
      WHERE pa.user_id = $1
      ORDER BY pa.created_at DESC
    `, [req.params.userId]);
    res.status(200).json({ success: true, data: result.rows });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;