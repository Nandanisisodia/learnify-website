import React, { useEffect, useState } from 'react';
import axios from 'axios';

function AssignmentsSection() {
  const [assignments, setAssignments] = useState([]);
  const [search, setSearch] = useState('');

  const user = JSON.parse(localStorage.getItem('user'));

  const fetchAssignments = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/assignments/${user?.id}`);
      if (res.data.success) setAssignments(res.data.data);
    } catch (err) {
      console.error('Failed to fetch assignments:', err);
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/assignments/${id}`);
      fetchAssignments();
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await axios.patch(`http://localhost:5000/api/assignments/${id}`, { status: newStatus });
      fetchAssignments();
    } catch (err) {
      console.error('Update failed:', err);
    }
  };

  const statusColor = (status) => {
    if (status === 'Completed') return 'text-green-600';
    if (status === 'In Progress') return 'text-yellow-600';
    return 'text-gray-500';
  };

  const filtered = assignments.filter(a =>
    a.subject.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4 bg-white rounded shadow assignments-section mb-8">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Assignments</h3>
        <input
          type="text"
          placeholder="Search by Subject"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {filtered.length === 0 ? (
        <p className="text-gray-500 text-center py-4">No assignments found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-4 py-2 text-left">No</th>
                <th className="border px-4 py-2 text-left">Task</th>
                <th className="border px-4 py-2 text-left">Subject</th>
                <th className="border px-4 py-2 text-left">Due Date</th>
                <th className="border px-4 py-2 text-left">Status</th>
                <th className="border px-4 py-2 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((a, index) => (
                <tr key={a.id}>
                  <td className="border px-4 py-2">{String(index + 1).padStart(2, '0')}</td>
                  <td className="border px-4 py-2">{a.task}</td>
                  <td className="border px-4 py-2">{a.subject}</td>
                  <td className="border px-4 py-2">{new Date(a.due_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                  <td className="border px-4 py-2">
                    <select
                      value={a.status}
                      onChange={(e) => handleStatusChange(a.id, e.target.value)}
                      className={`font-semibold bg-transparent border-none cursor-pointer ${statusColor(a.status)}`}
                    >
                      <option value="Not Started">Not Started</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </td>
                  <td className="border px-4 py-2">
                    <button onClick={() => handleDelete(a.id)} className="text-red-600 hover:text-red-800">🗑️</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AssignmentsSection;