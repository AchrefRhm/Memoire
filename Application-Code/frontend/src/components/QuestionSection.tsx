"use client";
import React, { useState } from "react";

interface Question {
  _id: string;
  question: string;
  answer: string;
}

interface QuestionSectionProps {
  interviewQuestions: Question[];
  activeQuestionIndex: number;
}
const QuestionSection: React.FC<QuestionSectionProps> = ({
  interviewQuestions,
  activeQuestionIndex,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const textToSpeech = (text: string) => {
    if ("speechSynthesis" in window) {
      setIsPlaying(true);
      const utterance = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(utterance);
      utterance.onend = () => setIsPlaying(false);
    } else {
      alert("Sorry, Your browser does not support text to speech");
    }
  };
  return (
    interviewQuestions && (
      <div className="rounded-lg border bg-white p-6 shadow-md dark:border-gray-700 dark:bg-boxdark">
        <h3 className="mb-6 text-xl font-semibold text-black dark:text-white">
          Interview Questions
        </h3>

        <div className="mb-8">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {interviewQuestions?.map(({ _id, question }, index) => (
              <div key={_id} className="flex justify-center">
                <div
                  className={`w-full cursor-pointer rounded-full border px-3 py-2 text-center text-xs font-medium transition-colors md:text-sm
                ${
                  activeQuestionIndex === index
                    ? "border-green-500 bg-green-500 text-white"
                    : "text-gray-700 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-800"
                }`}
                >
                  Q{index + 1}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg bg-gray-50 p-5 dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <h4 className="text-base font-medium text-gray-900 dark:text-white">
              Question #{activeQuestionIndex + 1}
            </h4>
            <button
              onClick={() =>
                textToSpeech(interviewQuestions[activeQuestionIndex]?.question)
              }
              className="flex items-center justify-center rounded-full p-2 text-gray-600 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-700"
              title="Listen to question"
              disabled={isPlaying}
            >
              {isPlaying ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 640 512"
                  className="h-5 w-5"
                >
                  <path
                    fill="currentColor"
                    d="M272 63.1l-32 0c-26.51 0-48 21.49-48 47.1v288c0 26.51 21.49 48 48 48L272 448c26.51 0 48-21.49 48-48v-288C320 85.49 298.5 63.1 272 63.1zM80 319.1l-32 0c-26.51 0-48 21.49-48 48L0 368c0 26.51 21.49 48 48 48h32c26.51 0 48-21.49 48-48l0-.0001C128 341.5 106.5 319.1 80 319.1z"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 640 512"
                  className="h-5 w-5"
                >
                  <path
                    fill="currentColor"
                    d="M533.6 32.5C598.5 85.2 640 165.8 640 256s-41.5 170.7-106.4 223.5c-10.3 8.4-25.4 6.8-33.8-3.5s-6.8-25.4 3.5-33.8C557.5 398.2 592 331.2 592 256s-34.5-142.2-88.7-186.3c-10.3-8.4-11.8-23.5-3.5-33.8s23.5-11.8 33.8-3.5zM473.1 107c43.2 35.2 70.9 88.9 70.9 149s-27.7 113.8-70.9 149c-10.3 8.4-25.4 6.8-33.8-3.5s-6.8-25.4 3.5-33.8C475.3 341.3 496 301.1 496 256s-20.7-85.3-53.2-111.8c-10.3-8.4-11.8-23.5-3.5-33.8s23.5-11.8 33.8-3.5zm-60.5 74.5C434.1 199.1 448 225.9 448 256s-13.9 56.9-35.4 74.5c-10.3 8.4-25.4 6.8-33.8-3.5s-6.8-25.4 3.5-33.8C393.1 284.4 400 271 400 256s-6.9-28.4-17.7-37.3c-10.3-8.4-11.8-23.5-3.5-33.8s23.5-11.8 33.8-3.5zM301.1 34.8C312.6 40 320 51.4 320 64l0 384c0 12.6-7.4 24-18.9 29.2s-25 3.1-34.4-5.3L131.8 352 64 352c-35.3 0-64-28.7-64-64l0-64c0-35.3 28.7-64 64-64l67.8 0L266.7 40.1c9.4-8.4 22.9-10.4 34.4-5.3z"
                  />
                </svg>
              )}
            </button>
          </div>

          <div className="mt-4 text-base text-gray-700 dark:text-gray-200">
            {interviewQuestions[activeQuestionIndex]?.question}
          </div>
        </div>

        <div className="mt-6 rounded-lg bg-blue-50 p-5 dark:bg-blue-900/20">
          <div className="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 384 512"
              className="h-5 w-5 fill-blue-600 dark:fill-blue-400"
            >
              <path d="M297.2 248.9C311.6 228.3 320 203.2 320 176c0-70.7-57.3-128-128-128S64 105.3 64 176c0 27.2 8.4 52.3 22.8 72.9c3.7 5.3 8.1 11.3 12.8 17.7c0 0 0 0 0 0c12.9 17.7 28.3 38.9 39.8 59.8c10.4 19 15.7 38.8 18.3 57.5L109 384c-2.2-12-5.9-23.7-11.8-34.5c-9.9-18-22.2-34.9-34.5-51.8c0 0 0 0 0 0s0 0 0 0c-5.2-7.1-10.4-14.2-15.4-21.4C27.6 247.9 16 213.3 16 176C16 78.8 94.8 0 192 0s176 78.8 176 176c0 37.3-11.6 71.9-31.4 100.3c-5 7.2-10.2 14.3-15.4 21.4c0 0 0 0 0 0s0 0 0 0c-12.3 16.8-24.6 33.7-34.5 51.8c-5.9 10.8-9.6 22.5-11.8 34.5l-48.6 0c2.6-18.7 7.9-38.6 18.3-57.5c11.5-20.9 26.9-42.1 39.8-59.8c0 0 0 0 0 0s0 0 0 0s0 0 0 0c4.7-6.4 9-12.4 12.7-17.7zM192 128c-26.5 0-48 21.5-48 48c0 8.8-7.2 16-16 16s-16-7.2-16-16c0-44.2 35.8-80 80-80c8.8 0 16 7.2 16 16s-7.2 16-16 16zm0 384c-44.2 0-80-35.8-80-80l0-16 160 0 0 16c0 44.2-35.8 80-80 80z" />
            </svg>
            <span className="font-medium text-blue-600 dark:text-blue-400">
              Important Note
            </span>
          </div>
          <p className="mt-3 text-sm text-blue-700 dark:text-blue-300">
            Click on Record Answer when you want to answer the question. At the end of interview we will give you the feedback along with correct answer to compare it.
              
          </p>
        </div>
      </div>
    )
  );
};

export default QuestionSection;
