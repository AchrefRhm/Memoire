"use client";
import axios from "axios";
import React, { useState, useEffect } from "react";

interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
}

interface Params {
  quizId: string; // Adjusted to match the actual prop name.
}

const GetQuizAnswer = ({ params }: { params: Params }) => {
  const [quiz, setQuiz] = useState<QuizQuestion[]>([]); // Make sure quiz is always initialized as an array
  const [userAnswers, setUserAnswers] = useState<any[]>([]); // userAnswers will be an array of objects now
  const [score, setScore] = useState<number>(0);

  useEffect(() => {
    const fetchQuizData = async () => {
      try {
        const quizResponse = await axios.get(
          `/api/quiz/get-quiz/${params.quizId}`,
        );
        setQuiz(quizResponse.data.questions);

        const userAnswersResponse = await axios.get(
          `/api/quiz/get-userQuizAnswer/${params.quizId}`,
        );
        setUserAnswers(userAnswersResponse.data);
      } catch (error) {
        console.error("Error fetching quiz data:", error);
      }
    };

    if (params.quizId) fetchQuizData();
  }, [params.quizId]);

  console.log(userAnswers);
  const currentUserAnswers =
    userAnswers.length > 0 ? userAnswers[0].answers : [];
  return (
    <div className="mx-auto mt-4 max-w-xl rounded-2xl bg-gradient-to-br from-purple-50 to-blue-50 p-6 shadow-lg">
      <h2 className="mb-6 text-2xl font-bold text-gray-800">Quiz Results</h2>

      <div className="mb-8 overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg">
        <div className="flex items-center justify-between p-6 text-white">
          <span className="text-xl font-medium">Your Score:</span>
          <div className="flex flex-col items-end">
            <span className="text-5xl font-bold">
              {userAnswers[0]?.score
                ? Math.round(
                    (userAnswers[0]?.score * 100) / currentUserAnswers?.length,
                  )
                : 0}
              %
            </span>
            <span className="text-sm opacity-80">
              {userAnswers[0]?.score || 0} out of{" "}
              {currentUserAnswers?.length || 0} correct
            </span>
          </div>
        </div>
        <div className="h-2 bg-white bg-opacity-10">
          <div
            className="h-full bg-white"
            style={{
              width: `${userAnswers[0]?.score ? (userAnswers[0]?.score * 100) / currentUserAnswers?.length : 0}%`,
            }}
          ></div>
        </div>
      </div>

      {Array.isArray(quiz) && quiz.length > 0 && currentUserAnswers ? (
        <div className="space-y-6">
          {quiz.map((q, i) => {
            const correctAnswer = q.correctAnswer;
            const userAnswer = currentUserAnswers[i];

            return (
              <div
                key={i}
                className="rounded-xl border border-gray-200 bg-white p-5 shadow-md transition-all duration-200 hover:shadow-lg"
              >
                <div className="mb-4 flex items-start justify-between">
                  <h3 className="pr-3 text-lg font-medium text-gray-800">
                    {q.question}
                  </h3>
                  {userAnswer?.isCorrect ? (
                    <span className="flex-shrink-0 rounded-full bg-green-100 p-1 text-green-600">
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        ></path>
                      </svg>
                    </span>
                  ) : (
                    <span className="flex-shrink-0 rounded-full bg-red-100 p-1 text-red-600">
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M6 18L18 6M6 6l12 12"
                        ></path>
                      </svg>
                    </span>
                  )}
                </div>

                <div className="space-y-2">
                  {q.options.map((option, j) => {
                    const isMultipleCorrect = Array.isArray(correctAnswer);
                    const isUserAnswerArray = Array.isArray(
                      userAnswer?.selectedOption,
                    );

                    const isSelected = isUserAnswerArray
                      ? userAnswer.selectedOption.includes(option)
                      : option === userAnswer?.selectedOption;

                    const isCorrect = isMultipleCorrect
                      ? correctAnswer.includes(option)
                      : option === correctAnswer;

                    let bgColor = "bg-gray-50 text-gray-700";
                    let borderColor = "border-transparent";
                    let icon = null;

                    if (isSelected && isCorrect) {
                      bgColor = "bg-green-50 text-green-700";
                      borderColor = "border-green-200";
                      icon = (
                        <svg
                          className="h-5 w-5 text-green-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 13l4 4L19 7"
                          ></path>
                        </svg>
                      );
                    } else if (isSelected && !isCorrect) {
                      bgColor = "bg-red-50 text-red-700";
                      borderColor = "border-red-200";
                      icon = (
                        <svg
                          className="h-5 w-5 text-red-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M6 18L18 6M6 6l12 12"
                          ></path>
                        </svg>
                      );
                    } else if (!isSelected && isCorrect) {
                      bgColor = "bg-blue-50 text-blue-700";
                      borderColor = "border-blue-200";
                      icon = (
                        <svg
                          className="h-5 w-5 text-blue-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          ></path>
                        </svg>
                      );
                    }

                    return (
                      <div
                        key={j}
                        className={`flex items-center justify-between rounded-lg border p-3 ${bgColor} ${borderColor}`}
                      >
                        <span>{option}</span>
                        {icon}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex h-40 items-center justify-center rounded-lg bg-white shadow">
          <div className="flex flex-col items-center">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
            <p className="mt-4 text-gray-600">Loading results...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default GetQuizAnswer;
