import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, Trash2 } from "lucide-react";
import axios from "axios";

function Assignments() {
  const [assignments, setAssignments] = useState([]);
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState({
    user_id: "",
    task: "",
    subject: "",
    due_date: "",
    status: "Not Started",
  });

  const fetchStudents = async () => {
    try {
      const res = await axios.get("https://learnify-backend-td3k.onrender.com/api/students");
      if (res.data.success) setStudents(res.data.data);
    } catch (err) {
      console.error("Failed to fetch students:", err);
    }
  };

  const fetchAssignments = async () => {
    try {
      const res = await axios.get("https://learnify-backend-td3k.onrender.com/api/all-assignments");
      if (res.data.success) setAssignments(res.data.data);
    } catch (err) {
      console.error("Failed to fetch assignments:", err);
    }
  };

  useEffect(() => {
    fetchStudents();
    fetchAssignments();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("https://learnify-backend-td3k.onrender.com/api/assignments", form);
      setForm({ user_id: "", task: "", subject: "", due_date: "", status: "Not Started" });
      fetchAssignments();
      alert("Assignment added successfully!");
    } catch (err) {
      console.error("Failed to add assignment:", err);
      alert("Failed to add assignment.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://learnify-backend-td3k.onrender.com/api/assignments/${id}`);
      fetchAssignments();
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
        Manage Assignments
      </motion.h2>

      {/* Add Assignment Form */}
      <motion.div
        className="stat-card p-6 mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h3 className="text-lg font-semibold mb-4">Add New Assignment</h3>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          <select
            name="user_id"
            value={form.user_id}
            onChange={handleChange}
            required
            className="input-field px-4 py-2 border rounded-lg"
          >
            <option value="">Select Student</option>
            {students.map((s) => (
              <option key={s.id} value={s.id}>{s.full_name} ({s.email})</option>
            ))}
          </select>

          <input
            name="task"
            value={form.task}
            onChange={handleChange}
            placeholder="Task description"
            required
            className="input-field px-4 py-2 border rounded-lg"
          />

          <input
            name="subject"
            value={form.subject}
            onChange={handleChange}
            placeholder="Subject"
            required
            className="input-field px-4 py-2 border rounded-lg"
          />

          <input
            name="due_date"
            type="date"
            value={form.due_date}
            onChange={handleChange}
            required
            className="input-field px-4 py-2 border rounded-lg"
          />

          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="input-field px-4 py-2 border rounded-lg"
          >
            <option value="Not Started">Not Started</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>

          <motion.button
            type="submit"
            className="btn-primary flex items-center justify-center gap-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Plus className="w-4 h-4" />
            Add Assignment
          </motion.button>
        </form>
      </motion.div>

      {/* Assignments Table */}
      <motion.div
        className="stat-card p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h3 className="text-lg font-semibold mb-4">All Assignments</h3>
        {assignments.length === 0 ? (
          <p className="text-center text-gray-500">No assignments added yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border px-4 py-2 text-left">Student</th>
                  <th className="border px-4 py-2 text-left">Task</th>
                  <th className="border px-4 py-2 text-left">Subject</th>
                  <th className="border px-4 py-2 text-left">Due Date</th>
                  <th className="border px-4 py-2 text-left">Status</th>
                  <th className="border px-4 py-2 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {assignments.map((a) => (
                  <tr key={a.id}>
                    <td className="border px-4 py-2">{a.full_name}</td>
                    <td className="border px-4 py-2">{a.task}</td>
                    <td className="border px-4 py-2">{a.subject}</td>
                    <td className="border px-4 py-2">{new Date(a.due_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                    <td className="border px-4 py-2">
                      <span className={`font-semibold ${
                        a.status === 'Completed' ? 'text-green-600' :
                        a.status === 'In Progress' ? 'text-yellow-600' : 'text-gray-500'
                      }`}>{a.status}</span>
                    </td>
                    <td className="border px-4 py-2">
                      <button onClick={() => handleDelete(a.id)} className="text-red-600 hover:text-red-800">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </main>
  );
}

export default Assignments;