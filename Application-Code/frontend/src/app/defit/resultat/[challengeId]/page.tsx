"use client";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Award, Calendar, CheckCircle, Lock, Users } from "lucide-react";
import { useEffect, useState } from "react";

interface Challenge {
  question: string;
  title: string;
  expiresAt: string;
}

interface UserChallenge {
  answer: string;
  score: number;
  feedback: string;
  solution: string;
  challengeId: Challenge;
}

interface UserChallengePageProps {
  params: {
    challengeId: string; // URL parameter for the challenge ID
  };
}

const UserChallengeDetails = ({ params }: UserChallengePageProps) => {
  const { challengeId } = params;
  const router = useRouter();
  const [isExpanded, setIsExpanded] = useState(false);
  const [userChallenge, setUserChallenge] = useState<UserChallenge | null>(
    null,
  );
  const { user } = useAuth();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserChallenge = async () => {
      try {
        // Fetch user challenge data using the userChallengeId
        const response = await axios.post(
          `/api/challenges/userAnswer/${challengeId}`,
          { user_id: user._id },
        );
        setUserChallenge(response.data.userChallenge);
      } catch (err) {
        setError("Unable to fetch user challenge data");
      }
    };

    fetchUserChallenge();
  }, [challengeId, userChallenge]);

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  if (!userChallenge) {
    return <div className="text-center">Loading...</div>;
  }
  function NewlineText(text) {
    const newText = text?.split(".").map((str) => <p>{str}</p>);

    return newText;
  }
  const otherSolutionFunc = () => {
    router.push(`/defit/otherSolutions/${challengeId}`);
  };
  const getScoreColor = (score) => {
    if (score >= 8) return "text-emerald-600";
    if (score >= 6) return "text-blue-600";
    if (score >= 4) return "text-amber-600";
    return "text-red-600";
  };
  return (
    <div className="container mx-auto my-10 max-w-4xl overflow-hidden rounded-xl bg-white shadow-xl">
      {/* Header with gradient background */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-6 text-white">
        <h2 className="text-2xl font-bold">User Challenge Details</h2>
        <p className="mt-1 text-indigo-100">
          Track your progress and review your solutions
        </p>
      </div>

      {/* Challenge info */}
      <div className="border-b border-gray-100 px-8 py-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="text-xl font-bold text-gray-900">
              {userChallenge.challengeId.title}
            </h3>
            <div className="mt-2 flex items-center text-sm text-gray-500">
              <Calendar size={16} className="mr-2" />
              <span>
                Expires:{" "}
                {new Date(userChallenge.challengeId.expiresAt).toLocaleString()}
              </span>
            </div>
          </div>

          <div className="flex items-center rounded-full bg-indigo-50 px-4 py-2">
            <span
              className={`text-xl font-bold ${getScoreColor(userChallenge.score)}`}
            >
              {userChallenge.score}
            </span>
            <span className="ml-1 text-gray-500">/10</span>
            <Award
              className={`ml-2 ${getScoreColor(userChallenge.score)}`}
              size={18}
            />
          </div>
        </div>

        <div className="mt-4 rounded-lg bg-gray-50 p-4">
          <p className="font-medium text-gray-700">
            <span className="mr-2 text-indigo-600">Question:</span>
            {userChallenge.challengeId.question}
          </p>
        </div>
      </div>

      {/* Answer and Feedback */}
      <div className="border-b border-gray-100 px-8 py-6">
        <h4 className="mb-3 flex items-center font-semibold text-gray-700">
          <CheckCircle size={18} className="mr-2 text-indigo-600" />
          Your Answer
        </h4>
        <div className="rounded-lg bg-gray-50 p-4 text-gray-800">
          {userChallenge.answer}
        </div>

        <h4 className="mb-3 mt-6 font-semibold text-gray-700">Feedback</h4>
        <div className="rounded-lg border-l-4 border-amber-500 bg-amber-50 p-4 text-gray-800">
          {userChallenge.feedback}
        </div>
      </div>

      {/* Solution */}
      <div className="px-8 py-6">
        <h4 className="mb-3 font-semibold text-gray-700">Solution</h4>
        <div
          className={`relative rounded-lg bg-gray-50 p-4 ${!isExpanded && "max-h-60 overflow-hidden"}`}
        >
          <pre className="font-sans whitespace-pre-line text-gray-800">
            {userChallenge.solution}
          </pre>

          {!isExpanded && (
            <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-gray-50 to-transparent"></div>
          )}
        </div>

        {userChallenge.solution.length > 200 && (
          <button
            className="mt-2 text-sm font-medium text-indigo-600 hover:text-indigo-800"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? "Show less" : "Show more"}
          </button>
        )}

        {/* See other solutions button */}
        <div className="mt-8 flex justify-center">
          <button
            onClick={otherSolutionFunc}
            className={`flex items-center rounded-full bg-indigo-600 px-6 py-3 text-white shadow-md transition hover:bg-indigo-700 ${user.subs === "free" ? "opacity-80" : ""}`}
            disabled={user.subs === "free"}
          >
            <Users size={18} className="mr-2" />
            See Other Solutions
            {user.subs === "free" && (
              <span className="ml-2 flex items-center text-xs">
                <Lock size={12} className="mr-1" />
                Premium Feature
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserChallengeDetails;
