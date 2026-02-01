import React from 'react';
import Sidebar from './dashboard/Sidebar';
import Header from './dashboard/Header';

const UserProfilePage = ({ isDarkMode, toggleDarkMode }) => {
  const [isOpen, setIsOpen] = React.useState(true);

  const toggleSidebar = () => {
    setIsOpen((prev) => !prev);
  };

  // Sample user data for demonstration
  const userData = {
    email: "nandanisisodia525@gmail.com",
    full_name: "Nandani Sisodia",
    contact_number: "96XXXXXXXX",
    linkedin_url: "https://www.linkedin.com/in/nandani-sisodia-928077338?",
    github_url: "https://github.com/Nandanisisodia",
    why_hire_me: "I am a passionate full-stack developer with expertise in React, Node.js, and cloud technologies. I have successfully delivered multiple projects and have strong problem-solving skills.",
    profile_completed: true,
    ai_skill_summary: "Experienced in machine learning algorithms, natural language processing, and computer vision. Proficient in Python, TensorFlow, and PyTorch.",
    domains_of_interest: ["Web Development", "Full Stack Development", "AI", "Data Science", "Cloud Computing"],
    others_domain: ""
  };

  return (
    <div className={`flex h-screen dashboard-container${isDarkMode ? ' dark' : ''}`}>
      {isOpen && <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} isDarkMode={isDarkMode} />}
      <div className={`flex-1 flex flex-col overflow-hidden main-content${isOpen ? '' : ' full-width'}`}>
        <Header onMenuClick={toggleSidebar} isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
        <div className="flex-1 overflow-y-auto pt-24 p-6">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Your Profile</h1>
            
            {/* User Email */}
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
              {/* Personal Information */}
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
                    <a href={userData.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 dark:text-blue-400">
                      {userData.linkedin_url}
                    </a>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">GitHub URL</label>
                    <a href={userData.github_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 dark:text-blue-400">
                      {userData.github_url}
                    </a>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Why Hire Me</label>
                    <p className="text-gray-800 dark:text-white whitespace-pre-wrap">{userData.why_hire_me}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Profile Completed</label>
                    <p className="text-gray-800 dark:text-white">
                      {userData.profile_completed ? 'Yes' : 'No'}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">AI Skill Summary</label>
                    <p className="text-gray-800 dark:text-white whitespace-pre-wrap">{userData.ai_skill_summary}</p>
                  </div>
                </div>
              </div>

              {/* Domains of Interest */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Domains of Interest</h2>
                
                <div className="space-y-3">
                  {userData.domains_of_interest.map((domain, index) => (
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

                {/* Edit Profile Button */}
                <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <button
                    onClick={() => window.location.href = '/dashboard/edit-profile'}
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
