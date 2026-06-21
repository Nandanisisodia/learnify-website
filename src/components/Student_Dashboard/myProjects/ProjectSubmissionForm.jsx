import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Trash2, ExternalLink } from 'lucide-react';

function ProjectSubmissionForm() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    tech_stack: '',
    contributions: '',
    is_open_source: false,
    github_pr_link: ''
  });

  const [showModal, setShowModal] = useState(false);
  const [projects, setProjects] = useState([]);

  const user = JSON.parse(localStorage.getItem('user'));

  const fetchProjects = async () => {
    if (!user?.id) return;
    try {
      const res = await axios.get(`http://localhost:5000/api/student-projects/${user.id}`);
      if (res.data.success) setProjects(res.data.data);
    } catch (err) {
      console.error('Failed to fetch projects:', err);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user?.id) {
      alert('Please login again');
      return;
    }
    try {
      await axios.post('http://localhost:5000/api/student-projects', {
        user_id: user.id,
        ...formData
      });
      setShowModal(true);
      setFormData({
        title: '',
        description: '',
        tech_stack: '',
        contributions: '',
        is_open_source: false,
        github_pr_link: ''
      });
      fetchProjects();
    } catch (err) {
      console.error('Submit failed:', err);
      alert('Failed to submit project');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/student-projects/${id}`);
      fetchProjects();
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  const closeModal = () => setShowModal(false);

  return (
    <div className="min-h-screen bg-gradient-to-tr from-blue-100 to-indigo-200 px-4 py-10">
      <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Form */}
        <div className="bg-white p-8 rounded-2xl shadow-2xl border border-gray-200 relative">
          <h2 className="text-2xl font-extrabold text-center mb-4 text-indigo-700">
            Submit a Project
          </h2>
          <p className="text-center text-gray-500 mb-6 text-sm">
            Submit your project details below.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">

            {[
              { label: "Project Title", name: "title", type: "text", placeholder: "Project Title" },
              { label: "Technology Stack", name: "tech_stack", type: "text", placeholder: "React, Node.js..." },
              { label: "GitHub PR Link", name: "github_pr_link", type: "url", placeholder: "https://github.com/..." }
            ].map((field) => (
              <div key={field.name}>
                <label className="block text-gray-700 font-semibold mb-1 text-sm">{field.label}</label>
                <input
                  type={field.type}
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                  placeholder={field.placeholder}
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition shadow-sm text-sm"
                  required={field.name !== 'github_pr_link'}
                />
              </div>
            ))}

            <div>
              <label className="block text-gray-700 font-semibold mb-1 text-sm">Project Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Brief project description..."
                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition shadow-sm text-sm"
                rows="3"
                required
              ></textarea>
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-1 text-sm">Your Contributions</label>
              <textarea
                name="contributions"
                value={formData.contributions}
                onChange={handleChange}
                placeholder="E.g., frontend, backend..."
                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition shadow-sm text-sm"
                rows="2"
                required
              ></textarea>
            </div>

            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                name="is_open_source"
                checked={formData.is_open_source}
                onChange={handleChange}
                className="w-5 h-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label className="text-gray-700 font-medium text-sm">
                Is this project open-source?
              </label>
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition duration-300 shadow-lg hover:shadow-indigo-400"
            >
              🚀 Submit Project
            </button>
          </form>

          {showModal && (
            <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
              <div className="bg-white rounded-2xl p-8 shadow-xl w-full max-w-md transform scale-100 transition-all">
                <h3 className="text-xl font-bold text-center text-green-600 mb-4">✅ Project Submitted!</h3>
                <p className="text-center text-gray-600 mb-6">
                  Your project has been submitted successfully.
                </p>
                <button
                  onClick={closeModal}
                  className="block mx-auto bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-5 rounded-lg transition duration-300"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>

        {/* My Projects List */}
        <div className="bg-white p-8 rounded-2xl shadow-2xl border border-gray-200">
          <h2 className="text-2xl font-extrabold text-center mb-6 text-indigo-700">
            My Submitted Projects
          </h2>

          {projects.length === 0 ? (
            <p className="text-center text-gray-500">No projects submitted yet.</p>
          ) : (
            <div className="space-y-4 max-h-[600px] overflow-y-auto">
              {projects.map((p) => (
                <div key={p.id} className="border border-gray-200 rounded-xl p-4 relative">
                  <button
                    onClick={() => handleDelete(p.id)}
                    className="absolute top-3 right-3 text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <h3 className="font-bold text-indigo-700 pr-6">{p.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{p.description}</p>
                  <p className="text-xs text-gray-500 mt-2">
                    <span className="font-semibold">Tech:</span> {p.tech_stack}
                  </p>
                  <p className="text-xs text-gray-500">
                    <span className="font-semibold">Contributions:</span> {p.contributions}
                  </p>
                  {p.is_open_source && (
                    <span className="inline-block mt-2 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                      Open Source
                    </span>
                  )}
                  {p.github_pr_link && (
                    <a
                      href={p.github_pr_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-xs text-blue-600 hover:underline mt-2"
                    >
                      <ExternalLink className="w-3 h-3" /> View on GitHub
                    </a>
                  )}
                  <p className="text-xs text-gray-400 mt-2">
                    {new Date(p.created_at).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProjectSubmissionForm;