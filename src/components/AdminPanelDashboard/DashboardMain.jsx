import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FaFolderOpen,
  FaUserGraduate,
  FaBuilding,
  FaUserTie,
  FaChalkboardTeacher,
} from "react-icons/fa";
import axios from "axios";

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";

const PIE_COLORS = [
  "rgba(254, 109, 53,0.7)",
  "rgba(0, 208, 181,0.7)",
  "rgba(76, 175, 80, 0.7)",
  "rgba(244, 67, 54, 0.7)",
  "rgba(106, 98, 255, 0.7)",
];

const DashboardMain = () => {
  const [data, setData] = useState({
    totalStudents: 0,
    totalCompanies: 0,
    totalHires: 0,
    totalProjects: 0,
    recentProjects: [],
    assignmentStats: [],
    topDomains: [],
    topMentors: [],
  });

  useEffect(() => {
    const fetchOverview = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/dashboard-overview");
        if (res.data.success) setData(res.data.data);
      } catch (err) {
        console.error("Failed to fetch dashboard overview:", err);
      }
    };
    fetchOverview();
  }, []);

  const statCards = [
    { title: "Total Students", value: data.totalStudents, icon: FaUserGraduate, color: "primary", delay: 0.1 },
    { title: "Approved Companies", value: data.totalCompanies, icon: FaBuilding, color: "secondary", delay: 0.2 },
    { title: "Total Hires", value: data.totalHires, icon: FaUserTie, color: "accent", delay: 0.3 },
    { title: "Total Projects", value: data.totalProjects, icon: FaFolderOpen, color: "success", delay: 0.4 },
  ];

  return (
    <main className="flex-grow p-4 sm:p-6 flex flex-col gap-6">
      {/* Stats Overview */}
      <section className="mb-8">
        <motion.h2
          className="text-2xl font-bold text-foreground mb-6"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          Platform Overview
        </motion.h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat, index) => (
            <motion.div
              key={stat.title}
              className="stat-card p-6 flex items-center gap-4 cursor-pointer group"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.02, y: -4 }}
              whileTap={{ scale: 0.98 }}
              transition={{ delay: stat.delay, duration: 0.5 }}
            >
              <motion.div
                className={`p-3 rounded-2xl bg-gradient-${stat.color}`}
                whileHover={{ rotate: 5, scale: 1.1 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <stat.icon className="w-6 h-6 text-white" />
              </motion.div>
              <div>
                <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                <div className="text-muted-foreground">{stat.title}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Recent Projects & Assignment Progress */}
      <section className="flex flex-col lg:flex-row gap-6">
        {/* Recent Projects */}
        <div className="flex-1 stat-card p-6">
          <div className="flex justify-between items-center mb-4 pb-2 border-b border-border">
            <h3 className="text-lg sm:text-xl font-semibold text-foreground">
              Recent Projects
            </h3>
          </div>

          {data.recentProjects.length === 0 ? (
            <p className="text-muted-foreground text-center py-6">No projects added yet.</p>
          ) : (
            <ul className="space-y-3">
              {data.recentProjects.map((project, index) => (
                <motion.li
                  key={index}
                  className="flex justify-between items-center p-4 border-b border-border rounded-xl"
                  whileHover={{ backgroundColor: "hsl(var(--muted))", x: 4 }}
                >
                  <div className="flex items-center gap-2.5 font-medium text-base">
                    <span
                      className="flex justify-center items-center text-xl rounded-md p-2"
                      style={{ backgroundColor: "rgba(106, 98, 255, 0.2)", color: "rgba(106, 98, 255, 0.9)" }}
                    >
                      <FaFolderOpen />
                    </span>
                    <div>
                      <span className="block">{project.title}</span>
                      <span className="text-xs text-muted-foreground">Mentor: {project.mentor}</span>
                    </div>
                  </div>
                  <span className="text-sm text-muted-foreground">{project.students} Students</span>
                </motion.li>
              ))}
            </ul>
          )}
        </div>

        {/* Assignment Progress by Subject */}
        <div className="flex-1 stat-card p-6">
          <div className="flex justify-between items-center mb-4 pb-2 border-b border-border">
            <h3 className="text-lg sm:text-xl font-semibold text-foreground">
              Assignment Progress by Subject
            </h3>
          </div>

          {data.assignmentStats.length === 0 ? (
            <p className="text-muted-foreground text-center py-6">No assignments added yet.</p>
          ) : (
            <div className="flex flex-col gap-4">
              {data.assignmentStats.map((stat, index) => {
                const percentage = stat.total > 0 ? Math.round((stat.completed / stat.total) * 100) : 0;
                return (
                  <div key={index} className="flex flex-col">
                    <div className="flex justify-between mb-1 font-medium text-foreground">
                      <span>{stat.subject}</span>
                      <span>{stat.total} Tasks</span>
                    </div>
                    <div className="h-3 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        className="h-full rounded-full bg-gradient-primary"
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 1, delay: index * 0.1, ease: "easeOut" }}
                      />
                    </div>
                    <div className="text-right text-xs text-gray-600 mt-1">{percentage}% completed</div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Domain Interest & Top Mentors */}
      <section className="flex flex-col lg:flex-row gap-6 lg:gap-8 p-6 rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.1)]">
        {/* Domain Interest */}
        <div className="flex-1 stat-card p-6">
          <h3 className="text-lg font-semibold mb-4">
            Student Domain Interests
          </h3>
          {data.topDomains.length === 0 ? (
            <p className="text-muted-foreground text-center py-6">No domain data available yet.</p>
          ) : (
            <>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={data.topDomains}
                    dataKey="value"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    labelLine={false}
                  >
                    {data.topDomains.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>

              <div className="flex flex-col gap-3 mt-4">
                {data.topDomains.map((item, index) => (
                  <div key={index} className="flex flex-wrap items-center gap-2 p-2 shadow-[0_2px_6px_rgba(0,0,0,0.05)] rounded">
                    <span className="w-5 h-3 rounded" style={{ backgroundColor: PIE_COLORS[index % PIE_COLORS.length] }} />
                    <span className="font-semibold">{item.name}</span>
                    <span className="font-medium text-zinc-700">{item.value} students</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Top Mentors */}
        <div className="flex-1 stat-card p-6 overflow-x-auto">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Top Mentors</h3>
          </div>

          {data.topMentors.length === 0 ? (
            <p className="text-muted-foreground text-center py-6">No mentor data available yet.</p>
          ) : (
            <table className="min-w-full border-collapse">
              <thead>
                <tr>
                  <th className="text-left pb-2 border-b border-gray-200">MENTOR</th>
                  <th className="text-left pb-2 border-b border-gray-200">PROJECTS</th>
                  <th className="text-left pb-2 border-b border-gray-200">STUDENTS</th>
                </tr>
              </thead>
              <tbody>
                {data.topMentors.map((mentor, index) => (
                  <tr key={index} className="hover:bg-[rgba(254,109,53,0.1)] transition-colors">
                    <td className="py-2 border-b border-gray-200">
                      <div className="flex items-center gap-2">
                        <FaChalkboardTeacher className="text-[#00d0b5] text-2xl" />
                        <p className="font-medium m-0">{mentor.mentor}</p>
                      </div>
                    </td>
                    <td className="py-2 border-b border-gray-200">{mentor.project_count}</td>
                    <td className="py-2 border-b border-gray-200">{mentor.total_students || 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>
    </main>
  );
};

export default DashboardMain;