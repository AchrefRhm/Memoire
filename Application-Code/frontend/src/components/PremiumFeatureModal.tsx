import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

const PremiumFeatureModal = ({
  isOpen,
  onClose,
  featureName,
  featureDescription,
  ctaText = "Upgrade Now",
  planType = "Premium",
}) => {
  const [isVisible, setIsVisible] = useState(isOpen);
  const router = useRouter();
  useEffect(() => {
    setIsVisible(isOpen);
  }, [isOpen]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="animate-fadeIn relative w-full max-w-md overflow-hidden rounded-lg bg-white shadow-xl dark:bg-gray-800">
        {/* Premium badge */}
        <div className="absolute right-0 top-0">
          <div
            className={`${planType === "premium" ? "bg-amber-500" : "bg-purple-600"} translate-x-5 translate-y-3 rotate-45 transform px-6 py-1 text-sm font-medium text-white`}
          >
            {planType}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 pt-8">
          <div className="mb-6 flex justify-center">
            <div
              className={`rounded-full p-3 ${planType === "premium" ? "bg-amber-100 text-amber-600" : "bg-purple-100 text-purple-600"}`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                />
              </svg>
            </div>
          </div>

          <h3 className="mb-2 text-center text-xl font-bold text-gray-900 dark:text-white">
            {featureName}
          </h3>

          <p className="mb-6 text-center text-gray-600 dark:text-gray-300">
            {featureDescription}
          </p>

          <div className="flex flex-col gap-3">
            <button
              onClick={() => {
                onClose();
                router.push(`/checkout/${planType}`);
              }}
              className={`w-full rounded-lg px-4 py-2 font-medium text-white ${
                planType === "premium"
                  ? "bg-amber-500 hover:bg-amber-600"
                  : "bg-purple-600 hover:bg-purple-700"
              } transition-colors duration-200`}
            >
              {ctaText}
            </button>

            <button
              onClick={onClose}
              className="w-full rounded-lg bg-gray-100 px-4 py-2 font-medium text-gray-700 transition-colors duration-200 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
            >
              Maybe Later
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PremiumFeatureModal;
