import React, { useState, useEffect } from 'react';
import axios from 'axios';

const StudentProfileForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    full_name: '',
    contact_number: '',
    linkedin_url: '',
    github_url: '',
    why_hire_me: '',
    profile_completed: false,
    ai_skill_summary: '',
  });

  useEffect(() => {
    const fetchProfile = async () => {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user?.email) return;
      try {
        const res = await axios.get(`https://learnify-backend-td3k.onrender.com/api/profile/${user.email}`);
        if (res.data.success) {
          const d = res.data.data;
          setFormData({
            full_name: d.full_name || '',
            contact_number: d.contact_number || '',
            linkedin_url: d.linkedin_url || '',
            github_url: d.github_url || '',
            why_hire_me: d.why_hire_me || '',
            profile_completed: d.profile_completed || false,
            ai_skill_summary: d.ai_skill_summary || '',
          });
        }
      } catch (err) {
        console.error('Failed to fetch profile:', err);
      }
    };
    fetchProfile();
  }, []);


  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Client-side validation
    if (!formData.full_name || !/^[A-Za-z ]+$/.test(formData.full_name)) {
      alert('Full name is required and should contain only alphabets');
      return;
    }

    if (!formData.contact_number || !/^[0-9]{10}$/.test(formData.contact_number)) {
      alert('Contact number is required and should be exactly 10 digits');
      return;
    }

    if (formData.linkedin_url && !/^https?:\/\/(www\.)?linkedin\.com\/.*$/.test(formData.linkedin_url)) {
      alert('Please provide a valid LinkedIn URL');
      return;
    }

    if (formData.github_url && !/^https?:\/\/(www\.)?github\.com\/.*$/.test(formData.github_url)) {
      alert('Please provide a valid GitHub URL');
      return;
    }

    if (!formData.why_hire_me) {
      alert('Please provide why hire me information');
      return;
    }

    if (!formData.ai_skill_summary) {
      alert('Please provide AI skill summary');
      return;
    }

    onSubmit(formData); // Call the onSubmit prop with formData
  };

  return (
    <form className="w-[95%] max-w-none mx-auto bg-white p-6 rounded-lg shadow-md font-sans" onSubmit={handleSubmit}>
      <div className="mb-4 flex flex-col">
        <label className="font-semibold mb-2 text-gray-700" htmlFor="full_name">Full Name</label>
        <input
          type="text"
          id="full_name"
          name="full_name"
          value={formData.full_name}
          onChange={handleChange}
          placeholder="Enter full name"
          required
          className="p-2.5 border border-gray-300 rounded-md text-sm font-inherit resize-vertical"
        />
      </div>

      <div className="mb-4 flex flex-col">
        <label className="font-semibold mb-2 text-gray-700" htmlFor="contact_number">Contact Number</label>
        <input
          type="text"
          id="contact_number"
          name="contact_number"
          value={formData.contact_number}
          onChange={handleChange}
          placeholder="Enter contact number"
          required
          className="p-2.5 border border-gray-300 rounded-md text-sm font-inherit resize-vertical"
        />
      </div>

      <div className="mb-4 flex flex-col">
        <label className="font-semibold mb-2 text-gray-700" htmlFor="linkedin_url">LinkedIn URL</label>
        <input
          type="url"
          id="linkedin_url"
          name="linkedin_url"
          value={formData.linkedin_url}
          onChange={handleChange}
          placeholder="Enter LinkedIn profile URL"
          className="p-2.5 border border-gray-300 rounded-md text-sm font-inherit resize-vertical"
        />
      </div>

      <div className="mb-4 flex flex-col">
        <label className="font-semibold mb-2 text-gray-700" htmlFor="github_url">GitHub URL</label>
        <input
          type="url"
          id="github_url"
          name="github_url"
          value={formData.github_url}
          onChange={handleChange}
          placeholder="Enter GitHub profile URL"
          className="p-2.5 border border-gray-300 rounded-md text-sm font-inherit resize-vertical"
        />
      </div>

      <div className="mb-4 flex flex-col">
        <label className="font-semibold mb-2 text-gray-700" htmlFor="why_hire_me">Why Hire Me</label>
        <textarea
          id="why_hire_me"
          name="why_hire_me"
          value={formData.why_hire_me}
          onChange={handleChange}
          placeholder="Explain why someone should hire you"
          rows="4"
          className="p-2.5 border border-gray-300 rounded-md text-sm font-inherit resize-vertical"
        />
      </div>

      <div className="mb-4 flex flex-row items-center">
        <input
          type="checkbox"
          id="profile_completed"
          name="profile_completed"
          checked={formData.profile_completed}
          onChange={handleChange}
          className="mr-2 w-auto self-start"
        />
        <label className="font-semibold text-gray-700" htmlFor="profile_completed">Profile Completed</label>
      </div>

      <div className="mb-4 flex flex-col">
        <label className="font-semibold mb-2 text-gray-700" htmlFor="ai_skill_summary">AI Skill Summary</label>
        <textarea
          id="ai_skill_summary"
          name="ai_skill_summary"
          value={formData.ai_skill_summary}
          onChange={handleChange}
          placeholder="Summarize your AI skills"
          rows="4"
          className="p-2.5 border border-gray-300 rounded-md text-sm font-inherit resize-vertical"
        />
      </div>

      <button
        type="submit"
        className="bg-blue-500 text-white py-3 px-5 border-none rounded-md font-bold cursor-pointer transition-colors duration-200 hover:bg-blue-700"
      >
        Save Profile
      </button>
    </form>
  );
};

export default StudentProfileForm;
