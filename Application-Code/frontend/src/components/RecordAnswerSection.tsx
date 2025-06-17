"use client";
import Image from "next/image";
import React, { useEffect, useState, useRef } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Webcam from "react-webcam";
import useSpeechToText from "react-hook-speech-to-text";
import axios from "axios";
import { useParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

interface Question {
  _id: string;
  question: string;
  answer: string;
}
interface QuestionSectionProps {
  interviewQuestions: Question[];
  activeQuestionIndex: number;
}

const RecordAnswerSection: React.FC<QuestionSectionProps> = ({
  interviewQuestions,
  activeQuestionIndex,
}) => {
  const [userAnswer, setUserAnswer] = useState("");
  const [textResponse, setTextResponse] = useState(""); // New state for text responses
  const [webCamEnabled, setWebCamEnabled] = useState<boolean>(false);
  const { interviewId } = useParams();
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const [inputMethod, setInputMethod] = useState<"voice" | "text">("voice");

  const recognitionRef = useRef<any>(null);

  const {
    error,
    interimResult,
    isRecording,
    results,
    setResults,
    startSpeechToText,
    stopSpeechToText,
  } = useSpeechToText({
    continuous: true,
    useLegacyResults: false,
  });

  // Combine speech results
  useEffect(() => {
    const combinedResults = results
      .map((result) => result?.transcript)
      .join(" ");
    setUserAnswer(combinedResults);
  }, [results]);

  // Load webcam preference
  useEffect(() => {
    const storedValue = localStorage.getItem("webCamEnabled");
    if (storedValue !== null) {
      setWebCamEnabled(JSON.parse(storedValue));
    }
  }, []);

  const StartStopRecording = () => {
    if (isRecording) {
      stopSpeechToText();
      setTimeout(() => {
        if (userAnswer.length > 10) {
          UpdateUserAnswer();
        }
      }, 1000); // Delay to allow final result
    } else {
      setUserAnswer(""); // Clear previous result
      setResults([]);
      startSpeechToText();
    }
  };

  const UpdateUserAnswer = async () => {
    if (loading) return;

    try {
      setLoading(true);
      const answerToSubmit =
        inputMethod === "voice" ? userAnswer : textResponse;

      const response = await axios.post("/api/interview/saveFeedback", {
        interviewId,
        question: interviewQuestions[activeQuestionIndex]?.question,
        correctAns: interviewQuestions[activeQuestionIndex]?.answer,
        userAns: answerToSubmit,
        userEmail: user?.email,
      });

      toast.success("Answer recorded successfully", {
        position: "bottom-right",
        className: "text-sm",
      });

      // Reset appropriate state based on input method
      if (inputMethod === "voice") {
        setUserAnswer("");
        setResults([]);
      } else {
        setTextResponse("");
      }
    } catch (error: any) {
      console.error("Error saving feedback:", error);
      toast.error(
        error.response?.data?.message ||
          "An error occurred while saving feedback.",
        { position: "bottom-right" },
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitTextAnswer = (e: React.FormEvent) => {
    e.preventDefault();
    if (textResponse.trim().length > 0) {
      UpdateUserAnswer();
    } else {
      toast.error("Please provide an answer", {
        position: "bottom-right",
        className: "text-sm",
      });
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTextResponse(e.target.value);
  };

  return (
    <div className="rounded-lg border bg-white p-6 shadow-md dark:border-gray-700 dark:bg-boxdark">
      <h3 className="mb-4 text-xl font-semibold text-black dark:text-white">
        Record Your Answer
      </h3>

      {/* Webcam display */}
      <div className="mb-6">
        {webCamEnabled ? (
          <div className="relative flex h-64 items-center justify-center overflow-hidden rounded-lg border dark:border-gray-700">
            <Image
              src="/images/webcam.png"
              alt="webcam Image"
              width={200}
              height={200}
              className="absolute opacity-30"
            />
            <Webcam
              mirrored={true}
              className="h-full w-full object-cover"
              style={{ zIndex: 10 }}
            />
          </div>
        ) : (
          <div className="flex h-64 flex-col items-center justify-center rounded-lg border bg-gray-50 dark:border-gray-700 dark:bg-gray-800">
            <Image
              src="/images/webcam.png"
              alt="webcam Image"
              width={150}
              height={150}
              className="opacity-70"
            />
          </div>
        )}
      </div>

      {/* Input method selection */}
      <div className="mb-5 flex justify-center gap-4">
        <button
          className={`rounded-md border px-4 py-2 font-medium transition-colors ${
            inputMethod === "voice"
              ? "border-green-500 bg-green-500 text-white"
              : "border-gray-300 hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700"
          }`}
          onClick={() => setInputMethod("voice")}
        >
          Voice Input
        </button>
        <button
          className={`rounded-md border px-4 py-2 font-medium transition-colors ${
            inputMethod === "text"
              ? "border-green-500 bg-green-500 text-white"
              : "border-gray-300 hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700"
          }`}
          onClick={() => setInputMethod("text")}
        >
          Text Input
        </button>
      </div>

      {/* Voice input section */}
      {inputMethod === "voice" ? (
        <div className="flex flex-col items-center">
          <div className="mb-4 min-h-20 w-full rounded-lg border bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
            <p className="text-gray-700 dark:text-gray-300">
              {userAnswer || "Your voice response will appear here..."}
            </p>
          </div>
          <button
            disabled={loading}
            className={`flex items-center gap-2 rounded-md px-5 py-3 font-medium transition-colors ${
              isRecording
                ? "bg-red-500 text-white hover:bg-red-600"
                : "bg-green-500 text-white hover:bg-green-600"
            }`}
            onClick={StartStopRecording}
          >
            {isRecording ? (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 640 512"
                  className="h-5 w-5 fill-white"
                >
                  <path d="M38.8 5.1C28.4-3.1 13.3-1.2 5.1 9.2S-1.2 34.7 9.2 42.9l592 464c10.4 8.2 25.5 6.3 33.7-4.1s6.3-25.5-4.1-33.7L472.1 344.7c15.2-26 23.9-56.3 23.9-88.7l0-40c0-13.3-10.7-24-24-24s-24 10.7-24 24l0 40c0 21.2-5.1 41.1-14.2 58.7L416 300.8 416 96c0-53-43-96-96-96s-96 43-96 96l0 54.3L38.8 5.1zM344 430.4c20.4-2.8 39.7-9.1 57.3-18.2l-43.1-33.9C346.1 382 333.3 384 320 384c-70.7 0-128-57.3-128-128l0-8.7L144.7 210c-.5 1.9-.7 3.9-.7 6l0 40c0 89.1 66.2 162.7 152 174.4l0 33.6-48 0c-13.3 0-24 10.7-24 24s10.7 24 24 24l72 0 72 0c13.3 0 24-10.7 24-24s-10.7-24-24-24l-48 0 0-33.6z" />
                </svg>
                Stop Recording
              </>
            ) : (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 384 512"
                  className="h-5 w-5 fill-white"
                >
                  <path d="M192 0C139 0 96 43 96 96l0 160c0 53 43 96 96 96s96-43 96-96l0-160c0-53-43-96-96-96zM64 216c0-13.3-10.7-24-24-24s-24 10.7-24 24l0 40c0 89.1 66.2 162.7 152 174.4l0 33.6-48 0c-13.3 0-24 10.7-24 24s10.7 24 24 24l72 0 72 0c13.3 0 24-10.7 24-24s-10.7-24-24-24l-48 0 0-33.6c85.8-11.7 152-85.3 152-174.4l0-40c0-13.3-10.7-24-24-24s-24 10.7-24 24l0 40c0 70.7-57.3 128-128 128s-128-57.3-128-128l0-40z" />
                </svg>
                Record Answer
              </>
            )}
          </button>
        </div>
      ) : (
        // Text input section
        <div className="mt-2">
          <form
            onSubmit={handleSubmitTextAnswer}
            className="flex flex-col gap-3"
          >
            <textarea
              value={textResponse}
              onChange={handleTextChange}
              className="h-32 w-full rounded-lg border p-3 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              placeholder="Type your answer here..."
            />
            <button
              type="submit"
              disabled={loading}
              className="self-end rounded-md bg-green-500 px-5 py-2 font-medium text-white transition-colors hover:bg-green-600 disabled:cursor-not-allowed disabled:bg-green-300"
            >
              {loading ? "Submitting..." : "Submit Answer"}
            </button>
          </form>
        </div>
      )}

      <ToastContainer position="bottom-right" theme="colored" />
    </div>
  );
};

export default RecordAnswerSection;
