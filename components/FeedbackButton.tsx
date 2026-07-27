"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function FeedbackButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (rating === 0) return;
    const feedback = { rating, comment, date: new Date().toISOString() };
    const existing = JSON.parse(localStorage.getItem("agro_feedback") || "[]");
    existing.push(feedback);
    localStorage.setItem("agro_feedback", JSON.stringify(existing));
    setSubmitted(true);
    setTimeout(() => {
      setIsOpen(false);
      setSubmitted(false);
      setRating(0);
      setComment("");
    }, 2000);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-[#2d6a4f] text-white p-4 rounded-full shadow-lg hover:bg-[#1b4332] transition-colors z-30 flex items-center justify-center"
      >
        💬
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black z-40"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-2xl max-w-md w-full border border-[#b8946e] dark:bg-[#1a1a1a] dark:border-[#2d2d2d]">
                
                {/* CLOSE / BACK BUTTON */}
                <div className="flex justify-end mb-2">
                  <button onClick={() => setIsOpen(false)} className="text-[#5a3e2b] dark:text-gray-400 hover:text-[#2d6a4f] text-2xl">
                    ✕
                  </button>
                </div>

                {submitted ? (
                  <div className="text-center">
                    <div className="text-5xl mb-4">🎉</div>
                    <h3 className="text-2xl font-bold text-[#2d6a4f] dark:text-[#4ade80]">Thank You!</h3>
                    <p className="text-[#5a3e2b] dark:text-gray-400">Your feedback helps us grow.</p>
                  </div>
                ) : (
                  <>
                    <h3 className="text-xl font-bold text-[#2d6a4f] dark:text-[#4ade80] mb-4">Rate Your Experience</h3>
                    <div className="flex gap-2 mb-4 justify-center">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() => setRating(star)}
                          className={`text-3xl transition-colors ${star <= rating ? 'text-yellow-500' : 'text-gray-300 dark:text-gray-600'}`}
                        >
                          ★
                        </button>
                      ))}
                    </div>
                    <textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Tell us what you think..."
                      className="w-full p-3 border border-[#b8946e] rounded-md focus:ring-2 focus:ring-[#2d6a4f] bg-white/50 dark:bg-[#2d2d2d] dark:border-[#3d3d3d] dark:text-white mb-4"
                      rows={3}
                    />
                    <button
                      onClick={handleSubmit}
                      disabled={rating === 0}
                      className={`w-full py-3 rounded-md transition-colors ${rating === 0 ? 'bg-gray-300 cursor-not-allowed' : 'bg-[#2d6a4f] text-white hover:bg-[#1b4332] dark:bg-[#4ade80] dark:text-[#121212] dark:hover:bg-[#3bbd6e]'}`}
                    >
                      Submit Feedback
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}