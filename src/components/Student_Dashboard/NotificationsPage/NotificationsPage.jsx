import { useState, useEffect } from 'react';
import axios from 'axios';
import './NotificationPage.css';

import Header from '../dashboard/Header';
import RightSidebar from '../dashboard/RightSidebar';
import Sidebar from '../dashboard/Sidebar';

const NotificationsPage = ({ isDarkMode, toggleDarkMode }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [notifications, setNotifications] = useState([]);

  const toggleSidebar = () => {
    setIsOpen((prev) => !prev);
  };

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/notices');
        if (res.data.success) setNotifications(res.data.data);
      } catch (err) {
        console.error('Failed to fetch notifications:', err);
      }
    };
    fetchNotices();
  }, []);

  const getTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 60) return `${diffMins} min${diffMins !== 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
  };

  return (
    <div className={`dashboard-container${isDarkMode ? ' dark' : ''}`}>
      {isOpen && <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} isDarkMode={isDarkMode} />}
      <div className={`main-content${isOpen ? '' : ' full-width'}`}>
        <Header onMenuClick={toggleSidebar} isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />

        <div className="pt-24 page-card dark:bg-gray-700 dark:text-white">
          <h2 className="notifications-main-title">🔔 Notifications</h2>
          <div className="notifications-list">

            {notifications.length === 0 ? (
              <p className="text-center text-gray-500 py-6">No notifications yet.</p>
            ) : (
              notifications.map((notification) => (
                <div className="notification-item" key={notification.id}>
                  <div className="notification-content">
                    <h3 className="notification-title">{notification.text}</h3>
                    <p className="notification-message">Category: {notification.type}</p>
                  </div>
                  <span className="notification-time">{getTimeAgo(notification.created_at)}</span>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
      <RightSidebar isDarkMode={isDarkMode} className="padded-top" />
    </div>
  );
};

export default NotificationsPage;