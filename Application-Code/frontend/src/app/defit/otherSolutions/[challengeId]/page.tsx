"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";

interface UserAnswer {
  userId: {
    _id: string;
    username: string;
  };
  answer: string;
  score: number;
}
interface PageProps {
  params: {
    challengeId: string; // Adjust the key based on your actual params structure
  };
}
const page: React.FC<PageProps> = ({ params }) => {
  const { user } = useAuth();
  const challengeId = params.challengeId;
  const [answers, setAnswers] = useState<UserAnswer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);
  useEffect(() => {
    if (!challengeId) return; // Ensure challengeId is available

    const fetchAnswers = async () => {
      try {
        const { data } = await axios.get(
          `/api/challenges/otherSolutions/${challengeId}?userId=${user._id}`,
        );
        setAnswers(data);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to fetch answers");
      } finally {
        setLoading(false);
      }
    };

    fetchAnswers();
  }, [challengeId]);
  const displayedAnswers = showAll ? answers : answers.slice(0, 3);
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-violet-50 to-indigo-100 p-6">
      <div className="w-full max-w-2xl rounded-3xl border border-indigo-50 bg-white p-8 shadow-2xl">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-3xl font-bold text-transparent">
            Other Solution
          </h1>
          <div className="flex items-center space-x-2 rounded-full bg-indigo-50 px-4 py-2">
            <span className="h-2 w-2 animate-pulse rounded-full bg-green-400"></span>
            <span className="text-sm font-medium text-indigo-600">
              Live Updates
            </span>
          </div>
        </div>

        {loading && (
          <div className="flex justify-center py-12">
            <div className="flex flex-col items-center">
              <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-indigo-500"></div>
              <p className="mt-4 text-sm font-medium text-indigo-500">
                Loading solutions...
              </p>
            </div>
          </div>
        )}

        {error && (
          <div className="flex items-start rounded-xl border-l-4 border-red-500 bg-red-50 p-6 text-red-600">
            <svg
              className="mr-3 h-6 w-6 flex-shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div>
              <p className="font-medium">Unable to load solutions</p>
              <p className="mt-1 text-sm text-red-500">{error}</p>
            </div>
          </div>
        )}

        {!loading && !error && answers.length === 0 && (
          <div className="px-6 py-16 text-center">
            <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-indigo-50">
              <svg
                className="h-12 w-12 text-indigo-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                />
              </svg>
            </div>
            <p className="text-xl font-light text-gray-500">
              No solutions found
            </p>
            <p className="mt-2 text-sm text-gray-400">
              Be the first to submit your answer to this challenge!
            </p>
            <button className="mt-6 transform rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-3 font-medium text-white shadow-lg transition-all duration-200 hover:-translate-y-1 hover:shadow-xl">
              Submit Your Solution
            </button>
          </div>
        )}

        <ul className="space-y-6">
          {displayedAnswers.map((answer, index) => (
            <li
              key={answer.userId._id}
              className="overflow-hidden rounded-2xl transition-all duration-300 hover:shadow-xl"
            >
              <div
                className={`p-5 ${
                  index % 2 === 0
                    ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white"
                    : "bg-gradient-to-r from-teal-500 to-emerald-500 text-white"
                }`}
              >
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <div className="h-14 w-14 overflow-hidden rounded-full border-2 border-white shadow-inner">
                      <img
                        src={answer.userId.img}
                        alt={answer.userId.username}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div
                      className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-white text-xs font-bold shadow-lg"
                      style={{ color: index % 2 === 0 ? "#6366f1" : "#10b981" }}
                    >
                      {answer.score}
                    </div>
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-lg font-bold">
                        {answer.userId.username}
                      </p>
                      <div className="flex items-center">
                        <div className="mr-2 flex space-x-1">
                          {[...Array(5)].map((_, i) => (
                            <svg
                              key={i}
                              className={`h-5 w-5 ${i < Math.floor(answer.score / 2) ? "text-yellow-300" : "text-white text-opacity-30"}`}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                        <span className="rounded-full bg-white bg-opacity-20 px-2 py-1 text-sm">
                          {answer.score}/10
                        </span>
                      </div>
                    </div>
                    <p className="mt-1 text-sm text-white text-opacity-80">
                      Submitted 2 days ago
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-b border-l border-r border-gray-100 bg-white p-6">
                <div className="rounded-xl bg-gray-50 p-4">
                  <p className="leading-relaxed text-gray-700">
                    {answer.answer}
                  </p>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span
                      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
                        answer.score > 9
                          ? "bg-green-100 text-green-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {answer.score > 9 ? "Excellent" : "Great solution"}
                    </span>
                  </div>

                  <button
                    className={`rounded-full px-4 py-2 text-xs font-bold shadow-sm ${
                      index % 2 === 0
                        ? "bg-indigo-100 text-indigo-700 hover:bg-indigo-200"
                        : "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                    }`}
                  >
                    View details
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>

        {!showAll && answers.length > 3 && (
          <div className="mt-8 flex justify-center">
            <button
              onClick={() => setShowAll(true)}
              className="group flex w-full max-w-sm items-center justify-center rounded-xl border border-indigo-200 bg-white py-3 font-medium text-indigo-600 shadow transition-all duration-200 hover:shadow-md"
            >
              <span>Show More Results</span>
              <svg
                className="ml-2 h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
          </div>
        )}

        {showAll && answers.length > 3 && (
          <div className="mt-8 flex justify-center">
            <button
              onClick={() => setShowAll(false)}
              className="group flex w-full max-w-sm items-center justify-center rounded-xl border border-indigo-100 bg-indigo-50 py-3 font-medium text-indigo-600 transition-all duration-200 hover:bg-indigo-100"
            >
              <span>Show Less</span>
              <svg
                className="ml-2 h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 15l7-7 7 7"
                />
              </svg>
            </button>
          </div>
        )}
      </div>

      <div className="mt-6 text-center">
        <p className="text-sm text-indigo-400">
          Showing {displayedAnswers.length} of {answers.length} solutions •
          Updated April 2025
        </p>
      </div>
    </div>
  );
};
export default page;
