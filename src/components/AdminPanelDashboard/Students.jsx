import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { User, Clock, TrendingUp, CheckCircle, XCircle, Search } from "lucide-react";
import axios from "axios";

function Students() {
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchStudents = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/students');
      if (res.data.success) setStudents(res.data.data);
    } catch (err) {
      console.error('Failed to fetch students:', err);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleStudentApproval = async (id, action) => {
    try {
      await axios.patch(`http://localhost:5000/api/students/${id}/status`, { status: action });
      fetchStudents();
    } catch (err) {
      console.error('Status update failed:', err);
    }
  };

  return (
    <main className="p-4 sm:p-6 flex flex-col gap-6">
      <motion.h2
        className="text-2xl font-bold text-foreground mb-6"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
      >
        Manage Students
      </motion.h2>

      <motion.div
        className="stat-card p-6 mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search students..."
            className="input-field pl-12 w-full"
          />
        </div>
      </motion.div>

      {students.length === 0 ? (
        <p className="text-center text-gray-500">No students registered yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {students
            .filter((s) => s.full_name.toLowerCase().includes(searchTerm.toLowerCase()))
            .map((student, index) => (
              <motion.div
                key={student.id}
                className="stat-card p-6 cursor-pointer"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02, y: -4 }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 rounded-2xl bg-gradient-primary">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-foreground">{student.full_name}</h3>
                    <span className={`px-2 py-1 rounded-xl text-xs font-medium ${
                      student.status === "approved" ? "bg-success/20 text-success" :
                      student.status === "rejected" ? "bg-destructive/20 text-destructive" :
                      "bg-warning/20 text-warning"
                    }`}>
                      {student.status ? student.status.charAt(0).toUpperCase() + student.status.slice(1) : 'Pending'}
                    </span>
                  </div>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>Joined: {new Date(student.created_at).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <TrendingUp className="w-4 h-4" />
                    <span>{student.email}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <motion.button
                    onClick={() => handleStudentApproval(student.id, "approved")}
                    className="flex-1 btn-primary flex items-center justify-center gap-2"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <CheckCircle className="w-4 h-4" />
                    Approve
                  </motion.button>
                  <motion.button
                    onClick={() => handleStudentApproval(student.id, "rejected")}
                    className="flex-1 btn-secondary flex items-center justify-center gap-2"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <XCircle className="w-4 h-4" />
                    Reject
                  </motion.button>
                </div>
              </motion.div>
            ))}
        </div>
      )}
    </main>
  );
}

export default Students;