"use client";
import Header from "@/components/Header";
import axios from "axios";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

import {
  ChevronDown,
  ChevronUp,
  ArrowLeft,
  Check,
  X,
  Award,
  Star,
  ChevronRight,
  Download,
} from "lucide-react";
import { useRouter } from "next/navigation";
const Feedback = () => {
  const router = useRouter();
  const [answers, setAnswers] = useState([]);
  const { interviewId } = useParams();
  const [openIndexes, setOpenIndexes] = useState<Record<number, boolean>>({});
  const [activeTab, setActiveTab] = useState("feedback");
  const [animateRating, setAnimateRating] = useState(false);
  useEffect(() => {
    setAnimateRating(true);
  }, []);
  const handleBackHome = () => {
    router.push("/");
    // In a real app, you would use router.replace("/")
  };
  const toggleOpen = (index: number) => {
    setOpenIndexes((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };
  const fetchUserAnswers = async () => {
    try {
      const response = await axios.get(
        `/api/interview/userAnswer/${interviewId}`,
      );
      // Assumes your response contains a property "userAnswers"
      setAnswers(response.data.userAnswers);
    } catch (err) {
      console.error("Error fetching user answers:", err);
    }
  };
  useEffect(() => {
    fetchUserAnswers();
  }, []);

  const totalRating = answers.reduce(
    (sum, answer) => sum + Number(answer.rating),
    0,
  );
  // Calculate average and format it with two decimals
  const averageRating =
    answers.length > 0 ? (totalRating / answers.length).toFixed(2) : "0.00";

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating / 2);
    const halfStar = rating % 2 >= 1;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />,
        );
      } else if (i === fullStars && halfStar) {
        stars.push(
          <div key={i} className="relative">
            <Star className="h-4 w-4 text-gray-300 dark:text-gray-600" />
            <div className="absolute inset-y-0 left-0 w-1/2 overflow-hidden">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            </div>
          </div>,
        );
      } else {
        stars.push(
          <Star key={i} className="h-4 w-4 text-gray-300 dark:text-gray-600" />,
        );
      }
    }
    return stars;
  };
  const getScoreClass = (rating) => {
    if (rating >= 8)
      return "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-400";
    if (rating >= 6)
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-400";
    return "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-400";
  };
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header with animated gradient */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 py-8 shadow-lg">
        <div className="bg-grid-white/[0.05] absolute inset-0 bg-[length:16px_16px]"></div>
        <div className="container relative mx-auto px-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-white md:text-3xl">
              Interview Feedback
            </h1>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 md:px-6">
        {answers?.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl bg-white p-16 text-center shadow-xl dark:bg-gray-800">
            <div className="mb-4 rounded-full bg-gray-100 p-5 dark:bg-gray-700">
              <X className="h-12 w-12 text-gray-400" />
            </div>
            <h2 className="text-xl font-bold text-gray-500 dark:text-gray-400">
              No Interview Feedback Records Found
            </h2>
            <p className="mt-2 text-gray-400">
              Please complete an interview to receive feedback
            </p>
            <button
              className="mt-6 rounded-full bg-blue-600 px-6 py-2 text-white shadow-md transition hover:bg-blue-700"
              onClick={handleBackHome}
            >
              Start Interview
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Result card with tabs */}
            <div className="overflow-hidden rounded-xl bg-white shadow-xl dark:bg-gray-800">
              {/* Tab navigation */}
              <div className="flex border-b border-gray-200 dark:border-gray-700">
                <button
                  className={`flex-1 px-4 py-3 text-center font-medium transition ${
                    activeTab === "feedback"
                      ? "border-b-2 border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400"
                      : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                  }`}
                  onClick={() => setActiveTab("feedback")}
                >
                  Feedback
                </button>
                <button
                  className={`flex-1 px-4 py-3 text-center font-medium transition ${
                    activeTab === "summary"
                      ? "border-b-2 border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400"
                      : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                  }`}
                  onClick={() => setActiveTab("summary")}
                >
                  Summary
                </button>
              </div>

              {activeTab === "feedback" && (
                <>
                  <div className="border-b border-gray-100 bg-gradient-to-r from-green-50 to-blue-50 px-6 py-8 dark:border-gray-700 dark:from-gray-800 dark:to-gray-700">
                    <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
                      <div className="flex items-center">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 shadow-inner dark:bg-green-900/60">
                          <Check className="h-8 w-8 text-green-600 dark:text-green-400" />
                        </div>
                        <div className="ml-4">
                          <h2 className="text-2xl font-bold text-green-600 dark:text-green-400">
                            Congratulations!
                          </h2>
                          <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
                            Here is your interview feedback
                          </p>
                        </div>
                      </div>

                      <div className="relative flex h-28 w-28 flex-col items-center justify-center rounded-full bg-white text-center shadow-md dark:bg-gray-700">
                        <div className="absolute inset-0 rounded-full border-8 border-transparent">
                          <div
                            className={`absolute inset-0 rounded-full border-8 ${animateRating ? "animate-pulse" : ""} ${
                              parseFloat(averageRating) >= 8
                                ? "border-green-400/50 dark:border-green-500/50"
                                : parseFloat(averageRating) >= 6
                                  ? "border-yellow-400/50 dark:border-yellow-500/50"
                                  : "border-red-400/50 dark:border-red-500/50"
                            }`}
                          ></div>
                        </div>
                        <span className="text-3xl font-bold text-blue-700 dark:text-blue-400">
                          {averageRating}
                        </span>
                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          out of 10
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="px-6 py-6">
                    <div className="mb-6">
                      <h3 className="mb-1 text-lg font-medium text-gray-700 dark:text-gray-300">
                        Performance Overview
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Below you'll find each interview question along with
                        your answer, the correct answer, and personalized
                        feedback to help you improve.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 gap-4 ">
                      <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
                        <div className="flex items-center">
                          <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/40">
                            <ChevronRight className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-blue-900 dark:text-blue-400">
                              Next Steps
                            </h4>
                            <p className="text-xs text-gray-600 dark:text-gray-400">
                              Recommended actions
                            </p>
                          </div>
                        </div>
                        <div className="mt-3 text-sm text-gray-600 dark:text-gray-300">
                          Review the specific feedback for each question and
                          identify areas where you need further practice.
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {activeTab === "summary" && (
                <div className="p-6">
                  <div className="mb-6">
                    <h3 className="mb-3 text-lg font-medium text-gray-700 dark:text-gray-300">
                      Performance Summary
                    </h3>

                    <div className="mb-6 overflow-hidden rounded-lg bg-gray-50 p-4 dark:bg-gray-700/40">
                      <div className="flex flex-wrap items-center justify-between gap-4">
                        <div>
                          <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                            Overall Performance
                          </p>
                          <div className="mt-1 flex items-center">
                            {renderStars(parseFloat(averageRating) / 2)}
                            <span className="ml-2 text-sm font-medium text-gray-500 dark:text-gray-400">
                              {averageRating}/10
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center rounded-full bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                          {parseFloat(averageRating) >= 8
                            ? "Excellent"
                            : parseFloat(averageRating) >= 6
                              ? "Good"
                              : "Needs Improvement"}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Question Performance
                      </h4>

                      {answers.map((item, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between rounded-lg border border-gray-100 p-3 dark:border-gray-700"
                        >
                          <div className="flex-1 overflow-hidden">
                            <p className="truncate text-sm font-medium text-gray-700 dark:text-gray-300">
                              Q{index + 1}: {item.question}
                            </p>
                          </div>
                          <div className="ml-4 flex items-center">
                            <div
                              className={`rounded-full px-2 py-1 text-xs font-bold ${getScoreClass(item.rating)}`}
                            >
                              {item.rating}/10
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Questions accordion - only shown in feedback tab */}
            {activeTab === "feedback" && (
              <div className="space-y-4">
                {answers.map((item, index) => (
                  <div
                    key={index}
                    className="overflow-hidden rounded-lg bg-white shadow-md transition-all dark:bg-gray-800"
                  >
                    <button
                      className="flex w-full items-center justify-between px-6 py-4 text-left transition hover:bg-gray-50 dark:hover:bg-gray-700"
                      onClick={() => toggleOpen(index)}
                    >
                      <div className="flex items-center">
                        <div className="mr-4 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-600 dark:bg-blue-900 dark:text-blue-400">
                          {index + 1}
                        </div>
                        <h3 className="font-medium text-gray-800 dark:text-white">
                          {item.question}
                        </h3>
                      </div>
                      {openIndexes[index] ? (
                        <ChevronUp className="h-5 w-5 text-gray-400" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-gray-400" />
                      )}
                    </button>

                    {openIndexes[index] && (
                      <div className="border-t border-gray-100 px-6 py-4 dark:border-gray-700">
                        <div className="mb-4 flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="mr-2 text-sm font-medium text-gray-500 dark:text-gray-400">
                              Rating:
                            </div>
                            <div className="flex items-center">
                              <div
                                className={`rounded-full px-3 py-1 text-sm font-bold ${getScoreClass(item.rating)}`}
                              >
                                {item.rating}/10
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center">
                            {renderStars(item.rating / 2)}
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div className="rounded-lg border border-red-200 bg-red-50 p-4 shadow-sm dark:border-red-900/50 dark:bg-red-900/20">
                            <h4 className="mb-2 font-semibold text-red-800 dark:text-red-400">
                              Your Answer:
                            </h4>
                            <p className="text-sm leading-relaxed text-gray-800 dark:text-gray-300">
                              {item.userAns}
                            </p>
                          </div>

                          <div className="rounded-lg border border-green-200 bg-green-50 p-4 shadow-sm dark:border-green-900/50 dark:bg-green-900/20">
                            <h4 className="mb-2 font-semibold text-green-800 dark:text-green-400">
                              Correct Answer:
                            </h4>
                            <p className="text-sm leading-relaxed text-gray-800 dark:text-gray-300">
                              {item.correctAns}
                            </p>
                          </div>

                          <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 shadow-sm dark:border-blue-900/50 dark:bg-blue-900/20">
                            <h4 className="mb-2 font-semibold text-blue-800 dark:text-blue-400">
                              Feedback:
                            </h4>
                            <p className="text-sm leading-relaxed text-gray-800 dark:text-gray-300">
                              {item.feedback}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Action buttons */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              <button
                className="flex items-center rounded-full bg-white px-6 py-3 font-medium text-gray-700 shadow-sm transition hover:bg-gray-50 hover:shadow dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
                onClick={handleBackHome}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back Home
              </button>

              <div className="flex gap-3">
                <button
                  className="rounded-full bg-blue-600 px-6 py-3 font-medium text-white shadow-sm transition hover:bg-blue-700 hover:shadow-md"
                  onClick={() => router.push("/")}
                >
                  Practice More
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Feedback;
