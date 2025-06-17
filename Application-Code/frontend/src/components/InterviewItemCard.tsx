import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";

const InterviewItemCard = ({ interview }) => {
  const router = useRouter();
  const onStart = () => {
    router.push("/interview/" + interview?._id);
  };
  const onFeedbackPress = () => {
    router.push("/interview/" + interview._id + "/feedback");
  };
  return (
    <div className="rounded-lg border p-3 shadow-sm">
      <h2 className="text-bold font-bold">{interview?.job}</h2>
      <h2 className="text-sm text-gray-600">
        {interview.yearsOfExperience} Years of Experience
      </h2>
      <h2 className="text-xs text-gray-400">
        Created At: {interview.createdAt.slice(0, 10)}
      </h2>
      <div className="mt-2 flex justify-between gap-5">
        <button
          onClick={onFeedbackPress}
          className="mr-2  w-full rounded-md border p-2 text-sm font-semibold text-black dark:text-white"
        >
          Feedback
        </button>

        <button
          onClick={onStart}
          className=" w-full rounded-md bg-green-500 p-2 text-sm text-white hover:bg-green-600"
        >
          Start
        </button>
      </div>
    </div>
  );
};

export default InterviewItemCard;
