"use client";

import { useAuth } from "@/context/AuthContext";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
  questionType: "one correct" | "multiple correct";
}

interface Params {
  quizId: string;
}

const QuizPage = ({ params }: { params: Params }) => {
  const router = useRouter();
  const [quiz, setQuiz] = useState<QuizQuestion[]>([]);
  const [quizInfo, setQuizInfo] = useState();
  const [answers, setAnswers] = useState<{ [key: number]: string | string[] }>(
    {},
  );
  const { user } = useAuth();
  useEffect(() => {
    const fetchQuizData = async () => {
      try {
        const quizResponse = await axios.get(
          `/api/quiz/get-quiz/${params.quizId}`,
        );
        setQuiz(quizResponse.data.questions);
        setQuizInfo(quizResponse.data);
      } catch (error) {
        console.error("Error fetching quiz data:", error);
      }
    };

    if (params.quizId) fetchQuizData();
  }, [params.quizId]);

  const handleOptionChange = (questionIndex: number, option: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionIndex]:
        quizInfo?.questionType === "one correct"
          ? option // For single answer, just store the selected option
          : prev[questionIndex]?.includes(option)
            ? (prev[questionIndex] as string[]).filter(
                (item) => item !== option,
              ) // For multiple answers, toggle off
            : [...(prev[questionIndex] || []), option], // Add new option if it's not already selected
    }));
  };

  const handleSubmit = async () => {
    const formattedAnswers = Object.values(answers).map((answer) => ({
      selectedOption: Array.isArray(answer) ? answer : [answer], // Ensure it's always an array
    }));

    const payload = {
      user: user._id, // Replace with actual user ID
      quizId: params.quizId,
      answers: formattedAnswers,
    };

    try {
      const response = await axios.post("/api/quiz/submit", payload);
      console.log("Quiz submitted successfully:", response.data);
      router.push(`/quiz/getQuizAnswer/${params.quizId}`);
    } catch (error) {
      console.error("Error submitting quiz:", error);
    }
  };
  console.log(quizInfo);
  return (
    <div className="mx-auto mb-2 mt-4 max-w-2xl rounded-3xl bg-purple-50 p-8 shadow-xl">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-bold text-violet-500">
          Test your knowledge with this quiz
        </h1>
        <p className="mt-3 text-violet-400">Quiz Topic: {quizInfo?.topic}</p>
      </div>

      <div className="space-y-8">
        {quiz.map((question, index) => (
          <div
            key={index}
            className="rounded-3xl border-2 border-violet-200 bg-white p-6 shadow-md transition-all duration-300 hover:shadow-lg"
          >
            <h2 className="mb-5 flex items-center text-xl font-medium text-violet-700">
              <span className="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-violet-100 text-lg font-bold text-violet-500">
                {index + 1}
              </span>
              {question.question}
            </h2>
            <div className="space-y-3 pl-14">
              {question.options.map((option, optionIndex) => (
                <label
                  key={optionIndex}
                  className="flex cursor-pointer items-center space-x-3 rounded-xl p-3 transition-colors duration-200 hover:bg-violet-50"
                >
                  {quizInfo.questionType === "one correct" ? (
                    <div className="relative flex items-center justify-center">
                      <input
                        type="radio"
                        name={`question-${index}`}
                        checked={answers[index] === option}
                        onChange={() => handleOptionChange(index, option)}
                        className="peer absolute h-5 w-5 opacity-0"
                      />
                      <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-violet-300 peer-checked:border-violet-500 peer-checked:bg-violet-100">
                        <div className="h-3 w-3 rounded-full bg-violet-500 opacity-0 peer-checked:opacity-100"></div>
                      </div>
                    </div>
                  ) : (
                    <div className="relative flex items-center justify-center">
                      <input
                        type="checkbox"
                        name={`question-${index}`}
                        checked={answers[index]?.includes(option)}
                        onChange={() => handleOptionChange(index, option)}
                        className="peer absolute h-5 w-5 opacity-0"
                      />
                      <div className="flex h-6 w-6 items-center justify-center rounded-lg border-2 border-violet-300 peer-checked:border-violet-500 peer-checked:bg-violet-100">
                        <div className="h-3 w-3 rounded-sm bg-violet-500 opacity-0 peer-checked:opacity-100"></div>
                      </div>
                    </div>
                  )}
                  <span className="text-lg text-gray-700">{option}</span>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10">
        <button
          onClick={handleSubmit}
          className="w-full rounded-full bg-gradient-to-r from-violet-400 to-blue-400 px-6 py-4 font-medium text-white shadow-lg transition duration-300 hover:from-violet-500 hover:to-blue-500 hover:shadow-xl focus:outline-none"
        >
          Submit Answers
        </button>
      </div>
    </div>
  );
};

export default QuizPage;
