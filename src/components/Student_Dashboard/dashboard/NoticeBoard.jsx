import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, Briefcase, FileText } from 'lucide-react';
import axios from 'axios';

const iconMap = {
  hiring: Briefcase,
  assessment: FileText,
  project: Bell,
};

function NoticeBoard() {
  const [notices, setNotices] = useState([]);

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/notices');
        if (res.data.success) setNotices(res.data.data);
      } catch (err) {
        console.error('Failed to fetch notices:', err);
      }
    };
    fetchNotices();
  }, []);

  return (
    <section className="mb-8">
      <motion.h2
        className="text-2xl font-bold text-foreground mb-6"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
      >
        Notice Board
      </motion.h2>

      <motion.div
        className="stat-card p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-foreground">Latest Updates</h3>
          <motion.button
            className="text-primary hover:text-primary-glow font-medium"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            View All
          </motion.button>
        </div>

        <div className="space-y-4">
          {notices.map((notice, index) => {
            const Icon = iconMap[notice.type] || Bell;
            return (
              <motion.div
                key={notice.id}
                className="flex items-center gap-4 p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors cursor-pointer"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                whileHover={{ x: 4 }}
              >
                <div className="p-2 rounded-xl bg-gradient-primary">
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <span className="font-medium text-foreground">{notice.text}</span>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </section>
  );
}

export default NoticeBoard;