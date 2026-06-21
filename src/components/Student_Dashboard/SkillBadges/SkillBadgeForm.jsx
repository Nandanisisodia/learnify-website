import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Trash2, Award, CheckCircle } from 'lucide-react';

import Header from '../dashboard/Header';
import Sidebar from '../dashboard/Sidebar';
import RightSidebar from '../dashboard/RightSidebar';

const SkillBadgeForm = ({ isDarkMode, toggleDarkMode }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [formData, setFormData] = useState({
    badge_name: '',
    badge_description: '',
    verified: false,
  });
  const [badges, setBadges] = useState([]);

  const user = JSON.parse(localStorage.getItem('user'));

  const toggleSidebar = () => {
    setIsOpen((prev) => !prev);
  };

  const fetchBadges = async () => {
    if (!user?.id) return;
    try {
      const res = await axios.get(`http://localhost:5000/api/skill-badges/${user.id}`);
      if (res.data.success) setBadges(res.data.data);
    } catch (err) {
      console.error('Failed to fetch badges:', err);
    }
  };

  useEffect(() => {
    fetchBadges();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user?.id) {
      alert('Please login again');
      return;
    }
    try {
      await axios.post('http://localhost:5000/api/skill-badges', {
        user_id: user.id,
        ...formData
      });
      setFormData({ badge_name: '', badge_description: '', verified: false });
      fetchBadges();
    } catch (err) {
      console.error('Submit failed:', err);
      alert('Failed to add badge');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/skill-badges/${id}`);
      fetchBadges();
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  return (
    <div className={`dashboard-container${isDarkMode ? ' dark' : ''}`}>
      {isOpen && <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} isDarkMode={isDarkMode} />}
      <div className={`main-content${isOpen ? '' : ' full-width'}`}>
        <Header onMenuClick={toggleSidebar} isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />

        <div className="pt-24 p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Form */}
          <div className="bg-white rounded-lg shadow-md dark:bg-gray-700 p-6">
            <h2 className="text-2xl font-semibold mb-6 dark:text-white">Add New Skill Badge</h2>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <label className="block dark:text-white">
                Badge Name:
                <input
                  type="text"
                  placeholder="e.g. React Expert"
                  name="badge_name"
                  value={formData.badge_name}
                  onChange={handleChange}
                  required
                  className="w-full mt-1 p-2 border border-gray-300 rounded-md dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                />
              </label>

              <label className="block dark:text-white">
                Badge Description:
                <textarea
                  name="badge_description"
                  placeholder="Describe this skill/achievement..."
                  value={formData.badge_description}
                  onChange={handleChange}
                  required
                  className="w-full mt-1 p-2 border border-gray-300 rounded-md dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                ></textarea>
              </label>

              <label className="inline-flex items-center space-x-2 dark:text-white">
                <input
                  type="checkbox"
                  name="verified"
                  checked={formData.verified}
                  onChange={handleChange}
                  className="form-checkbox"
                />
                <span>Verified</span>
              </label>

              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
              >
                Add Badge
              </button>
            </form>
          </div>

          {/* Badges List */}
          <div className="bg-white rounded-lg shadow-md dark:bg-gray-700 p-6">
            <h2 className="text-2xl font-semibold mb-6 dark:text-white">My Skill Badges</h2>
            {badges.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-300 text-center">No badges added yet.</p>
            ) : (
              <div className="space-y-3 max-h-[500px] overflow-y-auto">
                {badges.map((b) => (
                  <div key={b.id} className="border border-gray-200 dark:border-gray-600 rounded-xl p-4 relative">
                    <button
                      onClick={() => handleDelete(b.id)}
                      className="absolute top-3 right-3 text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <div className="flex items-center gap-2">
                      <Award className="w-5 h-5 text-yellow-500" />
                      <h3 className="font-bold dark:text-white">{b.badge_name}</h3>
                      {b.verified && (
                        <CheckCircle className="w-4 h-4 text-green-500" title="Verified" />
                      )}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{b.badge_description}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <RightSidebar isDarkMode={isDarkMode} className="padded-top" />
    </div>
  );
};

export default SkillBadgeForm;