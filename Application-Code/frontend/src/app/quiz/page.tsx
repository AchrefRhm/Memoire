"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import TableComponent from "@/components/TableComponent";
import GenerateQuiz from "@/components/GenerateQuiz";
import { useAuth } from "@/context/AuthContext";

interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
  questionType: string;
  difficulty: "easy" | "medium" | "difficult";
}

interface UserQuiz {
  id: string;
  topic: string;
  difficulty: string;
  questionCount: number;
  questionType: string;
}

export default function Home() {
  const [quiz, setQuiz] = useState<QuizQuestion[]>([]);
  const [previousQuizzes, setPreviousQuizzes] = useState<UserQuiz[]>([]);
  const [selectedQuiz, setSelectedQuiz] = useState<UserQuiz | null>(null);
  const { user } = useAuth();
  const fetchPreviousQuizzes = async () => {
    try {
      const response = await axios.post<UserQuiz[]>("/api/quiz/get-quizez", {
        user: user._id,
      });
      setPreviousQuizzes(response.data.quizzes);
    } catch (error) {
      console.error("Error fetching previous quizzes:", error);
    }
  };

  useEffect(() => {
    fetchPreviousQuizzes();
  }, [quiz]);

  console.log(previousQuizzes);
  return (
    <DefaultLayout>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-6 dark:from-gray-900 dark:to-boxdark">
        <div className="mx-auto max-w-7xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-800 dark:text-white">
              AI Quiz Generator
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              Create, manage, and share interactive quizzes powered by AI
            </p>
          </div>

          {/* Main content */}
          <div className="grid gap-8 md:grid-cols-1 lg:grid-cols-7">
            {/* Left side - Quiz Generator */}
            <div className="lg:col-span-3">
              <div className="rounded-xl bg-white p-6 shadow-lg transition-shadow hover:shadow-xl dark:bg-boxdark">
                <div className="flex items-center space-x-3">
                  <div className="rounded-full bg-blue-100 p-2 dark:bg-blue-900">
                    <svg
                      className="h-6 w-6 text-blue-600 dark:text-blue-300"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                    Create New Quiz
                  </h2>
                </div>

                <div className="mt-6">
                  <GenerateQuiz />
                </div>
              </div>
            </div>

            {/* Right side - Previous Quizzes */}
            <div className="lg:col-span-4">
              {previousQuizzes.length > 0 && (
                <div className="rounded-xl bg-white p-6 shadow-lg transition-shadow hover:shadow-xl dark:bg-boxdark">
                  <div className="mb-6 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="rounded-full bg-purple-100 p-2 dark:bg-purple-900">
                        <svg
                          className="h-6 w-6 text-purple-600 dark:text-purple-300"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                          />
                        </svg>
                      </div>
                      <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                        Previous Quizzes
                      </h2>
                    </div>

                    <span className="rounded-full bg-purple-100 px-3 py-1 text-sm font-medium text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                      {previousQuizzes.length} Quizzes
                    </span>
                  </div>

                  <TableComponent
                    data={previousQuizzes}
                    onRowClick={setSelectedQuiz}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Selected Quiz Details - Conditionally rendered */}
          {selectedQuiz && (
            <div className="mt-8 rounded-xl bg-white p-6 shadow-lg dark:bg-boxdark">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                  Quiz Details: {selectedQuiz.topic}
                </h2>
                <button
                  onClick={() => setSelectedQuiz(null)}
                  className="rounded-full bg-gray-100 p-2 text-gray-600 transition-colors hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  <svg
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>

              <div className="grid gap-6 md:grid-cols-3">
                <div className="rounded-lg bg-blue-50 p-4 dark:bg-gray-800">
                  <h3 className="text-sm font-medium uppercase text-blue-700 dark:text-blue-300">
                    Difficulty
                  </h3>
                  <p className="mt-2 text-2xl font-bold text-gray-800 dark:text-white">
                    {selectedQuiz.difficulty}
                  </p>
                </div>

                <div className="rounded-lg bg-green-50 p-4 dark:bg-gray-800">
                  <h3 className="text-sm font-medium uppercase text-green-700 dark:text-green-300">
                    Questions
                  </h3>
                  <p className="mt-2 text-2xl font-bold text-gray-800 dark:text-white">
                    {selectedQuiz.questionCount}
                  </p>
                </div>

                <div className="rounded-lg bg-purple-50 p-4 dark:bg-gray-800">
                  <h3 className="text-sm font-medium uppercase text-purple-700 dark:text-purple-300">
                    Type
                  </h3>
                  <p className="mt-2 text-2xl font-bold text-gray-800 dark:text-white">
                    {selectedQuiz.questionType === "multiple correct"
                      ? "Multiple Choice"
                      : "Single Choice"}
                  </p>
                </div>
              </div>

              <div className="mt-6 flex space-x-4">
                <button className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white shadow-sm transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:bg-blue-700 dark:hover:bg-blue-800">
                  View Quiz
                </button>
                <button className="rounded-lg bg-white px-4 py-2 font-medium text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:bg-gray-800 dark:text-gray-200 dark:ring-gray-700 dark:hover:bg-gray-700">
                  Edit Quiz
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </DefaultLayout>
  );
}
