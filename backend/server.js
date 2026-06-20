const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Initialize app FIRST
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Import routes
const authRoutes = require('./routes/auth');
const userProfileRoutes = require('./routes/userProfile');
const statsRoutes = require('./routes/stats'); 
const noticesRoutes = require('./routes/notices');
const assignmentsRoutes = require('./routes/assignments');
const studentsRoutes = require('./routes/students');
const messagesRoutes = require('./routes/messages');
const companiesRoutes = require('./routes/companies');
const analyticsRoutes = require('./routes/analytics');
const projectsRoutes = require('./routes/projects');
const mentorReviewsRoutes = require('./routes/mentorReviews');
const quizRoutes = require('./routes/quiz');
const hrQuestionsRoutes = require('./routes/hrQuestions');

// Routes
app.use('/api', authRoutes);
app.use('/api', userProfileRoutes);
app.use('/api', statsRoutes);
app.use('/api', noticesRoutes);
app.use('/api', assignmentsRoutes);
app.use('/api', studentsRoutes);
app.use('/api', messagesRoutes);
app.use('/api', companiesRoutes);
app.use('/api', analyticsRoutes);
app.use('/api', projectsRoutes);
app.use('/api', mentorReviewsRoutes);
app.use('/api', quizRoutes);
app.use('/api', hrQuestionsRoutes);


// Health check
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running successfully',
    timestamp: new Date().toISOString(),
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`🔎 Health check: http://localhost:${PORT}/health`);
});