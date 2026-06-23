import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { TrendingUp, Users, GraduationCap, Building2 } from "lucide-react";
import axios from "axios";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

function Analytics() {
  const [analytics, setAnalytics] = useState({
    totalHires: 0,
    totalCompanies: 0,
    totalStudents: 0,
    approvedStudents: 0,
    topCompanies: []
  });

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await axios.get("https://learnify-backend-td3k.onrender.com/api/analytics");
        if (res.data.success) setAnalytics(res.data.data);
      } catch (err) {
        console.error("Failed to fetch analytics:", err);
      }
    };
    fetchAnalytics();
  }, []);

  const analyticsCards = [
    { title: "Total Students", value: analytics.totalStudents, icon: Users, color: "primary" },
    { title: "Approved Students", value: analytics.approvedStudents, icon: GraduationCap, color: "secondary" },
    { title: "Total Hires", value: analytics.totalHires, icon: TrendingUp, color: "accent" },
    { title: "Active Companies", value: analytics.totalCompanies, icon: Building2, color: "success" },
  ];

  const placementChartData = {
    labels: analytics.topCompanies.map((c) => c.name),
    datasets: [
      {
        label: "Hires",
        data: analytics.topCompanies.map((c) => c.hires),
        backgroundColor: [
          "#9370DB",
          "rgba(0, 208, 181,1)",
          "rgba(254, 109, 53,0.6)",
          "#FF6384",
          "#36A2EB"
        ],
        borderColor: "#ffffff",
        borderWidth: 2,
      },
    ],
  };

  return (
    <section className="mb-8">
      <motion.h2
        className="text-2xl font-bold text-foreground mb-6"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
      >
        Analytics Overview
      </motion.h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {analyticsCards.map((card, index) => (
          <motion.div
            key={card.title}
            className="stat-card p-6 flex items-center gap-4 cursor-pointer"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02, y: -4 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
          >
            <motion.div
              className={`p-3 rounded-2xl bg-gradient-${card.color}`}
              whileHover={{ rotate: 5, scale: 1.1 }}
            >
              <card.icon className="w-6 h-6 text-white" />
            </motion.div>
            <div>
              <div className="text-2xl font-bold text-foreground">{card.value}</div>
              <div className="text-muted-foreground">{card.title}</div>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        className="stat-card p-6 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary" />
          Top Hiring Companies
        </h3>
        {analytics.topCompanies.length === 0 ? (
          <p className="text-muted-foreground">No approved companies yet.</p>
        ) : (
          <div className="flex flex-wrap gap-3">
            {analytics.topCompanies.map((company, i) => (
              <motion.span
                key={i}
                className="px-4 py-2 bg-gradient-primary text-white rounded-xl font-medium"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {company.name} ({company.hires})
              </motion.span>
            ))}
          </div>
        )}
      </motion.div>

      {analytics.topCompanies.length > 0 && (
        <motion.div
          className="stat-card p-6 max-w-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <h3 className="text-xl font-bold text-foreground mb-4">Hires Distribution by Company</h3>
          <div className="h-64">
            <Pie
              data={placementChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false
              }}
            />
          </div>
        </motion.div>
      )}
    </section>
  );
}

export default Analytics;