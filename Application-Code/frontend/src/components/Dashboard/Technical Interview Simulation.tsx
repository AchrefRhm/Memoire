"use client";
import React from "react";
import AddNewInterview from "../AddNewInterview";
import InterviewList from "../InterviewList";

const ECommerce: React.FC = () => {
  return (
    <div className="min-h-screen p-3 dark:bg-boxdark">
      <h1 className="font-bold dark:text-white">Dashboard</h1>
      <p className="mb-6 mt-2 text-gray-700 dark:text-white">
        Create and start your AI Mockup interview
      </p>
      <AddNewInterview />
      <InterviewList />
    </div>
  );
};

export default ECommerce;
