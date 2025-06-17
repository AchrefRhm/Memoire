"use client";
// pages/bibliotheque-questions-rh.tsx
import { useState } from "react";
import { Search, ChevronDown, ChevronRight, Users } from "lucide-react";
import categories from "../../data/hr-questions";
import DefaultLayout from "@/components/Layouts/DefaultLayout";

export default function BibliothequeQuestionsRH() {
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedCategories, setExpandedCategories] = useState<number[]>([]);
  const [selectedQuestion, setSelectedQuestion] = useState<{
    categoryId: number;
    questionId: number;
  } | null>(null);

  const toggleCategory = (categoryId: number) => {
    if (expandedCategories.includes(categoryId)) {
      setExpandedCategories(
        expandedCategories.filter((id) => id !== categoryId),
      );
    } else {
      setExpandedCategories([...expandedCategories, categoryId]);
    }
  };

  const handleQuestionClick = (categoryId: number, questionId: number) => {
    setSelectedQuestion({ categoryId, questionId });
  };

  const filteredCategories = categories
    .map((category) => ({
      ...category,
      questions: category.questions.filter(
        (q) =>
          q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
          q.answer.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    }))
    .filter((category) => category.questions.length > 0);

  const getSelectedQuestion = () => {
    if (!selectedQuestion) return null;
    const category = categories.find(
      (c) => c.id === selectedQuestion.categoryId,
    );
    if (!category) return null;
    return category.questions.find((q) => q.id === selectedQuestion.questionId);
  };

  const currentQuestion = getSelectedQuestion();

  return (
    <DefaultLayout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h1 className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-4xl font-extrabold text-transparent sm:text-5xl sm:tracking-tight lg:text-6xl">
              Common Job Interview Questions
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-xl text-gray-600">
              Frequently asked interview questions with perfect sample answers
            </p>
          </div>

          <div className="relative mx-auto mb-12 max-w-xl">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full rounded-xl border border-gray-300 py-4 pl-10 pr-3 text-gray-900 placeholder-gray-500 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Rechercher des questions ou réponses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-8 lg:flex-row">
            {/* Left sidebar */}
            <div className="w-full overflow-hidden rounded-xl bg-white shadow-lg lg:w-1/3">
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6">
                <h2 className="text-xl font-bold text-white">
                  Catégories de Questions
                </h2>
              </div>
              <div className="divide-y divide-gray-200">
                {filteredCategories.map((category) => (
                  <div key={category.id} className="cursor-pointer">
                    <div
                      className="flex items-center justify-between p-4 hover:bg-indigo-50"
                      onClick={() => toggleCategory(category.id)}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-md bg-indigo-100 text-indigo-600">
                          {category.icon}
                        </div>
                        <h3 className="text-lg font-medium text-gray-900">
                          {category.name}
                        </h3>
                      </div>
                      {expandedCategories.includes(category.id) ? (
                        <ChevronDown className="h-5 w-5 text-gray-400" />
                      ) : (
                        <ChevronRight className="h-5 w-5 text-gray-400" />
                      )}
                    </div>

                    {expandedCategories.includes(category.id) && (
                      <div className="space-y-2 pb-4 pl-16 pr-4">
                        {category.questions.map((question) => (
                          <div
                            key={question.id}
                            className={`cursor-pointer rounded-lg p-3 text-sm ${
                              selectedQuestion?.questionId === question.id
                                ? "bg-indigo-100 font-medium text-indigo-700"
                                : "text-gray-700 hover:bg-gray-100"
                            }`}
                            onClick={() =>
                              handleQuestionClick(category.id, question.id)
                            }
                          >
                            {question.question}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Right content */}
            <div className="w-full lg:w-2/3">
              {currentQuestion ? (
                <div className="rounded-xl bg-white p-8 shadow-lg">
                  <h2 className="mb-6 text-2xl font-bold text-gray-900">
                    {currentQuestion.question}
                  </h2>
                  <div className="rounded-xl bg-indigo-50 p-6">
                    <h3 className="mb-3 text-lg font-medium text-indigo-800">
                      Réponse idéale:
                    </h3>
                    <p className="leading-relaxed text-gray-700">
                      {currentQuestion.answer}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex h-full flex-col items-center justify-center rounded-xl bg-white p-8 text-center shadow-lg">
                  <div className="mb-6 rounded-full bg-indigo-100 p-6">
                    <Users className="h-12 w-12 text-indigo-600" />
                  </div>
                  <h3 className="mb-2 text-2xl font-medium text-gray-800">
                    Préparez votre entretien
                  </h3>
                  <p className="max-w-md text-gray-500">
                    Sélectionnez une catégorie et une question dans la liste
                    pour voir la réponse idéale correspondante
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
}
