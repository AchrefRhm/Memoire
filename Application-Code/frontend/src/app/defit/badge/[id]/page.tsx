"use client";
import ConfettiEffect from "@/components/ConfettiEffect";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface PageProps {
  params: {
    id: string; // Adjust the key based on your actual params structure
  };
}
const Badge: React.FC<PageProps> = ({ params }) => {
  const [showConfetti, setShowConfetti] = useState(true);
  const [badge, setBadge] = useState(null);
  const { user } = useAuth();

  const fetchBadgeById = async () => {
    try {
      const response = await axios.get(`/api/challenges/badge/${params.id}`);
      if (user._id == response.data.userId) {
        setBadge(response.data);
      }
    } catch (error) {
      console.error("Error fetching badge:", error);
    }
  };
  useEffect(() => {
    fetchBadgeById();
    const timer = setTimeout(() => setShowConfetti(false), 6000); // Hide confetti after 3s
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex h-screen flex-col items-center justify-center bg-gray-900 p-4 text-center">
      {badge ? (
        <>
          {showConfetti && <ConfettiEffect />}

          {/* Congratulations Text */}
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-2 text-3xl font-bold text-yellow-400"
          >
            🎉 Congratulations, {user?.username}! 🎉
          </motion.h1>

          <motion.h2
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-6 text-xl text-white"
          >
            You earned{" "}
            <span className="text-yellow-300">{badge?.type} badge</span>!
          </motion.h2>

          {/* Badge Container */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, type: "spring" }}
            className="relative"
          >
            {/* Outer Glow */}
            <div className="absolute inset-0 h-48 w-48 rounded-full bg-yellow-400 opacity-30 blur-3xl"></div>

            {/* Badge */}
            <motion.div
              initial={{ rotate: -10 }}
              animate={{ rotate: 10 }}
              transition={{
                repeat: Infinity,
                repeatType: "mirror",
                duration: 2,
              }}
              className="relative flex h-44 w-44 flex-col items-center justify-center rounded-full border-4 border-yellow-300 bg-gradient-to-r from-yellow-400 to-orange-500 shadow-lg"
            >
              {/* Shine Effect */}
              <motion.div
                className="absolute inset-0 rounded-full bg-white opacity-20"
                initial={{ x: "-100%" }}
                animate={{ x: "100%" }}
                transition={{
                  repeat: Infinity,
                  duration: 2,
                  ease: "linear",
                }}
              />

              {/* Badge Icon */}
              <span className="text-6xl">{badge?.icon}</span>
              <p className="mt-2 text-sm font-bold text-black">{badge?.type}</p>
            </motion.div>
          </motion.div>

          {/* Date Earned */}
          <p className="mt-4 text-sm text-gray-400">
            Earned On {badge?.earnedAt.slice(0, 10)} At{" "}
            {badge?.earnedAt.slice(11, 19)}
          </p>
        </>
      ) : (
        <p className="text-white">No badges found</p>
      )}
    </div>
  );
};

export default Badge;
