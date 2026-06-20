import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CheckCircle, ArrowLeft } from "lucide-react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";

function QuizAttempt() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isSidebarVisible, setSidebarVisible] = useState(true);
  const [quiz, setQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState(null);

  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/quizzes/${id}/attempt`);
        if (res.data.success) {
          setQuiz(res.data.data.quiz);
          setQuestions(res.data.data.questions);
        }
      } catch (err) {
        console.error("Failed to fetch quiz:", err);
      }
    };
    fetchQuiz();
  }, [id]);

  const handleAnswerSelect = (questionId, option) => {
    setAnswers({ ...answers, [questionId]: option });
  };

  const handleSubmit = async () => {
    if (Object.keys(answers).length < questions.length) {
      if (!window.confirm("Some questions are unanswered. Submit anyway?")) return;
    }
    try {
      const res = await axios.post(`http://localhost:5000/api/quizzes/${id}/submit`, {
        user_id: user.id,
        answers
      });
      if (res.data.success) {
        setResult(res.data.data);
        setSubmitted(true);
      }
    } catch (err) {
      console.error("Submit failed:", err);
      alert("Failed to submit quiz");
    }
  };

  const toggleSidebar = () => setSidebarVisible(!isSidebarVisible);

  if (!quiz) {
    return (
      <div className="flex min-h-screen">
        <Sidebar isOpen={isSidebarVisible} setIsOpen={setSidebarVisible} />
        <div className={`flex-1 flex flex-col ${isSidebarVisible ? "lg:ml-64" : "ml-0"}`}>
          <Header onMenuClick={toggleSidebar} />
          <div className="pt-24 px-6 text-center text-gray-500">Loading quiz...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-background via-accent/5 to-primary/5">
      <Sidebar isOpen={isSidebarVisible} setIsOpen={setSidebarVisible} />
      <div className={`flex-1 flex flex-col transition-all duration-300 ${isSidebarVisible ? "lg:ml-64" : "ml-0"}`}>
        <Header onMenuClick={toggleSidebar} />
        <div className="pt-24 px-4 sm:px-6 py-6 max-w-3xl mx-auto w-full">

          <button
            onClick={() => navigate('/dashboard/assessments')}
            className="flex items-center gap-2 text-primary mb-4 hover:underline"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Assessments
          </button>

          {submitted ? (
            <motion.div
              className="stat-card p-8 text-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Assessment Submitted!</h2>
              <p className="text-lg text-gray-600 mb-4">
                Your Score: <span className="font-bold text-primary">{result.score} / {result.total_questions}</span>
              </p>
              <p className="text-gray-500 mb-6">
                Percentage: {Math.round((result.score / result.total_questions) * 100)}%
              </p>
              <button
                onClick={() => navigate('/dashboard/assessments')}
                className="btn-primary px-6 py-3"
              >
                Back to Assessments
              </button>
            </motion.div>
          ) : (
            <>
              <motion.h2
                className="text-2xl font-bold text-foreground mb-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                {quiz.title}
              </motion.h2>
              <p className="text-gray-500 mb-6">{quiz.subject}</p>

              <div className="space-y-6">
                {questions.map((q, index) => (
                  <motion.div
                    key={q.id}
                    className="stat-card p-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <p className="font-semibold mb-4">{index + 1}. {q.question}</p>
                    <div className="space-y-2">
                      {['A', 'B', 'C', 'D'].map((opt) => (
                        <label
                          key={opt}
                          className={`flex items-center gap-3 p-3 border rounded-xl cursor-pointer transition-all ${
                            answers[q.id] === opt ? 'border-primary bg-primary/10' : 'border-gray-200 hover:bg-gray-50'
                          }`}
                        >
                          <input
                            type="radio"
                            name={`question-${q.id}`}
                            checked={answers[q.id] === opt}
                            onChange={() => handleAnswerSelect(q.id, opt)}
                            className="accent-primary"
                          />
                          <span>{q[`option_${opt.toLowerCase()}`]}</span>
                        </label>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>

              <motion.button
                onClick={handleSubmit}
                className="btn-primary w-full py-3 mt-6"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Submit Assessment
              </motion.button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default QuizAttempt;