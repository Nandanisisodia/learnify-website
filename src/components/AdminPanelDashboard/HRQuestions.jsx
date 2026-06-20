import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, Trash2, MessageCircleQuestion } from "lucide-react";
import axios from "axios";

function HRQuestions() {
  const [questions, setQuestions] = useState([]);
  const [question, setQuestion] = useState("");
  const [category, setCategory] = useState("Behavioral");
  const [keywords, setKeywords] = useState("");

  const fetchQuestions = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/hr-questions");
      if (res.data.success) setQuestions(res.data.data);
    } catch (err) {
      console.error("Failed to fetch questions:", err);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  const handleAdd = async () => {
    if (!question.trim()) return;
    try {
      const keywordsArray = keywords.split(',').map(k => k.trim()).filter(k => k);
      await axios.post("http://localhost:5000/api/hr-questions", {
        question,
        category,
        keywords: keywordsArray
      });
      setQuestion("");
      setKeywords("");
      fetchQuestions();
    } catch (err) {
      console.error("Failed to add question:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/hr-questions/${id}`);
      fetchQuestions();
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  return (
    <main className="p-4 sm:p-6 flex flex-col gap-6">
      <motion.h2
        className="text-2xl font-bold text-foreground mb-6"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
      >
        Manage HR Questions
      </motion.h2>

      <motion.div
        className="stat-card p-6 mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h3 className="text-lg font-semibold mb-4">Add New HR Question</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="input-field"
          >
            <option value="Behavioral">Behavioral</option>
            <option value="Situational">Situational</option>
            <option value="Technical">Technical</option>
            <option value="General">General</option>
          </select>

          <input
            type="text"
            placeholder="Keywords (comma separated) e.g. teamwork, leadership, conflict"
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            className="input-field"
          />
        </div>

        <textarea
          placeholder="Enter HR question... e.g. Tell me about a time you handled conflict in a team"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          className="input-field w-full mb-4 min-h-[80px]"
        />

        <motion.button
          onClick={handleAdd}
          className="btn-primary flex items-center gap-2"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Plus className="w-4 h-4" />
          Add Question
        </motion.button>
      </motion.div>

      <motion.div
        className="stat-card p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h3 className="text-lg font-semibold mb-4">All HR Questions</h3>
        {questions.length === 0 ? (
          <p className="text-center text-gray-500">No questions added yet.</p>
        ) : (
          <div className="space-y-3">
            {questions.map((q) => (
              <div key={q.id} className="border rounded-xl p-4 flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-gradient-primary mt-1">
                    <MessageCircleQuestion className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <span className="text-xs font-medium px-2 py-1 bg-primary/10 text-primary rounded-full">
                      {q.category}
                    </span>
                    <p className="mt-2 font-medium">{q.question}</p>
                    {q.keywords && q.keywords.length > 0 && (
                      <p className="text-xs text-gray-500 mt-1">Keywords: {q.keywords.join(', ')}</p>
                    )}
                  </div>
                </div>
                <button onClick={() => handleDelete(q.id)} className="text-red-500 hover:text-red-700 flex-shrink-0">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </main>
  );
}

export default HRQuestions;