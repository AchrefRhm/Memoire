"use client";
import { useState } from "react";
import * as pdfjsLib from "pdfjs-dist";
import axios from "axios"; // Import axios for making API requests
import { PDFViewer } from "@react-pdf/renderer";
import CV from "../../../components/Cv";
import Header from "@/components/Header";
import { useAuth } from "@/context/AuthContext";
import PremiumFeatureModal from "@/components/PremiumFeatureModal";

pdfjsLib.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

export default function Home() {
  const [extractedText, setExtractedText] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [generatedCV, setGeneratedCV] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [modalPlanType, setModalPlanType] = useState("premium");
  const { user } = useAuth();
  const getCurrentSubscription = () => {
    return user?.subs;
  };
  const getGenerationCounts = () => {
    const counts = JSON.parse(
      localStorage.getItem("cvGenerationCounts") || "{}",
    );
    return {
      free: counts.free || 0,
      premium: counts.premium || 0,
    };
  };
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (file && file.type === "application/pdf") {
      try {
        const reader = new FileReader();
        reader.onload = async (e) => {
          const data = new Uint8Array(e.target.result);

          const pdf = await pdfjsLib.getDocument({ data }).promise;

          let text = "";
          for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
            const page = await pdf.getPage(pageNum);
            const textContent = await page.getTextContent();

            textContent.items.forEach((item) => {
              text += item.str + " ";
            });
          }
          setExtractedText(text);
        };
        reader.readAsArrayBuffer(file);
      } catch (error) {
        console.error("Error parsing PDF:", error);
      }
    } else {
      console.log("Something went wrong");
    }
  };
  console.log(extractedText);
  const handleGenerate = async () => {
    const currentSubscription = getCurrentSubscription();
    const counts = getGenerationCounts();

    // Check limits
    if (currentSubscription === "free" && counts.free >= 1) {
      setModalPlanType("premium");
      setShowPremiumModal(true);
      return;
    }

    if (currentSubscription === "premium" && counts.premium >= 10) {
      setModalPlanType("ultimate");
      setShowPremiumModal(true);
      return;
    }

    setIsLoading(true);
    setIsLoading(true);

    try {
      const response = await axios.post("/api/cv/generate", {
        cv: extractedText, // Assuming extractedText is your CV data
        jobDescription: jobDescription,
      });
      const updatedCounts = {
        free: currentSubscription === "free" ? counts.free + 1 : counts.free,
        premium:
          currentSubscription === "premium"
            ? counts.premium + 1
            : counts.premium,
      };
      localStorage.setItem("cvGenerationCounts", JSON.stringify(updatedCounts));
      setGeneratedCV(response.data); // Update with the generated CV from the backend
    } catch (error) {
      console.error("Error generating CV:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className=" dark:bg-gray-900">
      <Header />
      <PremiumFeatureModal
        isOpen={showPremiumModal}
        onClose={() => setShowPremiumModal(false)}
        featureName={
          modalPlanType === "premium"
            ? "Unlock 10 CV Generations"
            : "Unlimited CV Generations"
        }
        featureDescription={
          modalPlanType === "premium"
            ? "Upgrade to Premium to generate up to 10 customized CVs"
            : "Get Ultimate for unlimited CV generations and advanced features"
        }
        ctaText={`Upgrade to ${modalPlanType === "premium" ? "Premium" : "Ultimate"}`}
        planType={modalPlanType}
      />
      <div className="flex min-h-screen  flex-row gap-5 p-10">
        <div className="h-full flex-1 rounded-md p-5 dark:bg-gray-800">
          <h1 className="text-lg font-semibold">Preview the brand new CV</h1>
          {isLoading && (
            <div className="flex h-full flex-col items-center justify-center gap-2">
              <img
                className="h-20 w-20 animate-spin"
                src="https://www.svgrepo.com/show/70469/loading.svg"
                alt="Loading icon"
              />
            </div>
          )}
          <div className="h-screen">
            {!isLoading && generatedCV && (
              <PDFViewer width="100%" height={"100%"}>
                <CV key="CV" cvData={generatedCV} />
              </PDFViewer>
            )}
          </div>

          {!generatedCV && isLoading && <div>Loading...</div>}
        </div>
        <div className="flex h-full flex-1 flex-col justify-between p-5 dark:bg-gray-800">
          <div className="flex flex-col gap-5">
            <h1 className="text-lg font-semibold">Upload your old trash CV</h1>
            <div className="rounded-md border border-dashed border-gray-500 p-10 text-center hover:cursor-pointer hover:border-gray-400">
              <input
                type="file"
                accept="application/pdf"
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                Upload your old trash CV
              </label>
            </div>

            {extractedText && (
              <div className="mt-5 rounded-md p-5 dark:bg-gray-700">
                <h2 className="mb-2 font-semibold">Extracted Text:</h2>
                <div className="line-clamp-5 text-sm text-gray-300">
                  {extractedText}
                </div>
              </div>
            )}

            <h1 className="pt-5 text-lg font-semibold">
              Target Job Offer Description
            </h1>
            <textarea
              className="min-h-32 rounded-md p-5 font-semibold dark:bg-gray-700"
              placeholder="Paste the job description here"
              onChange={(e) => setJobDescription(e.target.value)}
              value={jobDescription}
            />
          </div>
          <button
            className="mt-6 max-w-48 self-center rounded bg-gradient-to-r from-green-400 to-blue-500 px-4 py-2 font-bold text-white"
            onClick={handleGenerate}
            disabled={isLoading}
          >
            Generate CV
          </button>
        </div>
      </div>
    </div>
  );
}
