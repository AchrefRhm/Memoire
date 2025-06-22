"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import { Trophy, Search, Medal, User } from "lucide-react";
const RankUsersByJob = () => {
  const [rankedUsers, setRankedUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const job = user?.job;
  const topThreeUsers = rankedUsers.slice(0, 3);
  const otherUsers = rankedUsers.slice(3);

  // Get medal color based on rank
  const getMedalColor = (index) => {
    switch (index) {
      case 0:
        return "text-yellow-500"; // Gold
      case 1:
        return "text-gray-400"; // Silver
      case 2:
        return "text-amber-700"; // Bronze
      default:
        return "text-gray-500";
    }
  };
  const API_URL = "http://k8s-threetie-mainlb-11c5700e30-1182053200.us-east-1.elb.amazonaws.com";
  const getImageSource = (userImage) => {
    // Make sure the path is correctly formatted
    return userImage?.img.startsWith("https")
      ? userImage?.img
      : `${API_URL}${userImage?.img}`;
  };
  const handleFetchRankedUsers = async () => {
    if (!job) return;

    setLoading(true);
    setError(null);

    try {
      const response = await axios.post("/api/challenges/rank", { job });
      setRankedUsers(response.data);
    } catch (error) {
      setError("Failed to fetch ranked users");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    handleFetchRankedUsers();
  }, []);
  const getPositionStyle = (index) => {
    switch (index) {
      case 0:
        return "bg-gradient-to-r from-yellow-500 to-amber-300 text-white";
      case 1:
        return "bg-gradient-to-r from-gray-400 to-gray-300 text-white";
      case 2:
        return "bg-gradient-to-r from-amber-700 to-amber-500 text-white";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };
  return (
    <div className="mx-auto max-w-4xl p-4">
      {/* Header Section */}
      <div className="mb-8 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-center text-white shadow-lg">
        <div className="flex items-center justify-center">
          <Trophy className="mr-3 h-8 w-8" />
          <h1 className="text-3xl font-bold">User Leaderboard</h1>
        </div>
        <p className="mt-2 text-blue-100">Top performers for {job}</p>
      </div>

      {/* Search Filter - Can be implemented later */}
      <div className="mb-6 flex items-center rounded-lg bg-white p-3 shadow-md">
        <Search className="mx-2 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Search users..."
          className="w-full bg-transparent py-1 focus:outline-none"
        />
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 rounded-lg bg-red-50 p-4 text-center text-red-500">
          <p>{error}</p>
        </div>
      )}

      {/* Main Content */}
      <div className="mt-8 space-y-4">
        {loading ? (
          <div className="flex h-40 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-blue-600"></div>
          </div>
        ) : rankedUsers.length > 0 ? (
          <>
            {/* Top 3 Users Podium */}
            <div className="mb-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              {/* Second Place */}
              {topThreeUsers.length > 1 && (
                <div className="flex flex-col items-center">
                  <div className="relative h-20 w-20">
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 transform rounded-full bg-gray-400 p-1 shadow-md">
                      <Medal size={24} className="text-white" />
                    </div>
                    <img
                      src={getImageSource(topThreeUsers[1])}
                      alt={topThreeUsers[1].username}
                      className="h-20 w-20 rounded-full border-4 border-gray-400 object-cover shadow-md"
                    />
                  </div>
                  <div className="mt-2 text-center">
                    <p className="font-semibold">{topThreeUsers[1].username}</p>
                    <p className="text-sm text-gray-400">
                      {topThreeUsers[1].totalScore} pts
                    </p>
                  </div>
                  <div className="mt-2 h-24 w-16 rounded-t-lg bg-gray-300"></div>
                </div>
              )}

              {/* First Place */}
              {topThreeUsers.length > 0 && (
                <div className="z-10 flex flex-col items-center">
                  <div className="relative h-24 w-24">
                    <div className="absolute -top-5 left-1/2 -translate-x-1/2 transform rounded-full bg-yellow-500 p-1 shadow-md">
                      <Trophy size={28} className="text-white" />
                    </div>
                    <img
                      src={getImageSource(topThreeUsers[0])}
                      alt={topThreeUsers[0].username}
                      className="h-24 w-24 rounded-full border-4 border-yellow-500 object-cover shadow-md"
                    />
                  </div>
                  <div className="mt-2 text-center">
                    <p className="text-lg font-bold">
                      {topThreeUsers[0].username}
                    </p>
                    <p className="text-yellow-500">
                      {topThreeUsers[0].totalScore} pts
                    </p>
                  </div>
                  <div className="mt-2 h-32 w-20 rounded-t-lg bg-yellow-400"></div>
                </div>
              )}

              {/* Third Place */}
              {topThreeUsers.length > 2 && (
                <div className="flex flex-col items-center">
                  <div className="relative h-16 w-16">
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 transform rounded-full bg-amber-700 p-1 shadow-md">
                      <Medal size={20} className="text-white" />
                    </div>
                    <img
                      src={getImageSource(topThreeUsers[2])}
                      alt={topThreeUsers[2].username}
                      className="h-16 w-16 rounded-full border-4 border-amber-700 object-cover shadow-md"
                    />
                  </div>
                  <div className="mt-2 text-center">
                    <p className="font-semibold">{topThreeUsers[2].username}</p>
                    <p className="text-sm text-amber-700">
                      {topThreeUsers[2].totalScore} pts
                    </p>
                  </div>
                  <div className="mt-2 h-16 w-12 rounded-t-lg bg-amber-600"></div>
                </div>
              )}
            </div>

            {/* Remaining Users List */}
            <div className="mt-10 space-y-2">
              {otherUsers.map((user, index) => (
                <div
                  key={user._id}
                  className="group flex items-center overflow-hidden rounded-lg bg-white p-3 shadow-md transition-all duration-300 hover:bg-blue-50 hover:shadow-lg"
                >
                  <div
                    className={`mr-4 flex h-8 w-8 items-center justify-center rounded-full ${getPositionStyle(index + 3)}`}
                  >
                    {index + 4}
                  </div>
                  <img
                    src={getImageSource(user)}
                    alt={user.username}
                    className="mr-4 h-12 w-12 rounded-full border-2 border-gray-200 object-cover transition-all duration-300 group-hover:border-blue-300"
                  />
                  <div className="flex-grow">
                    <p className="font-semibold">{user.username}</p>
                    <p className="text-sm text-gray-500">
                      {user.totalScore} points
                    </p>
                  </div>
                  <div className="flex items-center rounded-full bg-blue-100 px-4 py-1 text-blue-600 transition-all duration-300 group-hover:bg-blue-600 group-hover:text-white">
                    <Trophy size={14} className="mr-1" />
                    <span className="font-bold">{user.totalScore}</span>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center rounded-lg bg-gray-50 p-10 text-center">
            <User size={48} className="mb-4 text-gray-400" />
            <p className="text-gray-500">No users found for the job "{job}".</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RankUsersByJob;
