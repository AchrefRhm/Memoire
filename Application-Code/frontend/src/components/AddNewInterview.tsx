import React, { useState } from "react";
import axios from "axios";
import Modal from "react-modal";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import PremiumFeatureModal from "./PremiumFeatureModal";

const AddNewInterview = () => {
  const [open, setOpen] = useState(false);
  const [job, setJob] = useState("");
  const [description, setDescription] = useState("");
  const [yearsOfExperience, setYearsOfExperience] = useState("");
  const [interviewType, setInterviewType] = useState("technical"); // Default to technical
  const [loading, setLoading] = useState(false);
  const [jsonResponse, setJsonResponse] = useState([]);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [upgradeInfo, setUpgradeInfo] = useState(null);
  const closeUpgradeModal = () => {
    setShowUpgradeModal(false);
    window.location.reload();
  };

  const router = useRouter();
  const handleOpen = () => setOpen(!open);
  const onRequestClose = () => setOpen(false);
  const { user } = useAuth();

  const handleSubmit = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setLoading(true);
      e.preventDefault();
      const response = await axios.post("http://k8s-threetie-mainlb-11c5700e30-1182053200.us-east-1.elb.amazonaws.com/api/interview", {
        job: user?.job,
        description,
        yearsOfExperience,
        interviewType, // Add interview type to the request
        user: user._id,
      });
      console.log(response);
      setJsonResponse(response.data.interview.questions);
      setLoading(false);
      router.push(`/interview/${response.data.interview._id}`);
    } catch (error: unknown) {
      if (error.response?.data?.upgradeRequired) {
        setUpgradeInfo(error.response.data.upgradeInfo);
        setShowUpgradeModal(true);
      } else {
        console.error(
          error.response?.data?.message || "Error generating interview",
        );
      }
    }
  };

  return (
    <div className="w-[100%]">
      <div className="w-fit cursor-pointer rounded-lg border border-[#10B981] bg-transparent px-24 py-8 text-[#10B981] transition-all hover:scale-105 hover:shadow-lg ">
        <h2 className="text-center text-lg font-bold" onClick={handleOpen}>
          + Add New
        </h2>
      </div>

      <PremiumFeatureModal
        isOpen={showUpgradeModal}
        onClose={() => closeUpgradeModal()}
        featureName={
          upgradeInfo?.recommendedPlan === "premium"
            ? "Premium Features"
            : "Ultimate Features"
        }
        featureDescription={upgradeInfo?.message}
        ctaText="Upgrade Now"
        planType={upgradeInfo?.recommendedPlan}
      />
      <Modal
        isOpen={open}
        onRequestClose={onRequestClose}
        contentLabel="Order Modal"
        className="fixed left-1/2 top-1/2 z-50 w-[90%] max-w-[600px]  -translate-x-1/2 -translate-y-1/2 transform rounded-md bg-white p-4 shadow-lg outline-none dark:bg-[#1A222C] lg:left-[calc((100vw-290px)/2+290px)]"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50"
      >
        <button
          onClick={onRequestClose}
          className="absolute right-3 top-1 z-10 text-black dark:text-white"
        >
          x
        </button>
        <div className="p-4">
          <h1 className="text-xl font-bold text-black dark:text-white">
            Tell us more about your job interviewing
          </h1>
          <p className="mt-1 text-xs text-gray-500 dark:text-white">
            Add details about your job position/role, job description, and years
            of experience.
          </p>

          <div className="mt-4 space-y-4">
            {/* Interview Type Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-white">
                Interview Type
              </label>
              <div className="mt-2 flex gap-4">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    className="h-4 w-4 text-green-600 focus:ring-green-500"
                    name="interviewType"
                    value="technical"
                    checked={interviewType === "technical"}
                    onChange={() => setInterviewType("technical")}
                  />
                  <span className="ml-2 text-gray-700 dark:text-white">
                    Technical Interview
                  </span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    className="h-4 w-4 text-green-600 focus:ring-green-500"
                    name="interviewType"
                    value="hr"
                    checked={interviewType === "hr"}
                    onChange={() => setInterviewType("hr")}
                  />
                  <span className="ml-2 text-gray-700 dark:text-white">
                    HR Interview
                  </span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-white">
                Job Position/Role
              </label>
              <input
                type="text"
                value={user?.job}
                disabled
                className="mt-1 w-full rounded-md border p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Enter job position"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-white">
                {interviewType === "technical"
                  ? "Job Description/Skills"
                  : "Key Areas to Focus On"}
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="mt-1 w-full rounded-md border p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder={
                  interviewType === "technical"
                    ? "Enter job description and technical skills"
                    : "Enter key HR topics (e.g., teamwork, leadership, conflict resolution)"
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-white">
                Years of Experience
              </label>
              <input
                type="number"
                value={yearsOfExperience}
                onChange={(e) => setYearsOfExperience(e.target.value)}
                className="mt-1 w-full rounded-md border p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Enter years of experience"
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-4">
            <button
              onClick={onRequestClose}
              className="rounded-md bg-gray-500 px-4 py-2 text-white hover:bg-gray-600"
            >
              Cancel
            </button>
            {loading ? (
              <button
                className="focus:shadow-outline flex items-center rounded bg-green-500 px-4 py-2 font-bold text-white hover:bg-green-600 focus:outline-none"
                disabled
              >
                <svg
                  className="-ml-1 mr-3 h-5 w-5 animate-spin text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    stroke-width="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Loading...
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="rounded-md bg-green-500 px-4 py-2 text-white hover:bg-green-600"
              >
                Submit
              </button>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AddNewInterview;
