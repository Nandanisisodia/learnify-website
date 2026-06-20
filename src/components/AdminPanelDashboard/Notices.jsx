import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, Trash2, Bell, Briefcase, FileText } from "lucide-react";
import axios from "axios";

const iconMap = {
  hiring: Briefcase,
  assessment: FileText,
  project: Bell,
};

function Notices() {
  const [notices, setNotices] = useState([]);
  const [text, setText] = useState("");
  const [type, setType] = useState("hiring");

  const fetchNotices = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/notices");
      if (res.data.success) setNotices(res.data.data);
    } catch (err) {
      console.error("Failed to fetch notices:", err);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  const handleAdd = async () => {
    if (!text.trim()) return;
    try {
      await axios.post("http://localhost:5000/api/notices", { text, type });
      setText("");
      fetchNotices();
    } catch (err) {
      console.error("Failed to add notice:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/notices/${id}`);
      fetchNotices();
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
        Manage Notices
      </motion.h2>

      <motion.div
        className="stat-card p-6 mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h3 className="text-lg font-semibold mb-4">Add New Notice</h3>
        <div className="flex flex-col md:flex-row gap-4">
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="input-field md:w-48"
          >
            <option value="hiring">Hiring</option>
            <option value="assessment">Assessment</option>
            <option value="project">Project</option>
          </select>

          <input
            type="text"
            placeholder="Enter notice text..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="input-field flex-1"
          />

          <motion.button
            onClick={handleAdd}
            className="btn-primary flex items-center justify-center gap-2 whitespace-nowrap"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Plus className="w-4 h-4" />
            Add Notice
          </motion.button>
        </div>
      </motion.div>

      <motion.div
        className="stat-card p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h3 className="text-lg font-semibold mb-4">All Notices</h3>
        {notices.length === 0 ? (
          <p className="text-center text-gray-500">No notices added yet.</p>
        ) : (
          <div className="space-y-3">
            {notices.map((notice) => {
              const Icon = iconMap[notice.type] || Bell;
              return (
                <div key={notice.id} className="flex items-center justify-between p-4 rounded-xl bg-muted/50">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-gradient-primary">
                      <Icon className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-medium">{notice.text}</span>
                  </div>
                  <button onClick={() => handleDelete(notice.id)} className="text-red-500 hover:text-red-700">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </motion.div>
    </main>
  );
}

export default Notices;