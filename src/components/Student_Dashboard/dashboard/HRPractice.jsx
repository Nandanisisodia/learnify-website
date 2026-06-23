import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MessageCircleQuestion, Send, History, ChevronDown, ChevronUp } from "lucide-react";
import axios from "axios";
import Sidebar from "./Sidebar";
import Header from "./Header";

function HRPractice() {
  const [isSidebarVisible, setSidebarVisible] = useState(true);
  const [questions, setQuestions] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [activeQuestion, setActiveQuestion] = useState(null);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const user = JSON.parse(localStorage.getItem('user'));

  const fetchData = async () => {
    try {
      const qRes = await axios.get("https://learnify-backend-td3k.onrender.com/api/hr-questions");
      if (qRes.data.success) setQuestions(qRes.data.data);

      const hRes = await axios.get(`https://learnify-backend-td3k.onrender.com/api/hr-practice/${user?.id}`);
      if (hRes.data.success) setHistory(hRes.data.data);
    } catch (err) {
      console.error("Failed to fetch data:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const toggleSidebar = () => setSidebarVisible(!isSidebarVisible);

  const categories = ["All", ...new Set(questions.map(q => q.category))];
  const filteredQuestions = selectedCategory === "All" 
    ? questions 
    : questions.filter(q => q.category === selectedCategory);

  const handleSelectQuestion = (q) => {
    setActiveQuestion(q);
    setAnswer("");
    setFeedback(null);
  };

  const handleSubmit = async () => {
    if (!answer.trim()) {
      alert("Please write an answer first");
      return;
    }
    setSubmitting(true);
    try {
      const res = await axios.post("https://learnify-backend-td3k.onrender.com/api/hr-practice", {
        user_id: user.id,
        question_id: activeQuestion.id,
        answer
      });
      if (res.data.success) {
        setFeedback(res.data.data);
        fetchData();
      }
    } catch (err) {
      console.error("Submit failed:", err);
      alert("Failed to submit answer");
    } finally {
      setSubmitting(false);
    }
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
            HR Questions Practice
          </motion.h2>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Questions List */}
            <div className="lg:col-span-1">
              <motion.div
                className="stat-card p-4 mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="input-field w-full mb-3"
                >
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>

                <div className="space-y-2 max-h-[500px] overflow-y-auto">
                  {filteredQuestions.length === 0 ? (
                    <p className="text-gray-500 text-sm text-center py-4">No questions available.</p>
                  ) : (
                    filteredQuestions.map((q) => (
                      <button
                        key={q.id}
                        onClick={() => handleSelectQuestion(q)}
                        className={`w-full text-left p-3 rounded-xl border transition-all ${
                          activeQuestion?.id === q.id ? 'border-primary bg-primary/10' : 'border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        <span className="text-xs font-medium px-2 py-0.5 bg-primary/10 text-primary rounded-full">
                          {q.category}
                        </span>
                        <p className="text-sm mt-1">{q.question}</p>
                      </button>
                    ))
                  )}
                </div>
              </motion.div>
            </div>

            {/* Answer Area */}
            <div className="lg:col-span-2">
              {!activeQuestion ? (
                <motion.div
                  className="stat-card p-8 text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <MessageCircleQuestion className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">Select a question from the left to start practicing.</p>
                </motion.div>
              ) : (
                <motion.div
                  className="stat-card p-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <span className="text-xs font-medium px-2 py-1 bg-primary/10 text-primary rounded-full">
                    {activeQuestion.category}
                  </span>
                  <h3 className="text-lg font-semibold mt-2 mb-4">{activeQuestion.question}</h3>

                  <textarea
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    placeholder="Type your answer here... Try to use the STAR method (Situation, Task, Action, Result)"
                    className="input-field w-full min-h-[150px] mb-4"
                  />

                  <motion.button
                    onClick={handleSubmit}
                    disabled={submitting}
                    className="btn-primary flex items-center gap-2"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Send className="w-4 h-4" />
                    {submitting ? "Analyzing..." : "Submit for Feedback"}
                  </motion.button>

                  {feedback && (
                    <motion.div
                      className="mt-6 p-4 rounded-xl bg-muted/50 border"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold">Feedback</h4>
                        <span className="text-lg font-bold text-primary">{feedback.score}/100</span>
                      </div>
                      <p className="text-sm text-gray-700 whitespace-pre-line">{feedback.feedback}</p>
                    </motion.div>
                  )}
                </motion.div>
              )}
            </div>
          </div>

          {/* History */}
          <motion.div
            className="stat-card p-6 mt-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="flex items-center justify-between w-full"
            >
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <History className="w-5 h-5" />
                Practice History ({history.length})
              </h3>
              {showHistory ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>

            {showHistory && (
              <div className="mt-4 space-y-3">
                {history.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No practice attempts yet.</p>
                ) : (
                  history.map((h) => (
                    <div key={h.id} className="border rounded-xl p-4">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-xs font-medium px-2 py-0.5 bg-primary/10 text-primary rounded-full">
                          {h.category}
                        </span>
                        <span className="font-bold text-primary">{h.score}/100</span>
                      </div>
                      <p className="font-medium text-sm mb-1">{h.question}</p>
                      <p className="text-sm text-gray-600 mb-2">"{h.answer}"</p>
                      <p className="text-xs text-gray-500">{new Date(h.created_at).toLocaleDateString()}</p>
                    </div>
                  ))
                )}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default HRPractice;