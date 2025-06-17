"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import QuestionSection from "@/components/QuestionSection";
import Header from "@/components/Header";
import dynamic from "next/dynamic";

const RecordAnswerSection = dynamic(
  () => import("@/components/RecordAnswerSection"),
  { ssr: false },
);

// Use RecordAnswerSection in your page
import Link from "next/link";
interface PageProps {
  params: {
    interviewId: string; // Adjust the key based on your actual params structure
  };
}
const StartInterview: React.FC<PageProps> = ({ params }) => {
  const [data, setData] = useState(null);
  const [interviewQuestions, setInterviewQuestions] = useState(null);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const fetchInterview = async () => {
    try {
      const response = await axios.get("/api/interview/" + params.interviewId);
      setData(response.data);
      setInterviewQuestions(response.data.questions);
    } catch (error) {
      console.error("Error fetching interview:", error);
    }
  };
  useEffect(() => {
    fetchInterview();
  }, []);
  console.log(data);
  console.log(interviewQuestions);
  return (
    <div className="min-h-screen pb-12 dark:bg-boxdark">
      <Header />
      <div className="container mx-auto px-4">
        <div className="mt-8 sm:mt-12">
          <h1 className="mb-6 text-2xl font-bold text-black dark:text-white sm:text-3xl">
            Interview Session
          </h1>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8">
            <QuestionSection
              interviewQuestions={interviewQuestions}
              activeQuestionIndex={activeQuestionIndex}
            />
            <RecordAnswerSection
              interviewQuestions={interviewQuestions}
              activeQuestionIndex={activeQuestionIndex}
            />
          </div>
        </div>

        <div className="mt-8 flex justify-end gap-4 sm:mt-12">
          {activeQuestionIndex > 0 && (
            <button
              className="flex items-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
              onClick={() => setActiveQuestionIndex(activeQuestionIndex - 1)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m15 18-6-6 6-6" />
              </svg>
              Previous
            </button>
          )}

          {activeQuestionIndex != interviewQuestions?.length - 1 && (
            <button
              className="flex items-center gap-2 rounded-md bg-green-500 px-4 py-2 font-medium text-white transition-colors hover:bg-green-600"
              onClick={() => setActiveQuestionIndex(activeQuestionIndex + 1)}
            >
              Next
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m9 18 6-6-6-6" />
              </svg>
            </button>
          )}

          {activeQuestionIndex == interviewQuestions?.length - 1 && (
            <Link href={`/interview/${params.interviewId}/feedback`}>
              <button className="flex items-center gap-2 rounded-md bg-green-500 px-4 py-2 font-medium text-white transition-colors hover:bg-green-600">
                Complete
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12l5 5L20 7" />
                </svg>
              </button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default StartInterview;
