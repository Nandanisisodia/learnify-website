import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FileQuestion, Award, Clock } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";

function Assessments() {
  const [isSidebarVisible, setSidebarVisible] = useState(true);
  const [quizzes, setQuizzes] = useState([]);
  const [results, setResults] = useState([]);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const fetchData = async () => {
    try {
      const quizRes = await axios.get("https://learnify-backend-td3k.onrender.com/api/quizzes");
      if (quizRes.data.success) setQuizzes(quizRes.data.data);

      const resultsRes = await axios.get(`https://learnify-backend-td3k.onrender.com/api/quiz-results/${user?.id}`);
      if (resultsRes.data.success) setResults(resultsRes.data.data);
    } catch (err) {
      console.error("Failed to fetch data:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const toggleSidebar = () => setSidebarVisible(!isSidebarVisible);

  const getAttemptedResult = (quizId) => {
    return results.find(r => r.quiz_id === quizId);
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-background via-accent/5 to-primary/5">
      <Sidebar isOpen={isSidebarVisible} setIsOpen={setSidebarVisible} />
      <div className={`flex-1 flex flex-col transition-all duration-300 ${isSidebarVisible ? "lg:ml-64" : "ml-0"}`}>
        <Header onMenuClick={toggleSidebar} />
        <div className="pt-24 px-4 sm:px-6 py-6">
          <motion.h2
            className="text-2xl font-bold text-foreground mb-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            Assessments
          </motion.h2>

          {/* Available Quizzes */}
          <motion.div
            className="stat-card p-6 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h3 className="text-lg font-semibold mb-4">Available Assessments</h3>
            {quizzes.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No assessments available yet.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {quizzes.map((quiz) => {
                  const attempted = getAttemptedResult(quiz.id);
                  return (
                    <motion.div
                      key={quiz.id}
                      className="border rounded-xl p-4"
                      whileHover={{ scale: 1.02, y: -2 }}
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 rounded-xl bg-gradient-primary">
                          <FileQuestion className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="font-semibold">{quiz.title}</p>
                          <p className="text-sm text-gray-500">{quiz.subject} • {quiz.question_count} Qs</p>
                        </div>
                      </div>

                      {attempted ? (
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-green-600 font-medium">
                            Score: {attempted.score}/{attempted.total_questions}
                          </span>
                          <button
                            onClick={() => navigate(`/dashboard/assessments/${quiz.id}`)}
                            className="text-sm text-primary hover:underline"
                          >
                            Retake
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => navigate(`/dashboard/assessments/${quiz.id}`)}
                          className="btn-primary w-full text-sm py-2"
                        >
                          Start Assessment
                        </button>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            )}
          </motion.div>

          {/* Performance History */}
          <motion.div
            className="stat-card p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Award className="w-5 h-5" />
              Performance History
            </h3>
            {results.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No assessments attempted yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border px-4 py-2 text-left">Assessment</th>
                      <th className="border px-4 py-2 text-left">Subject</th>
                      <th className="border px-4 py-2 text-left">Score</th>
                      <th className="border px-4 py-2 text-left">Percentage</th>
                      <th className="border px-4 py-2 text-left">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.map((r) => (
                      <tr key={r.id}>
                        <td className="border px-4 py-2">{r.title}</td>
                        <td className="border px-4 py-2">{r.subject}</td>
                        <td className="border px-4 py-2">{r.score}/{r.total_questions}</td>
                        <td className="border px-4 py-2">{Math.round((r.score / r.total_questions) * 100)}%</td>
                        <td className="border px-4 py-2 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(r.attempted_at).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default Assessments;