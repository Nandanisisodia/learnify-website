import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Mail, Trash2, User, MessageSquare } from "lucide-react";
import axios from "axios";

function ContactMessages() {
  const [messages, setMessages] = useState([]);

  const fetchMessages = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/contact");
      if (res.data.success) setMessages(res.data.data);
    } catch (err) {
      console.error("Failed to fetch messages:", err);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/contact/${id}`);
      fetchMessages();
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  return (
    <main className="p-4 sm:p-6 flex flex-col gap-6">
      <motion.h2
        className="text-2xl font-bold text-foreground mb-6"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
      >
        Contact Messages
      </motion.h2>

      <motion.div
        className="stat-card p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {messages.length === 0 ? (
          <p className="text-center text-gray-500 py-6">No messages received yet.</p>
        ) : (
          <div className="space-y-4">
            {messages.map((msg, index) => (
              <motion.div
                key={msg.id}
                className="border rounded-xl p-4 relative"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <button
                  onClick={() => handleDelete(msg.id)}
                  className="absolute top-3 right-3 text-red-500 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <div className="flex items-center gap-2 mb-2">
                  <div className="p-2 rounded-xl bg-gradient-primary">
                    <Mail className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <span className="font-semibold">{msg.name}</span>
                    <span className="text-xs text-gray-500 ml-2">{msg.email}</span>
                  </div>
                  {msg.inquiry_type && (
                    <span className="ml-auto mr-8 text-xs px-2 py-1 bg-primary/10 text-primary rounded-full">
                      {msg.inquiry_type}
                    </span>
                  )}
                </div>

                <p className="text-sm text-gray-700 ml-10">{msg.message}</p>
                <p className="text-xs text-gray-400 ml-10 mt-1">
                  {new Date(msg.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </p>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </main>
  );
}

export default ContactMessages;