"use client";
import Header from "@/components/Header";
import { Button } from "@material-tailwind/react";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import Webcam from "react-webcam";

interface PageProps {
  params: {
    interviewId: string; // Adjust the key based on your actual params structure
  };
}
const page: React.FC<PageProps> = ({ params }) => {
  const [data, setData] = useState(null);
  const [webCamEnabled, setWebCamEnabled] = useState(false);
  const fetchInterview = async () => {
    try {
      const response = await axios.get("/api/interview/" + params.interviewId);
      setData(response.data);
    } catch (error) {
      console.error("Error fetching interview:", error);
    }
  };
  useEffect(() => {
    fetchInterview();
  }, []);

  const handleStartInterview = () => {
    window.localStorage.setItem("webCamEnabled", JSON.stringify(webCamEnabled));
  };
  console.log(data);
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-6 dark:from-gray-800 dark:to-gray-900">
      <Header />
      <div className="container mx-auto my-8 max-w-6xl rounded-xl bg-white p-8 shadow-lg dark:bg-gray-800">
        <h2 className="mb-8 text-3xl font-bold tracking-tight text-gray-800 dark:text-white">
          Let's Get Started
        </h2>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {/* Left Column - Job Information */}
          <div className="flex flex-col gap-6">
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md dark:border-gray-700 dark:bg-gray-800">
              <h3 className="mb-4 text-xl font-semibold text-gray-800 dark:text-white">
                Job Details
              </h3>

              <div className="mb-4 flex flex-col gap-3">
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Job Role/Position
                  </span>
                  <span className="text-lg font-medium text-gray-800 dark:text-white">
                    {data?.job}
                  </span>
                </div>

                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Job Description/Tech Stack
                  </span>
                  <span className="text-lg font-medium text-gray-800 dark:text-white">
                    {data?.description}
                  </span>
                </div>

                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Years of Experience
                  </span>
                  <span className="text-lg font-medium text-gray-800 dark:text-white">
                    {data?.yearsOfExperience}
                  </span>
                </div>
              </div>
            </div>

            {/* Information Alert */}
            <div className="rounded-xl bg-amber-50 p-6 shadow-sm dark:bg-amber-900/20">
              <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 384 512"
                  className="h-5 w-5"
                  fill="currentColor"
                >
                  <path d="M297.2 248.9C311.6 228.3 320 203.2 320 176c0-70.7-57.3-128-128-128S64 105.3 64 176c0 27.2 8.4 52.3 22.8 72.9c3.7 5.3 8.1 11.3 12.8 17.7c0 0 0 0 0 0c12.9 17.7 28.3 38.9 39.8 59.8c10.4 19 15.7 38.8 18.3 57.5L109 384c-2.2-12-5.9-23.7-11.8-34.5c-9.9-18-22.2-34.9-34.5-51.8c0 0 0 0 0 0s0 0 0 0c-5.2-7.1-10.4-14.2-15.4-21.4C27.6 247.9 16 213.3 16 176C16 78.8 94.8 0 192 0s176 78.8 176 176c0 37.3-11.6 71.9-31.4 100.3c-5 7.2-10.2 14.3-15.4 21.4c0 0 0 0 0 0s0 0 0 0c-12.3 16.8-24.6 33.7-34.5 51.8c-5.9 10.8-9.6 22.5-11.8 34.5l-48.6 0c2.6-18.7 7.9-38.6 18.3-57.5c11.5-20.9 26.9-42.1 39.8-59.8c0 0 0 0 0 0s0 0 0 0s0 0 0 0c4.7-6.4 9-12.4 12.7-17.7zM192 128c-26.5 0-48 21.5-48 48c0 8.8-7.2 16-16 16s-16-7.2-16-16c0-44.2 35.8-80 80-80c8.8 0 16 7.2 16 16s-7.2 16-16 16zm0 384c-44.2 0-80-35.8-80-80l0-16 160 0 0 16c0 44.2-35.8 80-80 80z" />
                </svg>
                <h3 className="font-semibold">Information</h3>
              </div>
              <p className="mt-3 text-amber-700 dark:text-amber-300">
                Enable Video Web Cam and Microphone to Start your AI Generated Mock Interview,It Has 5 question which you can answer and at the last you will get the report on the basis of your answer. NOTE:We never record your video, Web cam access you can disable at any time if you want. 
              </p>
            </div>
          </div>

          {/* Right Column - Webcam */}
          <div className="flex flex-col justify-center rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md dark:border-gray-700 dark:bg-gray-800">
            <h3 className="mb-4 text-xl font-semibold text-gray-800 dark:text-white">
              Camera Preview
            </h3>

            {webCamEnabled ? (
              <div className="overflow-hidden rounded-lg">
                <Webcam
                  onUserMedia={() => setWebCamEnabled(true)}
                  onUserMediaError={() => setWebCamEnabled(false)}
                  mirrored={true}
                  className="h-auto w-full"
                />
              </div>
            ) : (
              <div className="flex flex-col items-center rounded-lg bg-gray-50 py-12 dark:bg-gray-900">
                <Image
                  src="/images/webcam.png"
                  alt="webcam Image"
                  width={120}
                  height={120}
                  className="mb-6 opacity-75"
                />
                <button
                  onClick={() => setWebCamEnabled(true)}
                  className="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:ring-offset-gray-900"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M16 16v1a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h2m5.66 0H14a2 2 0 0 1 2 2v3.34l1 1L23 7v10"></path>
                  </svg>
                  Enable Camera & Microphone
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Start Button */}
        <div className="mt-8 flex justify-end">
          <Link href={`/interview/${params.interviewId}/start`}>
            <button
              className="flex items-center gap-2 rounded-lg bg-green-600 px-6 py-3 font-medium text-white transition-colors hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:ring-offset-gray-900"
              onClick={handleStartInterview}
            >
              Start Interview
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14M12 5l7 7-7 7"></path>
              </svg>
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default page;
