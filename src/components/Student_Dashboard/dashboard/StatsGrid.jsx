import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Calendar, Star, TrendingUp } from 'lucide-react';
import axios from 'axios';

function StatsGrid() {
  const [stats, setStats] = useState({
    attendance: 0,
    tasks_completed: 0,
    tasks_in_progress: 0,
    reward_points: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user?.id) return;
        const res = await axios.get(`http://localhost:5000/api/stats/${user.id}`);
        if (res.data.success) {
          setStats(res.data.data);
        }
      } catch (err) {
        console.error('Failed to fetch stats:', err);
      }
    };
    fetchStats();
  }, []);

  const statCards = [
    { title: "Attendance", value: `${stats.attendance}%`, icon: CheckCircle, color: "primary", delay: 0.1 },
    { title: "Tasks Completed", value: `${stats.tasks_completed}`, icon: Calendar, color: "secondary", delay: 0.2 },
    { title: "Tasks in Progress", value: `${stats.tasks_in_progress}%`, icon: Star, color: "accent", delay: 0.3 },
    { title: "Reward Points", value: `${stats.reward_points}`, icon: TrendingUp, color: "success", delay: 0.4 },
  ];

  return (
    <section className="mb-8">
      <motion.h2
        className="text-2xl font-bold text-foreground mb-6"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
      >
        Your Progress
      </motion.h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => (
          <motion.div
            key={stat.title}
            className="stat-card p-6 flex items-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: stat.delay, duration: 0.5 }}
          >
            <div className={`p-3 rounded-2xl bg-gradient-${stat.color}`}>
              <stat.icon className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-2xl font-bold text-foreground">{stat.value}</div>
              <div className="text-muted-foreground">{stat.title}</div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

export default StatsGrid;