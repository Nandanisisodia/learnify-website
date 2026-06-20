import React, { useState } from 'react';
import Sidebar from '../dashboard/Sidebar';
import Header from '../dashboard/Header';
import StudentProfileForm from './StudentProfileForm';
import DomainsOfInterest from './DomainsOfInterest';

const EditProfilePage = ({ isDarkMode, toggleDarkMode }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [domainsOfInterest, setDomainsOfInterest] = useState([]);
  const [othersDomain, setOthersDomain] = useState('');

  const toggleSidebar = () => {
    setIsOpen((prev) => !prev);
  };

  const handleDomainChange = (domain, value) => {
    if(domain === 'others') {
      setOthersDomain(value);
    } else {
      setDomainsOfInterest((prev) => {
        if (value) {
          if (!prev.includes(domain)) {
            return [...prev, domain];
          }
        } else {
          return prev.filter((d) => d !== domain);
        }
        return prev;
      });
    }
  };

const handleFormSubmit = async (formData) => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (!user?.id) {
    alert('Please login again');
    return;
  }

  const fullData = {
    ...formData,
    domainsOfInterest,
    othersDomain,
  };
  
  try {
    const response = await fetch(`http://localhost:5000/api/profile/${user.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(fullData),
    });

    const result = await response.json();

    if (result.success) {
      alert('Profile updated successfully!');
    } else {
      alert('Error saving profile: ' + result.message);
    }
  } catch (error) {
    console.error('Network error:', error);
    alert('Network error: Could not connect to server');
  }
};

  return (
    <div className={`flex h-screen dashboard-container${isDarkMode ? ' dark' : ''}`}>
      {isOpen && <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} isDarkMode={isDarkMode} />}
      <div className={`flex-1 flex flex-col overflow-hidden main-content${isOpen ? '' : ' full-width'}`}>
        <Header onMenuClick={toggleSidebar} isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
        <div className="flex-1 overflow-y-auto pt-24 p-6">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Edit Profile</h1>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <StudentProfileForm onSubmit={handleFormSubmit} />
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <DomainsOfInterest selectedDomains={domainsOfInterest} onChange={handleDomainChange} othersValue={othersDomain} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfilePage;
