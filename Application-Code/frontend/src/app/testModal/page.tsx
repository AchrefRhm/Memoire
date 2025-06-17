"use client";

import { useState } from "react";
import PremiumFeatureModal from "@/components/PremiumFeatureModal";

export default function YourPage() {
  const [isPremiumModalOpen, setIsPremiumModalOpen] = useState(false);
  const [currentFeature, setCurrentFeature] = useState({
    name: "",
    description: "",
    planType: "premium",
  });

  const handlePremiumFeatureClick = (feature) => {
    setCurrentFeature(feature);
    setIsPremiumModalOpen(true);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-6 text-2xl font-bold">Your App Features</h1>

      {/* Example Premium Feature Button */}
      <button
        onClick={() =>
          handlePremiumFeatureClick({
            name: "Advanced Analytics",
            description:
              "Get detailed insights and analytics with our premium feature.",
            planType: "premium",
          })
        }
        className="flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2 hover:bg-gray-200"
      >
        <span>Analytics Dashboard</span>
        <span className="rounded-full bg-amber-100 px-2 py-1 text-xs text-amber-800">
          Premium
        </span>
      </button>

      {/* Example Ultimate Feature Button */}
      <button
        onClick={() =>
          handlePremiumFeatureClick({
            name: "AI Content Generation",
            description:
              "Create high-quality content automatically with our AI tools.",
            planType: "ultimate",
          })
        }
        className="mt-4 flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2 hover:bg-gray-200"
      >
        <span>AI Writer</span>
        <span className="rounded-full bg-purple-100 px-2 py-1 text-xs text-purple-800">
          Ultimate
        </span>
      </button>

      {/* Premium Feature Modal */}
      <PremiumFeatureModal
        isOpen={isPremiumModalOpen}
        onClose={() => setIsPremiumModalOpen(false)}
        featureName={currentFeature.name}
        featureDescription={currentFeature.description}
        planType={currentFeature.planType}
        ctaText={`Upgrade to ${currentFeature.planType}`}
      />
    </div>
  );
}
