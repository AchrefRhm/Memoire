"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { Loader2, CheckCircle } from "lucide-react"; // Icons
import { toast, ToastContainer } from "react-toastify";
import { useChallenge } from "@/context/ChallengeContext";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

interface Challenge {
  title: string;
  question: string;
}

export default function ChallengePage() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [answer, setAnswer] = useState<string>("");
  const [timer, setTimer] = useState<number>(600); // 10 min in seconds
  const [isActive, setIsActive] = useState<boolean>(false);
  const [endSubmisssion, setEndSubmission] = useState<boolean>(false);
  const { challenge } = useChallenge();
  const challengeId = localStorage.getItem("challengeId");
  const { user } = useAuth();
  const handleAnswerSubmit = async () => {
    if (!challenge) return;
    if (timer > 0 && !answer) {
      toast.error("Please write your answer before submitting", {
        position: "bottom-right",
        className: "text-sm",
      });
      return;
    }

    try {
      const IdofChallenge = challenge._id;
      await axios.post("/api/challenges/submit-challenge", {
        userId: user._id,
        challengeId: IdofChallenge.toString(),
        answer: answer,
      });

      localStorage.setItem("challengeId", IdofChallenge);

      setEndSubmission(true);

      setIsActive(false);
    } catch (err) {
      setError("Erreur lors de la soumission du défi !");
    }
  };

  useEffect(() => {
    let countdown: NodeJS.Timeout;

    if (isActive && timer > 0) {
      countdown = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000); // Update every second for accuracy
    } else if (timer === 0 && isActive) {
      setIsActive(false); // Deactivate the timer once it reaches 0

      handleAnswerSubmit();
    }

    return () => clearInterval(countdown); // Cleanup on unmount
  }, [isActive, timer]);

  // Use this to handle the submission when the timer ends and the answer is updated

  const handleStart = () => {
    setIsActive(true);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${minutes}:${sec < 10 ? "0" : ""}${sec}`;
  };

  return (
    <div className="mx-auto max-w-lg rounded-lg bg-white p-6 shadow-md">
      {!challenge || endSubmisssion ? (
        <>
          <p className="text-center text-lg font-semibold text-gray-700">
            Défi du jour terminé ! Revenez demain.
          </p>
          <Link href={`/defit/resultat/${challengeId}`}>
            Voir resultat du défit de ce jour
          </Link>
        </>
      ) : (
        <div>
          <h2 className="mb-6 text-center text-3xl font-bold">
            💡 Défi du Jour
          </h2>

          <div className="animate-fade-in h-[50%] text-center">
            <CheckCircle className="mx-auto mb-3 h-12 w-12 text-green-400" />
            <h3 className="text-2xl font-semibold">{challenge?.title}</h3>
            <p className="mt-4 text-left">{challenge?.question}</p>

            {isActive && (
              <p className="text-center text-xl font-bold text-red-500">
                Temps restant: {formatTime(timer)}
              </p>
            )}

            <textarea
              className="mt-4 w-full rounded-md border border-gray-300 bg-gray-100 p-3 text-black transition-all focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Répondez au défi ici..."
              rows={5}
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              disabled={!isActive}
            ></textarea>

            {!isActive ? (
              <button
                className="mt-4 w-full rounded-md bg-green-500 py-3 text-lg font-semibold text-white transition hover:bg-green-600"
                onClick={handleStart}
              >
                Démarrer le défi
              </button>
            ) : (
              <button
                className="mt-4 w-full rounded-md bg-blue-600 py-3 text-lg font-semibold text-white transition hover:bg-blue-700"
                onClick={handleAnswerSubmit}
              >
                Soumettre la réponse
              </button>
            )}
          </div>
        </div>
      )}
      <ToastContainer />
    </div>
  );
}
