import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import {
  Calendar,
  Clock,
  Briefcase,
  Users,
  ChevronRight,
  Star,
  ChevronDown,
  Search,
  Plus,
  Filter,
  Award,
  Code,
  UserCheck,
  Layers,
  AlertCircle,
} from "lucide-react";

const InterviewDashboard = () => {
  const [interviews, setInterviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [summary, setSummary] = useState({
    total: 0,
    technical: 0,
    hr: 0,
    completed: 0,
  });
  const { user } = useAuth();

  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`/api/interview/user/${user._id}`);
        let interviewData = response.data.interviews;

        // Check each interview for answers
        const interviewsWithStatus = await Promise.all(
          interviewData.map(async (interview) => {
            try {
              const answersResponse = await axios.get(
                `/api/interview/userAnswer/${interview._id}`,
              );

              // More robust check for answers
              const hasAnswers =
                answersResponse.data &&
                answersResponse.data.userAnswers &&
                answersResponse.data.userAnswers.length > 0;

              // Only update status if we actually have answers
              if (hasAnswers) {
                return { ...interview, status: "completed" };
              }
              return interview;
            } catch (error) {
              // If the request fails, assume no answers
              console.error("Error checking answers:", error);
              return interview;
            }
          }),
        );

        setInterviews(interviewsWithStatus);

        // Calculate summary based on updated interviews
        const completedCount = interviewsWithStatus.filter(
          (i) => i.status === "completed",
        ).length;

        setSummary({
          total: interviewsWithStatus.length,
          technical: interviewsWithStatus.filter(
            (i) => i.interviewType === "technical",
          ).length,
          hr: interviewsWithStatus.filter((i) => i.interviewType === "hr")
            .length,
          completed: completedCount,
        });

        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching interviews:", error);
        setIsLoading(false);
      }
    };

    fetchInterviews();
  }, [user._id]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const filteredInterviews = interviews.filter((interview) => {
    // Filter by type
    const matchesType =
      filter === "all" ||
      (filter === "technical" && interview.interviewType === "technical") ||
      (filter === "hr" && interview.interviewType === "hr");

    // Filter by date
    const interviewDate = new Date(interview.createdAt);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let matchesDate = true;

    switch (dateFilter) {
      case "today":
        matchesDate = interviewDate.toDateString() === today.toDateString();
        break;
      case "week":
        const weekAgo = new Date(today);
        weekAgo.setDate(today.getDate() - 7);
        matchesDate = interviewDate >= weekAgo;
        break;
      case "month":
        const monthAgo = new Date(today);
        monthAgo.setMonth(today.getMonth() - 1);
        matchesDate = interviewDate >= monthAgo;
        break;
      default: // 'all'
        matchesDate = true;
    }

    return matchesType && matchesDate;
  });
  console.log(interviews);
  const getStatusBadge = (interview) => {
    const status = interview.status;

    if (status === "completed") {
      return (
        <span className="absolute right-1 top-4 rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-200">
          Completed
        </span>
      );
    } else {
      return (
        <span className="absolute right-1 top-4 rounded-full bg-amber-100 px-2 py-1 text-xs font-medium text-amber-800 dark:bg-amber-900 dark:text-amber-200">
          Pending
        </span>
      );
    }
  };

  return (
    <div className="mx-auto mt-4 max-w-7xl px-4 py-8">
      {/* Header */}

      {/* Stats Summary */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg bg-white p-4 shadow-sm transition-all hover:shadow-md dark:bg-gray-800">
          <div className="flex items-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
              <Layers size={20} className="text-blue-600 dark:text-blue-300" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Total Interviews
              </h3>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {summary.total}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-white p-4 shadow-sm transition-all hover:shadow-md dark:bg-gray-800">
          <div className="flex items-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900">
              <Code
                size={20}
                className="text-indigo-600 dark:text-indigo-300"
              />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Technical
              </h3>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {summary.technical}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-white p-4 shadow-sm transition-all hover:shadow-md dark:bg-gray-800">
          <div className="flex items-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-rose-100 dark:bg-rose-900">
              <UserCheck
                size={20}
                className="text-rose-600 dark:text-rose-300"
              />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                HR
              </h3>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {summary.hr}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-white p-4 shadow-sm transition-all hover:shadow-md dark:bg-gray-800">
          <div className="flex items-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
              <Award size={20} className="text-green-600 dark:text-green-300" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Completed
              </h3>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {summary.completed}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="mb-6 rounded-lg bg-white p-4 shadow-sm dark:bg-gray-800">
        <div className="flex flex-col justify-between gap-4 sm:flex-row">
          <div className="relative flex-1">
            <div className="flex items-center gap-2">
              <Calendar size={18} className="text-gray-400" />
              <select
                className="w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-5  focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
              >
                <option value="all">All dates</option>
                <option value="today">Today</option>
                <option value="week">Last 7 days</option>
                <option value="month">Last 30 days</option>
              </select>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setFilter("all")}
              className={`rounded-lg px-5 py-2.5 font-medium transition-colors ${
                filter === "all"
                  ? "bg-blue-600 text-white shadow-sm hover:bg-blue-700"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter("technical")}
              className={`rounded-lg px-5 py-2.5 font-medium transition-colors ${
                filter === "technical"
                  ? "bg-indigo-600 text-white shadow-sm hover:bg-indigo-700"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
              }`}
            >
              Technical
            </button>
            <button
              onClick={() => setFilter("hr")}
              className={`rounded-lg px-5 py-2.5 font-medium transition-colors ${
                filter === "hr"
                  ? "bg-rose-600 text-white shadow-sm hover:bg-rose-700"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
              }`}
            >
              HR
            </button>
          </div>
        </div>
      </div>

      {/* Interview Cards */}
      {isLoading ? (
        <div className="grid animate-pulse grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-64 rounded-lg bg-gray-100 dark:bg-gray-800"
            ></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredInterviews.length > 0 ? (
            filteredInterviews.map((interview) => (
              <div
                key={interview._id}
                className="group relative overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
              >
                <div
                  className={`h-2 ${
                    interview.interviewType === "technical"
                      ? "bg-gradient-to-r from-indigo-500 to-blue-500"
                      : "bg-gradient-to-r from-rose-500 to-pink-500"
                  }`}
                ></div>

                {/* Status Badge */}
                {getStatusBadge(interview)}

                <div className="p-6">
                  <div className="mb-4 flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                        {interview.job}
                      </h3>
                      <div className="mt-2 flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <Briefcase size={14} className="mr-1" />
                        <span>
                          {interview.yearsOfExperience} Years Experience
                        </span>
                      </div>
                    </div>
                    {/* <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium capitalize text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                      {interview.interviewType + " " + "Interview"}
                    </span> */}
                  </div>

                  <div className="mb-6 flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <Calendar size={14} className="mr-1 text-gray-400" />
                    <span>{formatDate(interview.createdAt)}</span>
                  </div>

                  <div className="mt-4 flex gap-3">
                    <button
                      className={`flex-1 rounded-lg border px-4 py-2.5 font-medium transition-all ${
                        !interview.status
                          ? "cursor-not-allowed border-gray-300 text-gray-400 dark:border-gray-600 dark:text-gray-500"
                          : "border-gray-300 text-gray-700 hover:bg-gray-50 hover:shadow-sm dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                      }`}
                      onClick={() =>
                        (window.location.href = `/interview/${interview._id}/feedback`)
                      }
                      disabled={!interview.status}
                    >
                      Feedback
                    </button>
                    <button
                      className={`flex-1 rounded-lg px-4 py-2.5 font-medium text-white shadow-sm transition-all hover:shadow ${
                        interview.type === "technical"
                          ? "bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700"
                          : "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                      } ${interview.status === "completed" ? "disabled:cursor-not-allowed disabled:opacity-50" : ""}`}
                      onClick={() =>
                        interview.status !== "completed" &&
                        (window.location.href = `/interview/${interview._id}`)
                      }
                      disabled={interview.status === "completed"}
                    >
                      Start
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-20 text-center">
              <div className="flex flex-col items-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700">
                  <AlertCircle
                    size={32}
                    className="text-gray-400 dark:text-gray-500"
                  />
                </div>
                <h3 className="mb-2 text-xl font-medium text-gray-900 dark:text-white">
                  No interviews found
                </h3>
                <p className="mb-6 text-gray-500 dark:text-gray-400">
                  Try adjusting your search or filter criteria
                </p>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setFilter("all");
                  }}
                  className="rounded-lg bg-blue-100 px-4 py-2 font-medium text-blue-700 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-300 dark:hover:bg-blue-800"
                >
                  Clear filters
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default InterviewDashboard;
