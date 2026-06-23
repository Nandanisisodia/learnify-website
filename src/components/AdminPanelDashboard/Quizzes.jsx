import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, Trash2, FileQuestion } from "lucide-react";
import axios from "axios";

function Quizzes() {
  const [quizzes, setQuizzes] = useState([]);
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [questions, setQuestions] = useState([
    { question: "", option_a: "", option_b: "", option_c: "", option_d: "", correct_option: "A" }
  ]);

  const fetchQuizzes = async () => {
    try {
      const res = await axios.get("https://learnify-backend-td3k.onrender.com/api/quizzes");
      if (res.data.success) setQuizzes(res.data.data);
    } catch (err) {
      console.error("Failed to fetch quizzes:", err);
    }
  };

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const handleQuestionChange = (index, field, value) => {
    const updated = [...questions];
    updated[index][field] = value;
    setQuestions(updated);
  };

  const addQuestionField = () => {
    setQuestions([...questions, { question: "", option_a: "", option_b: "", option_c: "", option_d: "", correct_option: "A" }]);
  };

  const removeQuestionField = (index) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const handleCreateQuiz = async () => {
    if (!title.trim() || questions.some(q => !q.question.trim())) {
      alert("Please fill quiz title and all questions");
      return;
    }
    try {
      await axios.post("https://learnify-backend-td3k.onrender.com/api/quizzes", { title, subject, questions });
      alert("Quiz created successfully!");
      setTitle("");
      setSubject("");
      setQuestions([{ question: "", option_a: "", option_b: "", option_c: "", option_d: "", correct_option: "A" }]);
      fetchQuizzes();
    } catch (err) {
      console.error("Failed to create quiz:", err);
      alert("Failed to create quiz");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://learnify-backend-td3k.onrender.com/api/quizzes/${id}`);
      fetchQuizzes();
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
        Manage Assessments
      </motion.h2>

      {/* Create Quiz Form */}
      <motion.div
        className="stat-card p-6 mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h3 className="text-xl font-bold text-foreground mb-4">Create New Assessment</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <input
            type="text"
            placeholder="Quiz Title (e.g. React.js Basics)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="input-field"
          />
          <input
            type="text"
            placeholder="Subject (e.g. React)"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="input-field"
          />
        </div>

        {questions.map((q, index) => (
          <div key={index} className="border rounded-xl p-4 mb-4 bg-muted/30">
            <div className="flex justify-between items-center mb-3">
              <span className="font-semibold">Question {index + 1}</span>
              {questions.length > 1 && (
                <button onClick={() => removeQuestionField(index)} className="text-red-500">
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>

            <input
              type="text"
              placeholder="Enter question"
              value={q.question}
              onChange={(e) => handleQuestionChange(index, "question", e.target.value)}
              className="input-field w-full mb-3"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
              <input type="text" placeholder="Option A" value={q.option_a}
                onChange={(e) => handleQuestionChange(index, "option_a", e.target.value)}
                className="input-field" />
              <input type="text" placeholder="Option B" value={q.option_b}
                onChange={(e) => handleQuestionChange(index, "option_b", e.target.value)}
                className="input-field" />
              <input type="text" placeholder="Option C" value={q.option_c}
                onChange={(e) => handleQuestionChange(index, "option_c", e.target.value)}
                className="input-field" />
              <input type="text" placeholder="Option D" value={q.option_d}
                onChange={(e) => handleQuestionChange(index, "option_d", e.target.value)}
                className="input-field" />
            </div>

            <select
              value={q.correct_option}
              onChange={(e) => handleQuestionChange(index, "correct_option", e.target.value)}
              className="input-field"
            >
              <option value="A">Correct Answer: A</option>
              <option value="B">Correct Answer: B</option>
              <option value="C">Correct Answer: C</option>
              <option value="D">Correct Answer: D</option>
            </select>
          </div>
        ))}

        <div className="flex gap-3">
          <motion.button
            onClick={addQuestionField}
            className="btn-secondary flex items-center gap-2"
            whileHover={{ scale: 1.02 }}
          >
            <Plus className="w-4 h-4" />
            Add Question
          </motion.button>
          <motion.button
            onClick={handleCreateQuiz}
            className="btn-primary flex items-center gap-2"
            whileHover={{ scale: 1.02 }}
          >
            Create Assessment
          </motion.button>
        </div>
      </motion.div>

      {/* Quiz List */}
      <motion.div
        className="stat-card p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h3 className="text-lg font-semibold mb-4">All Assessments</h3>
        {quizzes.length === 0 ? (
          <p className="text-center text-gray-500">No assessments created yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {quizzes.map((quiz) => (
              <div key={quiz.id} className="border rounded-xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-gradient-primary">
                    <FileQuestion className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold">{quiz.title}</p>
                    <p className="text-sm text-gray-500">{quiz.subject} • {quiz.question_count} Qs</p>
                  </div>
                </div>
                <button onClick={() => handleDelete(quiz.id)} className="text-red-500">
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

export default Quizzes;