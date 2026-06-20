import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MessageSquare, Star, User, Plus, Trash2 } from "lucide-react";
import axios from "axios";

function MentorReview() {
  const [mentorReviews, setMentorReviews] = useState([]);
  const [newReviewMentor, setNewReviewMentor] = useState("");
  const [newReviewText, setNewReviewText] = useState("");
  const [newReviewRating, setNewReviewRating] = useState("");

  const fetchReviews = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/mentor-reviews");
      if (res.data.success) setMentorReviews(res.data.data);
    } catch (err) {
      console.error("Failed to fetch reviews:", err);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const addMentorReview = async () => {
    if (!newReviewMentor || !newReviewText || !newReviewRating) return;
    try {
      await axios.post("http://localhost:5000/api/mentor-reviews", {
        mentor: newReviewMentor,
        feedback: newReviewText,
        rating: parseFloat(newReviewRating),
      });
      setNewReviewMentor("");
      setNewReviewText("");
      setNewReviewRating("");
      fetchReviews();
    } catch (err) {
      console.error("Failed to add review:", err);
    }
  };

  const removeReview = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/mentor-reviews/${id}`);
      fetchReviews();
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  const renderStars = (rating) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating ? "text-warning fill-warning" : "text-muted-foreground"
            }`}
          />
        ))}
        <span className="ml-2 text-sm font-medium text-foreground">{rating}</span>
      </div>
    );
  };

  return (
    <main className="p-4 sm:p-6 flex flex-col gap-6">
      <motion.h2
        className="text-2xl font-bold text-foreground mb-6"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
      >
        Mentor Reviews
      </motion.h2>

      <motion.div
        className="stat-card p-6 mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h3 className="text-xl font-bold text-foreground mb-4">Add New Review</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              Mentor Name
            </label>
            <input
              type="text"
              placeholder="Mentor Name"
              value={newReviewMentor}
              onChange={(e) => setNewReviewMentor(e.target.value)}
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              Review Text
            </label>
            <input
              type="text"
              placeholder="Review Text"
              value={newReviewText}
              onChange={(e) => setNewReviewText(e.target.value)}
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              Rating (0-5)
            </label>
            <input
              type="number"
              placeholder="Rating (0-5)"
              value={newReviewRating}
              onChange={(e) => setNewReviewRating(e.target.value)}
              min="0"
              max="5"
              step="0.1"
              className="input-field"
            />
          </div>
        </div>
        <motion.button
          onClick={addMentorReview}
          className="btn-primary flex items-center gap-2"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Plus className="w-4 h-4" />
          Add Review
        </motion.button>
      </motion.div>

      {mentorReviews.length === 0 ? (
        <p className="text-center text-gray-500">No reviews added yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mentorReviews.map((review, index) => (
            <motion.div
              key={review.id}
              className="stat-card p-6 cursor-pointer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02, y: -4 }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-2xl bg-gradient-accent">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-foreground">{review.mentor}</h4>
                  </div>
                </div>
                <button onClick={() => removeReview(review.id)} className="text-red-500 hover:text-red-700">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-start gap-3 mb-4">
                <MessageSquare className="w-5 h-5 text-muted-foreground mt-1" />
                <p className="text-muted-foreground italic leading-relaxed">
                  "{review.feedback}"
                </p>
              </div>

              <div className="flex items-center justify-between">
                {renderStars(Number(review.rating))}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </main>
  );
}

export default MentorReview;