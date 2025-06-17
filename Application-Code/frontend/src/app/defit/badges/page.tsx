"use client";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";

export default function BadgesPage() {
  const { user } = useAuth();
  const userId = user?._id;
  const router = useRouter();
  const [badges, setBadges] = useState([]);
  useEffect(() => {
    const fetchBadges = async () => {
      try {
        const response = await axios.get(`/api/challenges/badges/${userId}`);
        setBadges(response.data); // Store the badges in state
      } catch (err) {
        console.error(err);
      } finally {
      }
    };

    fetchBadges();
  }, [userId]); // Fetch badges when the userId changes
  console.log(badges);
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-900 p-8 text-white">
      <h1 className="mb-6 text-3xl font-bold">🏆 Your Achievements</h1>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
        {badges.map((badge) => (
          <motion.div
            key={badge._id}
            className="cursor-pointer rounded-lg bg-yellow-500 px-8 py-4 text-center shadow-lg transition duration-300 hover:bg-yellow-500"
            onClick={() => router.push(`/defit/badge/${badge._id}`)}
            whileHover={{ scale: 1.1 }}
          >
            <span className="text-6xl">{badge.icon}</span>
            <p className="mt-2 text-lg font-medium">Badge Of</p>
            <h2 className="mt-1 text-xl font-semibold">{badge.type}</h2>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
