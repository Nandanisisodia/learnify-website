import React, { useEffect, useState } from 'react';
import axios from 'axios';

function BottomProfileMessages() {
  const [completion, setCompletion] = useState(0);
  const [strength, setStrength] = useState(0);
  const [messages, setMessages] = useState([]);

  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Profile completion
        const profileRes = await axios.get(`https://learnify-backend-td3k.onrender.com/api/profile-completion/${user?.id}`);
        if (profileRes.data.success) {
          setCompletion(profileRes.data.data.completion);
          setStrength(profileRes.data.data.strength);
        }

        // Messages
        const msgRes = await axios.get(`https://learnify-backend-td3k.onrender.com/api/messages/${user?.id}`);
        if (msgRes.data.success) setMessages(msgRes.data.data);
      } catch (err) {
        console.error('Failed to fetch data:', err);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      {/* Profile Progress */}
      <div className="mb-6">
        <h4 className="text-lg font-semibold mb-2">Profile Completion</h4>
        <div className="w-full bg-gray-200 rounded-full h-4">
          <div className="bg-blue-500 h-4 rounded-full transition-all duration-500" style={{ width: `${completion}%` }}></div>
        </div>
        <span className="text-sm text-gray-600">{completion}%</span>

        <h4 className="text-lg font-semibold mt-4 mb-2">Profile Strength</h4>
        <div className="w-full bg-gray-200 rounded-full h-4">
          <div className="bg-yellow-400 h-4 rounded-full transition-all duration-500" style={{ width: `${strength}%` }}></div>
        </div>
        <span className="text-sm text-gray-600">{strength}%</span>
      </div>

      {/* Messages */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <h4 className="text-lg font-semibold">Messages</h4>
          <button className="text-blue-500 hover:text-blue-700">→</button>
        </div>

        {messages.length === 0 ? (
          <p className="text-gray-500 text-sm">No messages yet.</p>
        ) : (
          <div className="space-y-3">
            {messages.map((msg) => (
              <div key={msg.id} className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold">
                  {msg.sender_name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="font-medium">{msg.sender_name}</div>
                  <div className="text-sm text-gray-600">{msg.message}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default BottomProfileMessages;