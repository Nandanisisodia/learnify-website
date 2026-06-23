import React, { useEffect, useState } from 'react';
import Sidebar from './dashboard/Sidebar';
import Header from './dashboard/Header';
import axios from 'axios';

const UserProfilePage = ({ isDarkMode, toggleDarkMode }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  const toggleSidebar = () => {
    setIsOpen((prev) => !prev);
  };

  useEffect(() => {
    const fetchProfile = async () => {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user || !user.email) {
        setLoading(false);
        return;
      }
      try {
        const res = await axios.get('https://learnify-backend-td3k.onrender.com/api/profile/' + user.email);
        if (res.data.success) {
          setUserData(res.data.data);
        }
      } catch (err) {
        console.error('Failed to fetch profile:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className={'flex h-screen dashboard-container' + (isDarkMode ? ' dark' : '')}>
        {isOpen && <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} isDarkMode={isDarkMode} />}
        <div className={'flex-1 flex flex-col overflow-hidden main-content' + (isOpen ? '' : ' full-width')}>
          <Header onMenuClick={toggleSidebar} isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
          <div className="flex-1 flex items-center justify-center pt-24">
            <p className="text-gray-500">Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className={'flex h-screen dashboard-container' + (isDarkMode ? ' dark' : '')}>
        {isOpen && <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} isDarkMode={isDarkMode} />}
        <div className={'flex-1 flex flex-col overflow-hidden main-content' + (isOpen ? '' : ' full-width')}>
          <Header onMenuClick={toggleSidebar} isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
          <div className="flex-1 flex flex-col items-center justify-center pt-24">
            <p className="text-gray-500 mb-4">No profile data found.</p>
            <button
              onClick={() => { window.location.href = '/dashboard/edit-profile'; }}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md"
            >
              Complete Your Profile
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={'flex h-screen dashboard-container' + (isDarkMode ? ' dark' : '')}>
      {isOpen && <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} isDarkMode={isDarkMode} />}
      <div className={'flex-1 flex flex-col overflow-hidden main-content' + (isOpen ? '' : ' full-width')}>
        <Header onMenuClick={toggleSidebar} isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
        <div className="flex-1 overflow-y-auto pt-24 p-6">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Your Profile</h1>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Account Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Email</label>
                  <p className="text-lg text-gray-800 dark:text-white">{userData.email}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Personal Information</h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Full Name</label>
                    <p className="text-gray-800 dark:text-white">{userData.full_name}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Contact Number</label>
                    <p className="text-gray-800 dark:text-white">{userData.contact_number}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">LinkedIn URL</label>
                    {userData.linkedin_url ? (
                      <a href={userData.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 dark:text-blue-400">
                        {userData.linkedin_url}
                      </a>
                    ) : (
                      <p className="text-gray-400">Not added</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">GitHub URL</label>
                    {userData.github_url ? (
                      <a href={userData.github_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 dark:text-blue-400">
                        {userData.github_url}
                      </a>
                    ) : (
                      <p className="text-gray-400">Not added</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Why Hire Me</label>
                    <p className="text-gray-800 dark:text-white whitespace-pre-wrap">{userData.why_hire_me ? userData.why_hire_me : 'Not added'}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Profile Completed</label>
                    <p className="text-gray-800 dark:text-white">{userData.profile_completed ? 'Yes' : 'No'}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">AI Skill Summary</label>
                    <p className="text-gray-800 dark:text-white whitespace-pre-wrap">{userData.ai_skill_summary ? userData.ai_skill_summary : 'Not added'}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Domains of Interest</h2>

                <div className="space-y-3">
                  {(userData.domains_of_interest || []).map((domain, index) => (
                    <div key={index} className="flex items-center">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                      <span className="text-gray-800 dark:text-white">{domain}</span>
                    </div>
                  ))}

                  {userData.others_domain && (
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                      <span className="text-gray-800 dark:text-white">Others: {userData.others_domain}</span>
                    </div>
                  )}
                </div>

                <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <button
                    onClick={() => { window.location.href = '/dashboard/edit-profile'; }}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200"
                  >
                    Edit Profile
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;